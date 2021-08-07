<?php namespace App\Repositories\Frontend\Categories;

/**
 * Interface CategoriesContract
 * @package App\Repositories\Frontend\Categories
 */
interface CategoriesContract {

	/**
	 * @param $id
	 * @param bool $withRoles
	 * @return mixed
	 */
	public function findOrThrowException($id);


	
	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getcategoriesByType($type,$parent,$order_by = 'id', $sort = 'asc');
	
	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function searchCategoriesByType($q,$type,$except,$order_by = 'id', $sort = 'asc');
	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllCategories($order_by = 'id', $sort = 'asc');


	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllSubCategories($type);

	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllTypes($parent);
	/**
	 * @param $input
	 * @param $roles
	 * @return mixed
	 */
	public function create($input);

	/**
	 * @param $id
	 * @param $input
	 * @param $roles
	 * @return mixed
	 */
	public function update($id, $input);


	/**
	 * @param $id
	 * @return mixed
	 */
	public function delete($id);

	/**
	 * @param $id
	 * @return mixed
	 */
	public function restore($id);


}