<?php namespace App\Repositories\Backend\Assets;

/**
 * Interface AssetsContract
 * @package App\Repositories\Backend\Assets
 */
interface AssetsContract {

	/**
	 * @param $id
	 * @param bool $withRoles
	 * @return mixed
	 */
	public function findOrThrowException($id);

	
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