<?php
/**
 * These frontend controllers require the user to be logged in
 */
$router->group([], function () {
	Route::get('locations', 'LocationController@index')->name('frontend.listing');

});
