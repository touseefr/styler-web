<?php namespace App\Repositories\Backend\Schoolcolleges;

/**
 * Interface SchoolcollegesContract
 * @package App\Repositories\Backend\Schoolcolleges
 */
interface SchoolcollegesContract {

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
	public function getschoolcollegesPaginated($per_page, $status = 1, $order_by = 'id', $sort = 'asc');

	
	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllSchoolcolleges($order_by = 'id', $sort = 'asc');

	
	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getAllSchoolcollegesCategories($type,$order_by = 'id', $sort = 'asc');
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
	public function update($assetId,$id, $input);

	/**
	 * @param $id
	 * @return mixed
	 */
	public function destroy($id);

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