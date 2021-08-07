<?php

$router->group([
    'prefix' => 'access',
    'namespace' => 'Access',
    'middleware' => 'access.routeNeedsPermission:view-access-management',
        ], function () use ($router) {
    /**
     * User Management
     */

    $router->group(['namespace' => 'User'], function () use ($router) {
        Route::post('users/store', 'UserController@store');
        Route::resource('users', 'UserController', ['except' => ['show']]);
        Route::get('users/deactivated', 'UserController@deactivated')->name('admin.access.users.deactivated');
        Route::get('users/banned', 'UserController@banned')->name('admin.access.users.banned');
        Route::get('users/deleted', 'UserController@deleted')->name('admin.access.users.deleted');
        Route::get('account/confirm/resend/{user_id}', 'UserController@resendConfirmationEmail')->name('admin.account.confirm.resend');

        /**
         * Specific User
         */
        $router->group(['prefix' => 'user/{id}', 'where' => ['id' => '[0-9]+']], function () {
            Route::get('delete', 'UserController@delete')->name('admin.access.user.delete-permanently');
            Route::get('restore', 'UserController@restore')->name('admin.access.user.restore');
            Route::get('mark/{status}', 'UserController@mark')->name('admin.access.user.mark')->where(['status' => '[0,1,2]']);
            Route::get('password/change', 'UserController@changePassword')->name('admin.access.user.change-password');
            Route::post('password/change', 'UserController@updatePassword')->name('admin.access.user.change-password');
        });
    });

    /**
     * Role Management
     */
    $router->group(['namespace' => 'Role'], function () use ($router) {
        Route::resource('roles', 'RoleController', ['except' => ['show']]);
    });

    /**
     * Permission Management
     */
    $router->group(['prefix' => 'roles', 'namespace' => 'Permission'], function () use ($router) {
        Route::resource('permission-group', 'PermissionGroupController', ['except' => ['index', 'show']]);
        Route::resource('permissions', 'PermissionController', ['except' => ['show']]);

        $router->group(['prefix' => 'groups'], function () {
            Route::post('update-sort', 'PermissionGroupController@updateSort')->name('admin.access.roles.groups.update-sort');
        });
    });
});
