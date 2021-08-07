<?php
Route::get('membership/add', 'MembershipController@index');
Route::post('membership/add', 'MembershipController@add');
Route::get('membership/delete/{id}', 'MembershipController@delete_plan');
Route::get('membership/edit/{id}', 'MembershipController@edit');
Route::post('membership/edit', 'MembershipController@edit');
Route::get('membership', 'MembershipController@plans');
Route::get('coupon', 'CouponController@index');
Route::get('coupon/new', 'CouponController@create');
Route::post('coupon/new', 'CouponController@store');
Route::get('coupon/edit/{coupon_id}', 'CouponController@edit');
Route::post('coupon/edit/{coupon_id}', 'CouponController@update');
