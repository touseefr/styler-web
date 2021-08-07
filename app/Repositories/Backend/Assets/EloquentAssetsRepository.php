<?php namespace App\Repositories\Backend\Assets;

use App\Exceptions\GeneralException;
use App\Models\Assets\Assets;
use App\Repositories\Backend\Assets\AssetsContract;

/**
 * Class EloquentAssetsRepository
 * @package App\Repositories\Assets
 */
class EloquentAssetsRepository implements AssetsContract {
	
	public function __construct() {
	}

	/**
	 * @param $id
	 * @param bool $withRoles
	 * @return mixed
	 * @throws GeneralException
	 */
	public function findOrThrowException($id) {

		$assets = Assets::withTrashed()->find($id);
		if (!is_null($assets)) {
			return $assets;
		}

		throw new GeneralException('That asset does not exist.');
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
		
		$assets = new Assets();	
		$assets->name = $input['name'];
		$assets->path = $input['path'];
		$assets->ext = $input['ext'];
		$assets->save();
		return $assets;

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
		
			throw new GeneralException('There was a problem updating this asset. Please try again.');
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

		$user = $this->findOrThrowException($id);
		if ($user->delete()) {
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

	/**
	 * @param $id
	 * @param $status
	 * @return bool
	 * @throws GeneralException
	 */
	public function mark($id, $status) {
		if (auth()->id() == $id && ($status == 0 || $status == 2)) {
			throw new GeneralException("You can not do that to yourself.");
		}

		$user = $this->findOrThrowException($id);
		$user->status = $status;

		if ($user->save()) {
			return true;
		}

		throw new GeneralException("There was a problem updating this user. Please try again.");
	}

}
