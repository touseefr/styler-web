<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Packages\CreatePackagesRequest;
use App\Repositories\Backend\Packages\PackagesContract;
use App\Models\SmsPackage\SmsPackage;
use App\Repositories\Backend\SmsPackage\SmsPackageContract;
use App\Repositories\Backend\ListingPackage\ListingPackageContract;
use App\SMSGlobalAccounts;
use App\PackagesPayment;
use Illuminate\Database\Eloquent\Builder;
use App\Jobs\StylerZoneEmails;
use App\Models\UserBusiness\UserBusiness;

class PackagesController extends Controller
{

    /**
     * [$schoolcolleges description]
     * @var [type]
     */
    protected $packages;
    protected $sms_package;
    protected $listing_package;

    function __construct(PackagesContract $packages, SmsPackageContract $sms_package, ListingPackageContract $listing_package)
    {
        $this->packages = $packages;
        $this->sms_package = $sms_package;
        $this->listing_package = $listing_package;
    }

    /**
     * @param CreatePackagesRequest $request
     * @return mixed
     */
    public function create(CreatePackagesRequest $request)
    {
        $package = $this->packages->findOrThrowException(1);
        return view('backend.packages.create')
            ->withPackagedetail($package);
    }

    /**
     * @param SaveSchoolcollegeRequest $request
     * @return mixed
     */
    public function update(CreatePackagesRequest $request)
    {

        // getting all of the post data

        $this->packages->update($request->all());

        return redirect()->route('backend.packages.create')->withFlashSuccess('Price has been updated successfully');
    }

    public function smspackage(CreatePackagesRequest $request)
    {
        $package = $this->sms_package->getAllPackages();
        return view('backend.sms-packages.index')
            ->withPackagedetail($package);
    }

    public function addsmspackage(CreatePackagesRequest $request)
    {
        return view('backend.sms-packages.create');
    }

    public function createsmspackage(CreatePackagesRequest $request)
    {
        try {
            $package = $this->sms_package->create($request->all());
            return redirect('admin/SmsPackage')->with(array('type' => 'alert-success', 'message' => 'SMS Package Saved Successfully.'));
        } catch (Exception $e) {
            return redirect('admin/SmsPackage')->with(array('type' => 'alert-danger', 'message' => 'Something went wrong.Please try later!'));
        }
    }

    public function updatesmspackage($id, CreatePackagesRequest $request)
    {
        try {
            $package = $this->sms_package->update($id);
            return redirect('admin/SmsPackage')->with(array('type' => 'alert-success', 'message' => 'SMS Package Updated Successfully.'));
        } catch (Exception $e) {
            return redirect('admin/SmsPackage')->with(array('type' => 'alert-danger', 'message' => 'Something went wrong.Please try later!'));
        }
    }

    public function destroysmspackage($id, CreatePackagesRequest $request)
    {
        $del = $this->sms_package->destroy($id);
        if ($del)
            return response(array('status' => 'success', 'message' => 'SMS Package Deleted Successfully'));
        else
            return response(array('status' => 'error', 'message' => 'Something went wrong.Please try later!'));
    }

    public function listingpackage(CreatePackagesRequest $request)
    {
        $package = $this->listing_package->getAllPackages();
        return view('backend.listing-packages.index')
            ->withPackagedetail($package);
    }

    public function addlistingpackage(CreatePackagesRequest $request)
    {
        return view('backend.listing-packages.create');
    }

    public function createlistingpackage(CreatePackagesRequest $request)
    {
        try {
            $package = $this->listing_package->create($request->all());
            return redirect('admin/ListingPackage')->with(array('type' => 'alert-success', 'message' => 'Listing Package Saved Successfully.'));
        } catch (Exception $e) {
            return redirect('admin/ListingPackage')->with(array('type' => 'alert-danger', 'message' => 'Something went wrong.Please try later!'));
        }
    }

    public function updatelistingpackage($id, CreatePackagesRequest $request)
    {
        try {
            $package = $this->listing_package->update($id);
            return redirect('admin/ListingPackage')->with(array('type' => 'alert-success', 'message' => 'Listing Package Updated Successfully.'));
        } catch (Exception $e) {
            return redirect('admin/ListingPackage')->with(array('type' => 'alert-danger', 'message' => 'Something went wrong.Please try later!'));
        }
    }

    public function destroylistingpackage($id, CreatePackagesRequest $request)
    {
        $del = $this->listing_package->destroy($id);
        if ($del)
            return response(array('status' => 'success', 'message' => 'Listing Package Deleted Successfully'));
        else
            return response(array('status' => 'error', 'message' => 'Something went wrong.Please try later!'));
    }

    public function fetchSubAccount()
    {
        $subAccounts = SMSGlobalAccounts::with('userDetail')->where("remote_account", "1")->get()->toArray();
        return view('backend.smsSubAccount.index')->withAccounts($subAccounts);
    }

