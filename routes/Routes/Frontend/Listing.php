<?php

Route::get('classifieds', 'ListingController@classifieds')->name('frontend.listing.getclassifieds');
Route::get('jobs', 'ListingController@jobs')->name('frontend.listing.getjobs');
Route::get('deals', 'ListingController@deals')->name('frontend.listing.getdeals');
Route::get('business', 'ListingController@business')->name('frontend.listing.getbusinessforsale');
Route::get('gallery', 'ListingController@gallery')->name('frontend.listing.getgallery');
Route::get('galleryall', 'ListingController@serviceprovidergalleryall')->name('frontend.listing.getgalleryall');
Route::get('gallery/{id}', 'ListingController@serviceprovidergallery')->name('frontend.listing.getgallery');
Route::get('schoolcolleges', 'ListingController@schoolcolleges')->name('frontend.listing.schoolcollages');
Route::get('allclassified', 'ListingController@allClassified')->name('frontend.listing.getclassifieds');
Route::post('listing/sendEmail', 'ListingController@sendEmail')->name('frontend.listing.sendEmail');
/**
 * These frontend controllers require the user to be logged in
 */
$router->group(['middleware' => 'auth'], function () {
    Route::get('courses', 'ListingController@AllCourses');
    Route::get('testlisting/{user_id}', 'ListingController@testlisting');
    Route::get('listing/getjobsanalytic', 'ListingController@getjobsanalytic')->name('frontend.listing.getjobs');
    Route::get('listing/getjobs', 'ListingController@getJobs')->name('frontend.listing.getjobs');
    Route::get('listing/getjob/applications/{job_id}/{type}', 'ListingController@jobapplications')->name('frontend.listing.jobapplications');
    Route::get('listing/getjob/all/{type}', 'ListingController@jobApplicationsAll');
    Route::post('/listing/getjob/applications/shortlist/{listing_id}/{type}', 'ListingController@candidateShortlist')->name('frontend.listing.jobapplications');
    Route::post('/listing/changeJobStatus', 'ListingController@changeJobStatus')->name('frontend.listing.jobapplications');
    Route::get('abnValidation', 'ListingController@abnValidation');
    Route::post('reportBusiness', 'ListingController@reportBusiness')->name('frontend.listing.reportBusiness');
    Route::get('listing', 'ListingController@index')->name('frontend.listing');
    Route::get('listing/{id}', 'ListingController@get')->name('frontend.listing.get');
    Route::get('listcheck', 'ListingController@listcheck');
    Route::put('listing/{id}', 'ListingController@update')->name('frontend.listing.update');
    Route::delete('listing/{id}', 'ListingController@delete')->name('frontend.listing.delete');    
    Route::post('listing', 'ListingController@save')->name('frontend.listing.save');
    Route::get('upload', 'ListingController@upload')->name('frontend.listing.upload');
    Route::post('upload', 'ListingController@upload')->name('frontend.listing.upload');
    Route::get('cancelimage', 'ListingController@cancelimage')->name('frontend.listing.upload');
    Route::get('searchlisting', 'ListingController@searchlisting')->name('frontend.listing.searchlisting');
    Route::post('shortlistjob', 'ListingController@shortlistjob')->name('frontend.listing.shortlistjob');
    Route::post('activatejob', 'ListingController@activatejob')->name('frontend.listing.activatejob');
    Route::post('addtowatchlist', 'ListingController@addtowatchlist')->name('frontend.listing.addtowatchlist');
});

Route::get('listingbycat', 'ListingController@getListingByCat')->name('frontend.listing_by_cat');
Route::get('search', 'ListingController@search')->name('frontend.listing.search');

//for testing
Route::get('aa', 'ItemController@getblogs');


Route::get('getrecords', 'ListingController@getrecords')->name('frontend.listing.getrecords');
Route::get('bussinessSearch', 'ListingController@searchBussinesses');
Route::get('getAllServices', 'ListingController@getAllServices');
Route::get('getAllCourses', 'ListingController@AllCourses');
Route::get('marketplace', 'ListingController@marketplace');
Route::get('testSearchDesign', 'ListingController@SearchDesign');
Route::get('getServiceProviderByName/{query}', 'ListingController@getServiceProviderByName');

