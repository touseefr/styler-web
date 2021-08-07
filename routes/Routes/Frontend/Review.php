<?php

/**
 * These frontend controllers require the user to be logged in
 */
$router->group(['middleware' => 'auth'], function () {
    Route::get('review', 'ReviewController@index')->name('frontend.review');
    Route::get('UserReceivedReview', 'ReviewController@UserReceivedReview')->name('frontend.review.UserReceivedReview');
    Route::get('review/{id}', 'ReviewController@get')->name('frontend.review.get');
    Route::put('review/{id}', 'ReviewController@update')->name('frontend.review.update');
    Route::delete('review/{id}', 'ReviewController@delete')->name('frontend.review.delete');
    Route::post('requestreview', 'ReviewController@requestreview')->name('frontend.review.request');
    Route::get('recieved-reviews', 'ReviewController@get_recieved_reviews')->name('frontend.recievedReview');
    Route::post('reply_on_comment', 'ReviewController@reply_on_comment')->name('frontend.reply');
});
Route::get('review_detail/{id}', 'ReviewController@review_detail')->name('frontend.review.review_detail');
Route::post('review', 'ReviewController@save')->name('frontend.review.save');
Route::get('getlatestreviews','ReviewController@getLatestReviews');
Route::post('reportfake','ReviewController@ReportFake');