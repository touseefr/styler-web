<?php namespace App\Repositories\Frontend\Pages;

use App\Exceptions\GeneralException;
use App\Models\Pages\Pages;
use App\Repositories\Frontend\Pages\PagesContract;
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
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function getPageDeatail($url) {
		return Pages::where('url', $url)->get();
	}

}
