<?php namespace App\Repositories\Backend\SmsPackage;

use App\Exceptions\GeneralException;
use App\Models\SmsPackage\SmsPackage;
use App\Repositories\Backend\SmsPackage\SmsPackageContract;
/**
 * Class EloquentPackagesRepository
 * @package App\Repositories\Packages
 */
class EloquentSmsPackageRepository implements SmsPackageContract {

	/**
	 * [__construct description]
	 * @author Mohan Singh <mslogicmaster@gmail.com>
	 */
	public function __construct() {
	}

	/**
	 * @param $id
	 * @param bool $withRoles
	 * @return mixed
	 * @throws GeneralException
	 */
	public function findOrThrowException($id) {

		return $package = SmsPackage::withTrashed()->find($id);

		throw new GeneralException('That package does not exist.');
	}

	/**
	 * @param $per_page
	 * @param string $order_by
	 * @param string $sort
	 * @param int $status
	 * @return mixed
	 */
	public function getpackagesPaginated($per_page, $status = 1, $order_by = 'id', $sort = 'asc') {
		return SmsPackage::orderBy($order_by, $sort)->paginate($per_page);
	}

	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllPackages($order_by = 'id', $sort = 'asc') {
		return SmsPackage::orderBy($order_by, $sort)->get();
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
		$sObj = new SmsPackage();	
		$sObj->name = $input['name'];
		$sObj->description = $input['description'];
		$sObj->limit = $input['limit'];
		$sObj->price = $input['price'];
		if(isset($input['status']))
			$sObj->status = 1;
		else
			$sObj->status = 0;
		$sObj->save();
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
	public function update($input) {
		$sObj = $this->findOrThrowException($input);
		$sObj->status = $sObj->status == 1 ? 0 : 1;
		$sObj->save();
		return $sObj;
		throw new GeneralException('There was a problem updating this record. Please try again.');
	}

	

	/**
	 * @param $id
	 * @return bool
	 * @throws GeneralException
	 */
	public function destroy($id) {
		$package = $this->findOrThrowException($id);
		if ($package->delete()) {
			return true;
		}
		throw new GeneralException("There was a problem deleting this package. Please try again.");
	}

	/**
	 * @param $id
	 * @return boolean|null
	 * @throws GeneralException
	 */
	public function delete($id) {
		$packages = $this->findOrThrowException($id, true);
		try {
			$packages->forceDelete();
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
		$packages = $this->findOrThrowException($id);
		if ($packages->restore()) {
			return true;
		}
		throw new GeneralException("There was a problem restoring this package. Please try again.");
	}

}
