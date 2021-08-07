<?php
Route::get('categories', 'CategoriesController@index')->name('backend.categories.index');
Route::get('categories/all', 'CategoriesController@all')->name('backend.categories.all');
Route::post('categories', 'CategoriesController@save')->name('backend.categories.save');
Route::put('categories/{id}', 'CategoriesController@update')->name('backend.categories.update');
Route::delete('categories/{id}', 'CategoriesController@delete')->name('backend.categories.destroy');
