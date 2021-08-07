<?php

Route::post('addsubscription', 'SubscriptionController@addsubscription')->name('frontend.review.save');
Route::post('stripesubscription', 'SubscriptionController@stripesubscription');
Route::get('checkCoupon', 'SubscriptionController@checkCoupon');
Route::get('coupondetail', 'SubscriptionController@getCouponDetails');
Route::get('show/receipt/{id}', 'SubscriptionController@showReceipt');
Route::post('previous/receipt', 'SubscriptionController@getPreviousInvoices');
Route::post('buyPackage', 'SubscriptionController@buyPackage');
Route::get('fetch/plans', 'SubscriptionController@getPlansNPackages');
Route::post('request/change/card', 'SubscriptionController@requestChangeCard');
