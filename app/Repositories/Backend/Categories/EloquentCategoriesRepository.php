<?php namespace App\Repositories\Backend\Categories;

use App\Exceptions\GeneralException;
use App\Models\Categories\Categories;
use App\Repositories\Backend\Categories\CategoriesContract;

/**
 * Class EloquentCategoriesRepository
 * @package App\Repositories\Categories
 */
class EloquentCategoriesRepository implements CategoriesContract {

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

		$categry = Categories::withTrashed()->find($id);
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
	public function getCategoriesPaginated($per_page, $status = 1, $order_by = 'id', $sort = 'asc') {
		return Categories::orderBy($order_by, $sort)->paginate($per_page);
	}

	/**
	 * @param $per_page
	 * @return \Illuminate\Pagination\Paginator
	 */
	public function getDeletedCategoriesPaginated($per_page) {
		return Categories::onlyTrashed()->paginate($per_page);
	}

	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getMainCategories($order_by = 'id', $sort = 'asc') {
		return Categories::where('parent', '=', NULL)->orderBy($order_by, $sort)->get();
	}

	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllCategories($order_by = 'id', $sort = 'asc') {
		return Categories::orderBy($order_by, $sort)->get();
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
		//echo $input['updatedid']; die;
		if(isset($input['updatedid'])){
			$category = $this->findOrThrowException($input['updatedid']);	
		}else{
			$category = new Categories();	
		}
		$category->type = $input['categorytype'];
		$category->name = $input['categoryname'];
		if(isset($input['parentcategory']) && $input['parentcategory']!='0'){
		$category->parent = $input['parentcategory'];	
		}
		$category->save();
		return $category;
		//throw new GeneralException('There was a problem creating this category. Please try again.');
	}

	/**
	 * @param $id
	 * @param $input
	 * @param $roles
	 * @return bool
	 * @throws GeneralException
	 */
	public function update($id, $input) {
		$category = $this->findOrThrowException($id);
		$category->name = $input['categoryname'];
		$category->type = $input['categorytype'];
		$category->parent = NULL;
		if(isset($input['parentcategory']) && $input['parentcategory']!='0'){
		$category->parent = $input['parentcategory'];	
		}
		$category->save();
		return $category;
		

		throw new GeneralException('There was a problem updating this user. Please try again.');
	}

	


	/**
	 * @param $id
	 * @return boolean|null
	 * @throws GeneralException
	 */
	public function delete($id) {
		$category = $this->findOrThrowException($id, true);
		try {
			$category->forceDelete();
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
