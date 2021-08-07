<?php

namespace App\Repositories\Backend\User;

use App\Models\Access\User\User;
use App\Exceptions\GeneralException;
use App\Repositories\Backend\Role\RoleRepositoryContract;
use App\Repositories\Frontend\Auth\AuthenticationContract;
use App\Exceptions\Backend\Access\User\UserNeedsRolesException;
use App\Models\UserSubscription\UserSubscription;
use DB;

/**
 * Class EloquentUserRepository
 * @package App\Repositories\User
 */
class EloquentUserRepository implements UserContract {

    /**
     * @var RoleRepositoryContract
     */
    protected $role;

    /**
     * @var AuthenticationContract
     */
    protected $auth;

    /**
     * @param RoleRepositoryContract $role
     * @param AuthenticationContract $auth
     */
    public function __construct(RoleRepositoryContract $role, AuthenticationContract $auth) {
        $this->role = $role;
        $this->auth = $auth;
    }

    /**
     * @param $id
     * @param bool $withRoles
     * @return mixed
     * @throws GeneralException
     */
    public function findOrThrowException($id, $withRoles = false) {
        if ($withRoles)
            $user = User::with('roles')->withTrashed()->find($id);
        else
            $user = User::withTrashed()->find($id);

        if (!is_null($user))
            return $user;

        throw new GeneralException('That user does not exist.');
    }

    /**
     * @param $per_page
     * @param string $order_by
     * @param string $sort
     * @param int $status
     * @return mixed
     */
    public function getUsersPaginated($per_page, $status = 1, $order_by = 'id', $sort = 'desc') {
        $bsusers = User::with('roles')->with('UserBusiness')->with('UserSubscription')->orderBy($order_by, $sort);
        $getRoles = array("business_user" => array('ServiceProvider', 'Distributor', 'SchoolCollege'), "other_users" => array("JobSeeker", "Individual"));
        $bsusers = $bsusers->ofrolesin($getRoles['business_user']);
        $business_users = $bsusers->take(500)->get();
        $otherusers = User::with('roles')->orderBy($order_by, $sort);
        $otherusers = $otherusers->ofrolesin($getRoles['other_users']);
        $other_users = $otherusers->take(500)->get();
        $users = array("business_user" => $business_users, "other_users" => $other_users);
        return $users;
    }

    /**
     * @param $per_page
     * @return \Illuminate\Pagination\Paginator
     */
    public function getDeletedUsersPaginated($per_page) {
        return User::onlyTrashed()->paginate($per_page);
    }

    /**
     * @param string $order_by
     * @param string $sort
     * @return mixed
     */
    public function getAllUsers($order_by = 'id', $sort = 'asc') {
        return User::orderBy($order_by, $sort)->get();
    }

    /**
     * @param $input
     * @param $roles
     * @param $permissions
     * @return bool
     * @throws GeneralException
     * @throws UserNeedsRolesException
     */
    public function create($input, $roles, $permissions) {

        $user = $this->createUserStub($input);

        if ($user->save()) {
            //User Created, Validate Roles
            $this->validateRoleAmount($user, $roles['assignees_roles']);

            //Attach new roles
            $user->attachRoles($roles['assignees_roles']);
            \Illuminate\Support\Facades\DB::table('user_business')->insert(['user_id' => $user->id]);

            //Attach other permissions
//            $user->attachPermissions($permissions['permission_user']);
            $objUserSubscrip = new UserSubscription(array(
                "plan_id" => $input['packeage'],
                "plan_status" => "1"
            ));
            $user->UserSubscription()->save($objUserSubscrip);

            //Send confirmation email if requested
            if (isset($input['confirmation_email']) && $user->confirmed == 0)
                $this->auth->resendConfirmationEmail($user->id);

            return true;
        }

        throw new GeneralException('There was a problem creating this user. Please try again.');
    }

    /**
     * @param $id
     * @param $input
     * @param $roles
     * @return bool
     * @throws GeneralException
     */
    public function update($id, $input, $roles, $permissions, $subscription = "") {
//        echo "<pre>";
//        print_r($subscription);
//        exit;
        $user = $this->findOrThrowException($id);
        $this->checkUserByEmail($input, $user);

        if ($user->update($input)) {
            //For whatever reason this just wont work in the above call, so a second is needed for now
            $user->status = isset($input['status']) ? 1 : 0;
            $user->confirmed = isset($input['confirmed']) ? 1 : 0;
            $user->save();
            if (!empty($subscription)) {
                if ($subscription['packeage'] != $subscription['pre_package_id']) {
                    $this->updateSubscription($id, $subscription['packeage']);
                }
            }
            $this->checkUserRolesCount($roles);
            $this->flushRoles($roles, $user);
            $this->flushPermissions($permissions, $user);
            return true;
        }

        throw new GeneralException('There was a problem updating this user. Please try again.');
    }

    public function updateSubscription($user_id, $new_plan_id) {
        DB::table("user_subscription")->where('user_id', $user_id)
                ->update(['plan_status' => 0]);
        $id = DB::table('user_subscription')->insertGetId(
                ['user_id' => $user_id, 'plan_status' => 1, 'plan_id' => $new_plan_id]
        );
        return $id;
    }

