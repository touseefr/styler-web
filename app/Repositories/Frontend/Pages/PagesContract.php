<?php namespace App\Repositories\Frontend\Pages;

/**
 * Interface SchoolcollegesContract
 * @package App\Repositories\Backend\Schoolcolleges
 */
interface PagesContract {

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
	public function getPageDeatail($url);
}