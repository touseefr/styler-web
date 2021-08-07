<?php

/*
  |--------------------------------------------------------------------------
  | Web Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register web routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | contains the "web" middleware group. Now create something great!
  |
 */

Auth::routes(['register' => false ]);
//Auth::routes();
// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('insertCategories', 'Frontend\CategoriesController@insertCategories');
Route::get('test', 'Frontend\SubscriptionController@posttest');
Route::post('test', 'Frontend\SubscriptionController@posttest');

//Route::get('login', 'Frontend\FrontendController@login');
// Route::get('removefile', 'CleanFilesController@index');
require __DIR__ . "/Routes/Global/Lang.php";

/**
 * Frontend Routes
 * Namespaces indicate folder structure
 */
$router->group(['namespace' => 'Frontend'], function () use ($router) {

    require (__DIR__ . "/Routes/Frontend/Frontend.php");
    require (__DIR__ . "/Routes/Frontend/Access.php");
    require (__DIR__ . "/Routes/Frontend/Listing.php");
    require (__DIR__ . "/Routes/Frontend/Categories.php");
    require (__DIR__ . "/Routes/Frontend/Review.php");
    require (__DIR__ . "/Routes/Frontend/Location.php");
    require (__DIR__ . "/Routes/Frontend/Notification.php");
    require (__DIR__ . "/Routes/Frontend/Subscription.php");
    require (__DIR__ . "/Routes/Frontend/Booking.php");
    require (__DIR__ . "/Routes/Frontend/Marketplace.php");
    require (__DIR__ . "/Routes/Frontend/Blog.php");
});

$router->group(['namespace' => 'Backend'], function () use ($router) {

    /*
     * * Backend login
     */
    Route::get('admin/login', 'BackendController@admin_login');
    Route::post('admin/login', 'BackendController@admin_login_post');
    Route::get('admin/logout', 'BackendController@admin_logout');



    $router->group(['prefix' => 'admin', 'middleware' => 'auth'], function () use ($router) {
        /**
         * These routes need view-backend permission (good if you want to allow more than one group in the backend, then limit the backend features by different roles or permissions)
         *
         * Note: Administrator has all permissions so you do not have to specify the administrator role everywhere.
         */
//          Route::get('admin\subscription\packages\all', 'SubscriptionController@index');
        $router->group(['middleware' => 'access.routeNeedsPermission:view-backend'], function () use ($router) {
            require (__DIR__ . "/Routes/Backend/Dashboard.php");
            require (__DIR__ . "/Routes/Backend/Access.php");
            require (__DIR__ . "/Routes/Backend/Categories.php");
            require (__DIR__ . "/Routes/Backend/Services.php");
            require (__DIR__ . "/Routes/Backend/Schoolcolleges.php");
            require (__DIR__ . "/Routes/Backend/Packages.php");
            require (__DIR__ . "/Routes/Backend/Pages.php");
            require (__DIR__ . "/Routes/Backend/Membership.php");
            require (__DIR__ . "/Routes/Backend/Gateway.php");
            require (__DIR__ . "/Routes/Backend/Backend.php");
            require (__DIR__ . "/Routes/Backend/Reviews.php");
            require (__DIR__ . "/Routes/Backend/Importfile.php");
            require (__DIR__ . "/Routes/Backend/Blog.php");
            require (__DIR__ . "/Routes/Backend/Subscription.php");
        });
    });
});



