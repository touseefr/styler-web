<?php
Route::get('subscription/packages/all', 'SubscriptionController@index');
Route::get('subscription/packages/create', 'SubscriptionController@createPlan');
Route::post('subscription/packages/create', 'SubscriptionController@savePlan');
Route::post('subscription/packages/{id}/delete', 'SubscriptionController@deletePlan');

Route::get('subscription/plans/type', 'SubscriptionController@showPlanType');
Route::get('subscription/plan/type/create', 'SubscriptionController@createPlanType');

Route::post('subscription/plan/type/create', 'SubscriptionController@savePlanType');
Route::post('subscription/plan/type/{id}/delete', 'SubscriptionController@deletePlanType');

Route::get('subscription/plan/type/edit/{id}', 'SubscriptionController@editPlanType');
Route::post('subscription/plan/type/edit/{id}', 'SubscriptionController@updatePlanType');