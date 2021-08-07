<?php


Route::post('login', 'AuthController@login');
Route::post('register', 'AuthController@RegisterIndividual');
Route::get('test', 'AuthController@test');
Route::get('userInfo', 'AuthController@fetchUserInfo');
Route::get('BookingInfo', 'AuthController@BookingInfo');
Route::get('getuserbooking', 'AuthController@apigetuserbooking');
Route::get('GetUserWatchList', 'AuthController@ApiGetUserWatchList');
Route::post('ApiPostBooking', 'AuthController@ApiPostBooking');
Route::post('resetPassword', 'AuthController@RestUserPassword');
Route::post('ApiAddtowatchlist', 'AuthController@ApiAddtowatchlist');
Route::post('UpdateProfile', 'AuthController@Apiupdateprofile');
Route::post('account/{id}', 'AuthController@updateAccount');
Route::post('loginFacebook', 'AuthController@LoginViaFacebook');
Route::post('loginApple', 'AuthController@LoginViaApple');
Route::post('deleteWatchlist', 'AuthController@dphoneeleteWatchlist');
Route::post('createReview', 'AuthController@createReview');

Route::get('getSpListing', 'SpListingController@getListingList');
Route::get('fetchSpTeam/{sp_id}', 'SpListingController@fetchSpTeam');
Route::get('fetchSpgallery/{sp_id}', 'SpListingController@fetchSpGallery');

Route::get('getSpServices', 'SpListingController@getServicesList');
Route::get('getSubCategories', 'SpListingController@getSubCategories');
Route::post('saveTeamMember', 'SpListingController@saveTeamMember');
Route::post('updateTeamMember/{team_id}', 'SpListingController@updateTeamMember');
Route::post('saveListing', 'SpListingController@saveListing');
Route::post('updateListing/{Lid}', 'SpListingController@updateListing');
Route::post('saveGallery', 'SpListingController@saveGallery');

Route::post('deleteListing', 'SpListingController@deleteListing');
Route::get('getNotifications', 'AuthController@getNotifications');
Route::post('saveNotifications', 'AuthController@saveNotifications');


$router->group(['middleware' => ['jwt.auth']], function () {
    Route::get('usfers', 'AuthController@usersReturn');
});

/*
 * Service provider Data Fetching start
 */

Route::get('getListingByCategories', 'AuthController@test');




/*
 * Service provider Data Fetching end
 */
