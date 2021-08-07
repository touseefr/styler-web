<?php

Route::get('getclassifieds', 'MarketplaceController@getclassifieds');
Route::post('makeclassifieds', 'MarketplaceController@makeclassifieds');
Route::get('marketplace', 'MarketplaceController@index');
Route::get('MarketplaceSearch', 'MarketplaceController@MarketplaceSearch');
Route::get('MarketAnalytic', 'MarketplaceController@MarketplaceUserAnalytic');
