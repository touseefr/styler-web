<?php

Route::get('gateway', 'GatewayController@index');
Route::post('gateway', 'GatewayController@save_settings');