<?php

namespace App\Repositories\Frontend\Notification;
/**
 * Interface NotificationContract
 * @package App\Repositories\Frontend\Notification
 */
interface NotificationContract {

	/**
	 * @param $id
	 * @return mixed
	 */
	public function findOrThrowException($id);

	
	/**
	 * @param $input
	 * @return mixed
	 */
	public function create($input);
	
	public function getUserNotificatons();
	
}