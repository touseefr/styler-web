<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Route::get('blog', 'BlogController@index');
Route::get('blog/{slug}', 'BlogController@Blog');
Route::get('blog/category/{cat_id}', 'BlogController@showCategoryPosts');