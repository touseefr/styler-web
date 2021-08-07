<?php

Route::get('createpackage', 'PackagesController@create')->name('backend.packages.create');

Route::post('package/update/', 'PackagesController@update')->name('backend.packages.update');

Route::get('SmsPackage', 'PackagesController@smspackage')->name('backend.sms-packages.index');
Route::get('SmsPackage/New', 'PackagesController@addsmspackage')->name('backend.sms-packages.create');
Route::post('SmsPackage', 'PackagesController@createsmspackage');
Route::get('SmsPackage/{id}', 'PackagesController@updatesmspackage');
Route::delete('SmsPackage/{id}', 'PackagesController@destroysmspackage');

Route::get('ListingPackage', 'PackagesController@listingpackage')->name('backend.listing-packages.index');
Route::get('ListingPackage/New', 'PackagesController@addlistingpackage')->name('backend.listing-packages.create');
Route::post('ListingPackage', 'PackagesController@createlistingpackage');
Route::get('ListingPackage/{id}', 'PackagesController@updatelistingpackage');
Route::delete('ListingPackage/{id}', 'PackagesController@destroylistingpackage');
Route::post('package/update/', 'PackagesController@update')->name('backend.packages.update');
Route::get('list/smsglobal/subaccounts', 'PackagesController@fetchSubAccount')->name('backend.smsSubAccount.index');
Route::get('smsglobal/edit/subaccounts/{subaccount_id}', 'PackagesController@editSubAccount')->name('backend.smsSubAccount.create');
Route::post('smsglobal/edit/subaccounts/{subaccount_id}', 'PackagesController@saveSubAccount');
Route::get('list/subaccounts/keys/Requests', 'PackagesController@fetchKeysRequest');
Route::get('list/subaccounts/fund/transfer/{package_id}/{user_id}', 'PackagesController@fundTransfer');



Route::get('list/user/packages', 'PackagesController@userPackages');

