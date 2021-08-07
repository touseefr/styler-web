<?php
Route::get('categories/types', 'CategoriesController@types')->name('frontend.categories.types');
Route::get('subcategoriesbytype', 'CategoriesController@subcategories')->name('frontend.categories.types');
Route::get('categories/', 'CategoriesController@index')->name('frontend.categories.index');
Route::get('services/', 'CategoriesController@childcategries')->name('frontend.categories.childcategries');
Route::get('serviceprovidercategories/', 'CategoriesController@serviceprovidercategories')->name('frontend.categories.serviceprovidercategories');
