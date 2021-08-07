<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Route::get('booking/{userid}', 'BookingController@index');
Route::post('checklogin', 'BookingController@checklogin');
Route::get('booknow', 'BookingController@postBookNow');
//Route::post('booknow', 'BookingController@postBookNow');
Route::get('getbooking', 'BookingController@getbooking');
Route::post('cancelbooking', 'BookingController@cancelbooking');

Route::post('booklater', 'BookingController@booklater');
Route::post('dealbooknow', 'BookingController@dealBookNow');
Route::post('dealbooknowauth', 'BookingController@dealBookNowAuth');
Route::get('booklaterwithauth', 'BookingController@booklaterwithauth');
Route::post('serviceusersave', 'BookingController@boookingServicesUserCreate');

$router->group(['middleware' => ['cors']], function () {
    Route::options('importfileupload', 'BookingController@bookingUploadresponse');
    Route::post('importfileupload', 'BookingController@bookingUpload');
});
