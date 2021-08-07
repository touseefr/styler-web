<?php

use Illuminate\Http\Request;

/*
  |--------------------------------------------------------------------------
  | API Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register API routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | is assigned the "api" middleware group. Enjoy building your API!
  |
 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

$router->group([
    'namespace' => 'Api',
        ], function() use ($router) {
    require (__DIR__ . "/Routes/Api/Auth.php");
    require (__DIR__ . "/Routes/Api/General.php");
});
Route::get('locations', 'Frontend\LocationController@index');
