<?php

Route::get('bad/words', 'ReviewController@manageBadReview');
Route::post('bad/words/save', 'ReviewController@saveBadWord');
Route::get('bad/words/delete/{id}', 'ReviewController@deleteBadWord');
Route::get('bad/reviews', 'ReviewController@fetchBadReviews');
Route::get('show/receipt/{id}', 'ReviewController@showReceipt');
Route::post('previous/receipt', 'ReviewController@getPreviousInvoices');
Route::get('current/balance', 'ReviewController@getCurrentBalance');
Route::get('reviewreport', 'ReviewController@ReviewReport');
?>

