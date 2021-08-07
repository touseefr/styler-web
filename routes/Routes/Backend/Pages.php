<?php
Route::get('pages', 'PagesController@index')->name('backend.pages.index');
Route::get('pages/create', 'PagesController@create')->name('backend.pages.create');
Route::get('pages/edit/{id?}', 'PagesController@edit')->name('backend.pages.edit');
Route::post('pages/save', 'PagesController@save')->name('backend.pages.save');
Route::post('pages/update/', 'PagesController@update')->name('backend.pages.update');
Route::delete('pages/delete/{id?}', 'PagesController@delete')->name('backend.pages.delete');

Route::get('pages/faq', 'PagesController@faq'); 

Route::get('pages/faq/create', 'PagesController@faq_create'); 

Route::post('pages/faq/create', 'PagesController@faq_save'); 

Route::get('pages/faq/edit/{id}', 'PagesController@faq_edit'); 

Route::post('pages/faq/edit/{id}', 'PagesController@faq_update'); 

Route::get('pages/faq/delete/{id}', 'PagesController@faq_delete'); 
Route::post('getSearchUser', 'Access\User\UserController@getSearchUser');