<?php namespace App\Repositories\Backend\Schoolcolleges;

use App\Exceptions\GeneralException;
use App\Models\Schoolcolleges\Schoolcolleges;
use App\Models\Categories\Categories;
use App\Repositories\Backend\Schoolcolleges\SchoolcollegesContract;
/**
 * Class EloquentSchoolcollegesRepository
 * @package App\Repositories\Schoolcolleges
 */
class EloquentSchoolcollegesRepository implements SchoolcollegesContract {

	
	public function __construct() {
	}

	/**
	 * @param $id
	 * @param bool $withRoles
	 * @return mixed
	 * @throws GeneralException
	 */
	public function findOrThrowException($id) {

		$categry = Schoolcolleges::withTrashed()->find($id);
		if (!is_null($categry)) {
			return $categry;
		}

		throw new GeneralException('That category does not exist.');
	}

	/**
	 * @param $per_page
	 * @param string $order_by
	 * @param string $sort
	 * @param int $status
	 * @return mixed
	 */
	public function getschoolcollegesPaginated($per_page, $status = 1, $order_by = 'id', $sort = 'asc') {
		return Schoolcolleges::OfType()->orderBy($order_by, $sort)->paginate($per_page);
	}

	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllSchoolcolleges($order_by = 'id', $sort = 'asc') {
		return Schoolcolleges::orderBy($order_by, $sort)->get();
	}


	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllSchoolcollegesCategories($type,$order_by = 'id', $sort = 'asc') {
		//echo $type; die;
		return Categories::where('type_code','=',$type)->whereNotNull('parent')->orderBy($order_by, $sort)->get();
	}

	/**
	 * @param $input
	 * @param $roles
	 * @param $permissions
	 * @return bool
	 * @throws GeneralException
	 * @throws UserNeedsRolesException
	 */
	public function create($input) {
		$sObj = new Schoolcolleges();	
		$sObj->title = $input['schoolname'];
		$sObj->user_id = auth()->id();
		$sObj->email = $input['schoolemail'];
		$sObj->contact = $input['schoolphone'];
		$sObj->description ='';
		$sObj->address = $input['schooladdress'];
		$sObj->town = $input['schooltown'];
		$sObj->website = $input['schoolwebsite'];
		$sObj->views = 0;
		$sObj->type = $input['schooltype'];
		$sObj->save();
		if(isset($input['schoolsuburb']))
		$sObj->Locations()->sync(array($input['schoolsuburb']));
		return $sObj;
		throw new GeneralException('There was a problem creating this record. Please try again.');
	}

	/**
	 * @param $id
	 * @param $input
	 * @param $roles
	 * @return bool
	 * @throws GeneralException
	 */
	public function update($assetId,$id, $input) {
		$sObj = $this->findOrThrowException($id);
		$sObj->title = $input['schoolname'];
		$sObj->email = $input['schoolemail'];
		$sObj->contact = $input['schoolphone'];
		$sObj->address = $input['schooladdress'];
		$sObj->town = $input['schooltown'];
		$sObj->website = $input['schoolwebsite'];
		$sObj->type = $input['schooltype'];
		if(isset($input['categories'])){
			$sObj->Categories()->detach();
			$sObj->Categories()->attach($input['categories']);
		}
		$sObj->Assets()->attach($assetId);
		$sObj->save();
		if(isset($input['schoolsuburb']))
		$sObj->Locations()->sync(array($input['schoolsuburb']));
		return $sObj;
		throw new GeneralException('There was a problem updating this record. Please try again.');
	}

	

	/**
	 * @param $id
	 * @return bool
	 * @throws GeneralException
	 */
	public function destroy($id) {
		if (auth()->id() == $id) {
			throw new GeneralException("You can not delete yourself.");
		}
		$schoolcolleges = $this->findOrThrowException($id);
		if ($schoolcolleges->delete()) {
			return true;
		}
		throw new GeneralException("There was a problem deleting this user. Please try again.");
	}

	/**
	 * @param $id
	 * @return boolean|null
	 * @throws GeneralException
	 */
	public function delete($id) {
		$schoolcolleges = $this->findOrThrowException($id, true);
		try {
			$schoolcolleges->Assets()->detach();
			$schoolcolleges->forceDelete();
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
		if ($user->restore()) {
			return true;
		}
		throw new GeneralException("There was a problem restoring this user. Please try again.");
	}

}
