<?php namespace App\Repositories\Frontend\Assets;

/**
 * Interface AssetsContract
 * @package App\Repositories\Frontend\Assets
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

	/**
	 * @param $id
	 * @return mixed
	 */
	public function saveprofilepic($input,$userId);
	public function saveusergallery($input,$userId);
	public function saveteampic($input,$teamId);

	/**
	 * @param $id
	 * @return mixed
	 */
	public function saveVideo($input,$userId);
	
	/**
	 * @param $id
	 * @param $userId
	 * @return mixed
	 */
	public function deletelogo($id,$userId);
	
	/**
	 * @param $id
	 * @param $userId
	 * @return mixed
	 */
	public function deleteVideo($id,$userId);


}