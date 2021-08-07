<?php

Route::get('importfile/{id}', 'ImportfileController@index')->name('admin.importfile.index');
Route::post('importfile', 'ImportfileController@SaveFile')->name('admin.importfile.savefile');
Route::post('save_info', 'ImportfileController@save_info')->name('admin.importfile.savefile');
Route::post('filecontent', 'ImportfileController@loadFileContent')->name('admin.importfile.savefile');

?>
