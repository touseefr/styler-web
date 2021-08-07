<?php

Route::get('test_file', 'BackendController@testFile');
/*
** Video Management
*/
Route::get('video', 'BackendController@video_settings');
Route::post('video', 'BackendController@video_settings_save');

/*
** Transaction Management
*/

Route::get('transactions', 'BackendController@transactions');

Route::get('searchtransaction', 'BackendController@searchInvoiceRecords');



Route::get('invoice/download',array('as'=>'pdfview','uses'=>'BackendController@invoice_generate'));

Route::post('transactions/send_invoice', 'BackendController@send_invoice');

Route::get('transactions/view/{txn_id}', 'BackendController@view_txn_info');

Route::get('invoice/print', 'BackendController@print_invoice');

/*
** Review Route
*/

Route::get('reviews', 'BackendController@reviews');

Route::post('reviews', 'BackendController@update_review');

Route::post('reviews/edit_review', 'BackendController@edit_review');

Route::get('reviews/delete/{id}', 'BackendController@delete_review');

Route::get('reviews/approve/{id}', 'BackendController@approve_review');
Route::get('bad/reviews/approve/{id}', 'BackendController@bad_approve_review');

Route::get('reviews/suspend/{id}', 'BackendController@suspend_review');

/*
** Analytics Route
*/

Route::get('sponser','BackendController@get_sponser_view');

Route::get('dashboard/visits', 'DashboardController@users_visits');

/*
** Team Members
*/

Route::get('team_members', 'BackendController@team_members');

