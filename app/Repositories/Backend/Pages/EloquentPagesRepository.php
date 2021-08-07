<?php namespace App\Repositories\Backend\Pages;

use App\Exceptions\GeneralException;
use App\Models\Pages\Pages;
use App\Repositories\Backend\Pages\PagesContract;
/**
 * Class EloquentPagesRepository
 * @package App\Repositories\Pages
 */
class EloquentPagesRepository implements PagesContract {

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

		$page = Pages::withTrashed()->find($id);
		if (!is_null($page)) {
			return $page;
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
	public function getpagesPaginated($per_page, $status = 1, $order_by = 'id', $sort = 'asc') {
		return Pages::orderBy($order_by, $sort)->paginate($per_page);
	}

	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllPages($order_by = 'id', $sort = 'asc') {
		return Pages::orderBy($order_by, $sort)->get();
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
		$sObj = new Pages();	
		$sObj->title = $input['pagetitle'];
		$sObj->user_id = auth()->id();
		$sObj->description = $input['pagedesc'];
		$sObj->url = $input['pageurl'];
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
	public function update($id, $input) {
		$sObj = $this->findOrThrowException($id);
		$sObj->title = $input['pagetitle'];
		$sObj->description = $input['pagedesc'];
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
		$page = $this->findOrThrowException($id);
		if ($page->delete()) {
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
		$page = $this->findOrThrowException($id, true);
		try {
			$page->forceDelete();
		} catch (\Exception $e) {
			throw new GeneralException($e->getMessage());
		}
	}
}
