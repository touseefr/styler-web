<?php namespace App\Repositories\Frontend\Location;
/**
 * Interface LocationContract
 * @package App\Repositories\Frontend\Location
 */
interface LocationContract {

	/**
	 * @param string $order_by
	 * @param string $sort
	 * @return mixed
	 */
	public function all($q,$order_by = 'id', $sort = 'asc', $type ='');

	/**
	 * @param array
	 * @param string $sort
	 * @return mixed
	 */
	public function nearestlocation($input);

	
}