    /**
     * @param $id
     * @param $input
     * @return bool
     * @throws GeneralException
     */
    public function updatePassword($id, $input) {
        $user = $this->findOrThrowException($id);

        //Passwords are hashed on the model
        $user->password = $input['password'];
        if ($user->save())
            return true;

        throw new GeneralException('There was a problem changing this users password. Please try again.');
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function destroy($id) {
        if (auth()->id() == $id)
            throw new GeneralException("You can not delete yourself.");

        $user = $this->findOrThrowException($id);
        if ($user->delete())
            return true;

        throw new GeneralException("There was a problem deleting this user. Please try again.");
    }

    /**
     * @param $id
     * @return boolean|null
     * @throws GeneralException
     */
    public function delete($id) {
        $user = $this->findOrThrowException($id, true);

        //Detach all roles & permissions
        $user->detachRoles($user->roles);
        $user->detachPermissions($user->permissions);

        try {
            $user->forceDelete();
        } catch (\Exception $e) {
            throw new GeneralException($e->getMessage());
        }
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function restore($id) {
        $user = $this->findOrThrowException($id);

        if ($user->restore())
            return true;

        throw new GeneralException("There was a problem restoring this user. Please try again.");
    }

    /**
     * @param $id
     * @param $status
     * @return bool
     * @throws GeneralException
     */
    public function mark($id, $status) {
        if (auth()->id() == $id && ($status == 0 || $status == 2))
            throw new GeneralException("You can not do that to yourself.");

        $user = $this->findOrThrowException($id);
        $user->status = $status;

        if ($user->save())
            return true;

        throw new GeneralException("There was a problem updating this user. Please try again.");
    }

    /**
     * Check to make sure at lease one role is being applied or deactivate user
     * @param $user
     * @param $roles
     * @throws UserNeedsRolesException
     */
    private function validateRoleAmount($user, $roles) {
        //Validate that there's at least one role chosen, placing this here so
        //at lease the user can be updated first, if this fails the roles will be
        //kept the same as before the user was updated
//        print_r($user);
//        print_r($roles);        
//        if (count($roles) == 0) {
        //Deactivate user
        $user->status = 0;
        $user->save();

        $exception = new UserNeedsRolesException();
        $exception->setValidationErrors('You must choose at lease one role. User has been created but deactivated.');

        //Grab the user id in the controller
        $exception->setUserID($user->id);
//            throw $exception;
//        }
    }

    /**
     * @param $input
     * @param $user
     * @throws GeneralException
     */
    private function checkUserByEmail($input, $user) {
        //Figure out if email is not the same
        if ($user->email != $input['email']) {
            //Check to see if email exists
            if (User::where('email', '=', $input['email'])->first())
                throw new GeneralException('That email address belongs to a different user.');
        }
    }

    /**
     * @param $roles
     * @param $user
     */
    private function flushRoles($roles, $user) {
        //Flush roles out, then add array of new ones
        $user->detachRoles($user->roles);
        $user->attachRoles($roles['assignees_roles']);
    }

    /**
     * @param $permissions
     * @param $user
     */
    private function flushPermissions($permissions, $user) {
        //Flush permissions out, then add array of new ones if any
        $user->detachPermissions($user->permissions);
        if (!empty($permissions['permission_user']) && count($permissions['permission_user']) > 0) {
            $user->attachPermissions($permissions['permission_user']);
        }
    }

    /**
     * @param $roles
     * @throws GeneralException
     */
    private function checkUserRolesCount($roles) {
        //User Updated, Update Roles
        //Validate that there's at least one role chosen
        if (count($roles['assignees_roles']) == 0)
            throw new GeneralException('You must choose at least one role.');
    }

    /**
     * @param $input
     * @return mixed
     */
    private function createUserStub($input) {
        $user = new User;
        $user->name = $input['name'];
        $user->email = $input['email'];
        $user->password = $input['password'];
        $user->status = isset($input['status']) ? 1 : 0;
        $user->confirmation_code = md5(uniqid(mt_rand(), true));
        $user->confirmed = isset($input['confirmed']) ? 1 : 0;
        return $user;
    }

    public function getUserSearch($input, $order_by = 'id', $sort = 'asc') {
        $userQuery = User::with('roles')->with('UserBusiness')->with('UserSubscription');

        if (isset($input['userName']) && !empty($input['userName'])) {
            $userQuery->where('name', 'like', '%' . $input['userName'] . '%');
        }
        if (isset($input['fromDate']) && !empty($input['fromDate'])) {

            $todate = $input['toDate'];
            if (isset($input['toDate']) && empty($input['toDate'])) {
                $todate = Date('Y-m-d');
            }
            $userQuery->whereBetween('created_at', [$input['fromDate'], $todate]);
        }
        $userdata = $userQuery->get();
        $users = array();
        $packages = array("Trendy - Basic", "Artistic - Medium", "Glamours - Premium");
        $confirm = array("No", "Yes");
        $active = array(
            "<p class='deactive-user'>Deactive</p>",
            "<p class='active-user'>Active</p>",
            "<p class='banned-user'>Banned</p>"
        );
        foreach ($userdata as $user) {
            $users[] = array(
                $user->id,
                $user->name . $active[$user['status']],
                $user->email,
                $user->confirmed_label,
                (isset($user->roles) && count($user->roles) > 0) ? $user->roles[0]->name : '',
                (isset($user->UserSubscription) && count($user->UserSubscription) > 0) ? $packages[$user->UserSubscription[0]->plan_id] : 'Free User',
                date('Y-m-d', strtotime($user->created_at->toDateTimeString())),
                date('Y-m-d', strtotime($user->updated_at->toDateTimeString())),
                $user->action_buttons
            );
        }

        return $users;
    }

}