    public function editSubAccount($subaccount_id)
    {
        $subAccount = SMSGlobalAccounts::where('id', $subaccount_id)->with('userDetail')->first()->toArray();
        return view('backend.smsSubAccount.create')->withAccount($subAccount);
    }

    public function saveSubAccount(CreatePackagesRequest $request, $subaccount)
    {
        if ($subaccount && ($request->has('api_key') && !empty($request->has('api_key'))) && ($request->has('api_secret') && !empty($request->has('api_secret')))) {
            $obj_sub_account = SMSGlobalAccounts::find($subaccount);
            $obj_sub_account->api_key = $request->input('api_key');
            $obj_sub_account->api_secret = $request->input('api_secret');
            $obj_sub_account->save();
            PackagesPayment::where('charge_transfer', '2')->where('user_id', $request->input('user_id'))->update(['charge_transfer' => '3']);
            return redirect('admin/list/smsglobal/subaccounts')->with(array('type' => 'alert-success', 'message' => 'Keys Successfully Updated.'));
        }
        return redirect('admin/list/subaccounts/keys/Requests')->with(array('type' => 'alert-danger', 'message' => 'Something went wrong.Please try later!'));
    }

    public function fetchKeysRequest()
    {
        $KeysRequests = PackagesPayment::with(['FetchSmsGlobalAccount', 'userDetails', 'FetchPackages'])->whereIn('charge_transfer', ['2', '3'])->get();
        return view('backend.smsSubAccount.keyRequests')->withKrequests($KeysRequests);
    }

    public function fundTransfer($package_id, $user_id)
    {
        if ($package_id && $user_id) {
            $data = PackagesPayment::where('id', $package_id)->with(['FetchSmsGlobalAccount', 'userDetails', 'FetchPackages'])->first();
            $package = SmsPackage::find($data->package_id);
            $data = $data->toArray();
            $userbusiness = UserBusiness::where('user_id', $user_id)->first();
            $userbusiness->update(['sms_count' => $userbusiness->sms_count + $package->limit, 'low_sms_email_alert' => 0]);
            PackagesPayment::where('id', $package_id)->where('charge_transfer', '3')->where('user_id', $user_id)->update(['charge_transfer' => '1']);

            $email_Detail = array(
                "customer" =>  $data['user_details']['name'],
                //                    "email" => "asifnaveed2013@gmail.com",
                "email" => $data['user_details']['email'],
                "package" => $data['fetch_packages']['name'],
                "id" => base64_encode($data['user_details']['id']),
            );
            StylerZoneEmails::dispatch($email_Detail, 'emails.subscription.customer_notify_sms_purchase');
            return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "Successfully fund transfer."));
        } else {
            return \GuzzleHttp\json_encode(array("status" => "210", "msg" => "Some thing went wrong.Please try again later"));
        }
    }

    public function userPackages(CreatePackagesRequest $request)
    {
        if ($request->ajax()) {
            $obj_userDetail = PackagesPayment::with(['FetchSmsGlobalAccount', 'userDetails', 'FetchPackages'])
                ->where('charge_transfer', ['1']);
            if (($request->has("fromDate") && !empty($request->input("fromDate"))) && ($request->has("toDate") && !empty($request->input("toDate")))) {
                $obj_userDetail->whereBetween('created_at', [$request->input("fromDate"), $request->input("toDate")]);
            } else {
                if ($request->has("fromDate") && !empty($request->input("fromDate"))) {
                    $obj_userDetail->where('created_at', '>=', $request->input("fromDate"));
                }
                if ($request->has("toDate") && !empty($request->input("toDate"))) {
                    $obj_userDetail->where('created_at', '<=', $request->input("toDate"));
                }
            }
            if ($request->has("userName") && !empty($request->input("userName"))) {
                $name = $request->input('userName');
                $obj_userDetail->whereHas('userDetails', function (Builder $query) use ($name) {
                    $query->where('name', 'like', '%' . $name . '%');
                });
            } //                            
            $usersInfo = $obj_userDetail->orderBy('id', 'desc')->get();
            $users = array();
            if ($usersInfo->count() > 0) {
                foreach ($usersInfo->toArray() as $index => $user) {
                    $users[] = array(
                        $user['user_details']['name'],
                        $user['user_details']['email'],
                        $user['package_type'],
                        $user['fetch_packages']['name'],
                        $user['created_at']
                    );
                }

                return \GuzzleHttp\json_encode(array("status" => "200", "data" => $users));
            } else {
                return \GuzzleHttp\json_encode(array("status" => "200", "data" => []));
            }
        } else {
            $userDetail = PackagesPayment::with(['FetchSmsGlobalAccount', 'userDetails', 'FetchPackages'])->whereIn('charge_transfer', ['1'])->orderBy('id', 'desc')->get();
            return view('backend.smsSubAccount.userPackages')->withUsers($userDetail->toArray());
        }
    }
}
