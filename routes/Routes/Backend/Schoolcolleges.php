<?php
Route::get('schoolcolleges', 'SchoolcollegesController@index')->name('backend.schoolcolleges.index');
Route::get('schoolcolleges/create/{id?}', 'SchoolcollegesController@create')->name('backend.schoolcolleges.create');
Route::get('schoolcolleges/edit/{id?}', 'SchoolcollegesController@edit')->name('backend.schoolcolleges.edit');
Route::post('schoolcolleges/save', 'SchoolcollegesController@save')->name('backend.schoolcolleges.save');
Route::post('schoolcolleges/update/', 'SchoolcollegesController@update')->name('backend.schoolcolleges.update');
Route::delete('schoolcolleges/delete/{id?}', 'SchoolcollegesController@delete')->name('backend.schoolcolleges.delete');
