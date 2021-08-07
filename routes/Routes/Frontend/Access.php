<?php

/**
 * Frontend Access Controllers
 */
$router->group(['namespace' => 'Auth'], function () use ($router) {
    /**
     * These routes require the user to be logged in
     */
//    Route::controllers([
//        'password' => 'Auth\PasswordController',
//    ]);
   
    Route::get('password/email', 'PasswordController@getEmail');
    Route::post('password/email', 'PasswordController@postEmail');
    Route::get('password/reset/{token}', 'PasswordController@getReset');
    Route::post('password/reset/{token}', 'PasswordController@postReset');
    $router->group(['middleware' => 'auth'], function () {
        Route::get('auth/logout', 'AuthController@getLogout');
        Route::get('logout', 'AuthController@getLogout');
        Route::get('auth/password/change', 'PasswordController@getChangePassword')->name('auth.password.change');
        Route::post('auth/password/change', 'PasswordController@postChangePassword')->name('password.change');
//		Route::get('account/confirm/{token}', 'AuthController@confirmAccount')->name('account.confirm');
//		Route::get('account/confirm/resend/{user_id}', 'AuthController@resendConfirmationEmail')->name('account.confirm.resend');
    });
    Route::get('check/auth', 'AuthController@checkauth');
    Route::get('account/confirm/resend/{user_id}', 'AuthController@resendConfirmationEmail')->name('account.confirm.resend');
    Route::get('account/confirm/{token}', 'AuthController@confirmAccount')->name('account.confirm');
    /**
     * These reoutes require the user NOT be logged in
     */
     
    $router->group(['middleware' => 'guest'], function () use ($router) {        
        Route::get('check', 'AuthController@index');
        Route::get('account/register/{plan_id}', 'AuthController@getRegister');
        Route::get('auth/register', 'AuthController@getRegister');
        Route::post('auth/register', 'AuthController@postRegister');       
        Route::post('postme', 'AuthController@testpost');
        Route::get('auth/login', 'AuthController@getLogin');
        Route::get('login', function () {                       
            return redirect('auth/login');
        })->name('login');
        Route::get('register', function () {                       
            return redirect('auth/register');
        });
        Route::get('auth/login/{provider}', 'AuthController@loginThirdParty')->name('auth.provider');
        Route::Post('auth/login', 'AuthController@postLogin');       
        Route::resource('auth', 'AuthController');
        Route::resource('password', 'PasswordController');
    });
});
Route::get('subscriptionfile', 'SubscriptionController@test');

