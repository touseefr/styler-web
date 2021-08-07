<?php


/**
 * These frontend controllers require the user to be logged in
 */
//$router->group([], function () {
Route::get('notification', 'NotificationController@save')->name('frontend.notification.save');
Route::get('deactivateMe/{user_id}', 'NotificationController@deactivateMe')->name('frontend.notification.save');
Route::get('deactivateMe/email/{email}', 'NotificationController@deactivateMeByEmail')->name('frontend.notification.save');
Route::get('testit', 'SubscriptionController@test');
Route::get('email/unsubscribe', 'NotificationController@emailUnsubscription');
Route::get('DelteZohoAccount', 'NotificationController@DelteZohoAccount');

Route::get('Reminder', 'NotificationController@Reminder')->name('frontend.notification.save');
$router->group(['middleware' => 'auth'], function () {
	Route::get('getusernotification', 'NotificationController@index')->name('frontend.notification.index');
	/* Route::get('review', 'ReviewController@index')->name('frontend.review');
	Route::get('UserReceivedReview', 'ReviewController@UserReceivedReview')->name('frontend.review.UserReceivedReview');
	Route::put('review/{id}', 'ReviewController@update')->name('frontend.review.update');
	Route::delete('review/{id}', 'ReviewController@delete')->name('frontend.review.delete'); */
	/* Route::get('requestreview', 'ReviewController@requestreview')->name('frontend.review.request');
	Route::get('recieved-reviews', 'ReviewController@get_recieved_reviews')->name('frontend.recievedReview');
	Route::get('reply_on_comment', 'ReviewController@reply_on_comment')->name('frontend.reply'); */


});
