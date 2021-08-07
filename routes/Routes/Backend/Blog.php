<?php

/*
 * Controller Blog Module from admin panel
 * Creater: Kinectro 
 * Project: StylerZone
 * Developer: Asif
 * 
 */

Route::get('blog', 'BlogController@index');

Route::get('blog/post/create', 'BlogController@getAddPost');
Route::post('blog/post/create', 'BlogController@postAddPost');


Route::get('blog/post/edit/{id}', 'BlogController@getEditPost');
Route::post('blog/post/edit', 'BlogController@postEditPost');



Route::get('blog/post/{id}/delete', 'BlogController@postDeletePost');
Route::get('blog/post/{id}/status', 'BlogController@postStatusPost');









Route::get('blog/category', 'BlogController@BlogCategories');
Route::post('blog/category/create', 'BlogController@createCategory');
Route::post('blog/category/{id}/delete', 'BlogController@deleteCategory');

