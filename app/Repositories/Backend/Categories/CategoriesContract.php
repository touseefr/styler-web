<?php namespace App\Repositories\Backend\Categories;

/**
 * Interface CategoriesContract
 * @package App\Repositories\Backend\Categories
 */
interface CategoriesContract {

	/**
	 * @param $id
	 * @param bool $withRoles
	 * @return mixed
	 */
	public function findOrThrowException($id);

	/**
	 * @param $per_page
	 * @param string $order_by
	 * @param string $sort
	 * @param $status
	 * @return mixed
	 */
	public function getCategoriesPaginated($per_page, $status = 1, $order_by = 'id', $sort = 'asc');

	/**
	 * @param $per_page
	 * @return \Illuminate\Pagination\Paginator
	 */
	public function getDeletedCategoriesPaginated($per_page);

	
	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getMainCategories($order_by = 'id', $sort = 'asc');
	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllCategories($order_by = 'id', $sort = 'asc');

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
        
        public function categoriesPostCount();



}