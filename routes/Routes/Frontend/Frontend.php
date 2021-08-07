
<?php

/**
 * Frontend Controllers
 */


Route::get('zohoUnsubscribeForm', 'FrontendController@fecZoho');
  Route::get('home', function () {
            return redirect('search?q=&label=Service+Provider&searchFor=serviceprovider&location_address=');
        });
Route::get('zoho', 'ZohoController@index');
Route::get('gtu/{id}', 'ProfileController@getSuggestions');
Route::get('/', 'FrontendController@index')->name('home');
Route::get('macros', 'FrontendController@macros');
Route::get('profile', 'ProfileController@profile')->name('frontend.profile.index');
Route::get('termsandconditions', 'PageController@index')->name('frontend.pages.termsandconditions');
Route::get('aboutus', 'PageController@aboutus')->name('frontend.pages.aboutus');
Route::get('our_vission_value_and_success', 'PageController@our_vission_value_and_success')->name('frontend.pages.our_vission_value_and_success');
Route::get('contact-us', 'PageController@contact_us');
Route::post('contact-us', 'PageController@contact_us_submit');
Route::get('legal', 'PageController@legal')->name('frontend.pages.legal');
Route::get('privacy_policy', 'PageController@privacy_policy')->name('frontend.pages.privacy_policy');
Route::get('copyrights', 'PageController@copyrights')->name('frontend.pages.copyrights');
Route::get('pricing', 'SubscriptionController@pricingPackages')->name('frontend.subscription.pricing');
Route::get('getPlanDetails', 'SubscriptionController@getPlanDetails');

//Route::get('support', 'PageController@support')->name('frontend.pages.support');
Route::get('review_guide', 'PageController@review_guide');
Route::post('contactme', 'ProfileController@contactme');
/**
 * These frontend controllers require the user to be logged in
 */
Route::get('videosallow', 'DashboardController@videosallow');
Route::post('addgallerylike', 'DashboardController@addGalleryLike');
$router->group(['middleware' => 'auth'], function () {
    Route::get('confirmMyAccount', 'DashboardController@confirmAccount');
    Route::get('wizardComplete', 'DashboardController@wizardComplete');
    Route::get('account', 'DashboardController@index')->name('frontend.dashboard');
//    Route::get('account', 'DashboardController@index')->name('frontend.dashboard')->middleware('paidredirect');
    Route::get('dashboard', 'DashboardController@dashboard');
    Route::post('changepackage', 'DashboardController@changepackage');
    // Route::post('dopayments', 'DashboardReviewsControllerntroller@dopayments')->name('frontend.dopayments');
    Route::get('savepayments', 'DashboardController@savepayments')->name('frontend.savepayments');
    Route::put('account/{id}', 'ProfileController@update')->name('frontend.dashboard.update');
    Route::get('getuser', 'ProfileController@index')->name('frontend.dashboard.loggedinuser');
    Route::get('profile/edit', 'ProfileController@edit')->name('frontend.profile.edit');
    Route::post('rating', 'ProfileController@rating')->name('frontend.profile.edit');
    Route::patch('profile/update', 'ProfileController@update')->name('frontend.profile.update');
    Route::put('business/{id}', 'ProfileController@updatebusiness')->name('frontend.profile.updatebusiness');
    Route::get('getjobs', 'ProfileController@getuserjobs')->name('frontend.profile.getjobs');
    Route::get('getwatchlist', 'ProfileController@getwatchlist')->name('frontend.profile.userwatchlist');
    Route::get('getWatchListjobseeker', 'ProfileController@getWatchListjobseeker');
    Route::put('updateindividualinfo/{id}', 'ProfileController@updateindividualinfo')->name('frontend.profile.updateindividualinfo');
    Route::get('uploadprofilepic', 'ProfileController@uploadprofilepic')->name('frontend.profile.uploadprofilepic');
    Route::post('uploadprofilepic', 'ProfileController@uploadprofilepic')->name('frontend.profile.uploadprofilepic');
    Route::get('uploadvideo', 'ProfileController@uploadVideo')->name('frontend.profile.uploadvideo');
    Route::post('uploadvideo', 'ProfileController@uploadVideo')->name('frontend.profile.uploadvideo');
    Route::post('updatesocialmedia', 'ProfileController@updatesocialmedia')->name('frontend.profile.updatesocialmedia');
    Route::post('bookappointment', 'ProfileController@bookappointment')->name('frontend.profile.edit');
    Route::get('jobseekers', 'ProfileController@jobseekers')->name('frontend.profile.jobseekers');
    Route::get('getjobseekers', 'ProfileController@getjobseekers');
    Route::get('getusers', 'ProfileController@getusers')->name('frontend.profile.getusers');
    Route::get('uploadresume', 'ProfileController@uploadResume')->name('frontend.profile.uploadresume');
    Route::post('uploadresume', 'ProfileController@uploadResume')->name('frontend.profile.uploadresume');
    Route::post('applyjob', 'ProfileController@applyJob')->name('frontend.profile.uploadresume');
    Route::get('deletelogo', 'ProfileController@deletelogo')->name('frontend.profile.deletelogo');
    Route::get('deletevideo', 'ProfileController@deletevideo')->name('frontend.profile.deletevideo');
    Route::post('sendemail', 'ProfileController@sendemail')->name('frontend.profile.sendemail');
    Route::post('job/applied', 'ProfileController@jobSeekerapplied')->name('frontend.profile.sendemail');


    /*
     * * Faq route
     */

    Route::get('faq', 'PageController@faqs');
    Route::post('faqsave', 'PageController@faqsave');
    Route::get('faqsave', 'PageController@getfaq');
    Route::get('getfaqbyid', 'PageController@getfaqbyid');
    Route::get('getbussservicebyid', 'PageController@getbussservicebyid');
    Route::get('getbussbrandbyid', 'PageController@getbussbrandbyid');
    Route::post('updatefaqsave/{id}', 'PageController@updatefaqsave');
    Route::post('updatebusinessservice/{id}', 'PageController@updatebusinessservice');
    Route::post('updatebusinessbrand/{id}', 'PageController@updatebusinessbrand');
    Route::get('faqsave/{id}', 'PageController@deletefaq');

    /*
     * * credit card route
     */

    Route::post('updatecreditform', 'PageController@updatecreditform');

    /*
     * * business Service route
     */

    Route::post('servicesave', 'PageController@servicesave');
    Route::post('brandsave', 'PageController@brandsave');
    Route::get('getbusservices', 'PageController@getbusservices');
    Route::get('getbusbrand', 'PageController@getbusbrand');
    Route::get('busservicedelete/{id}', 'PageController@busservicedelete');
    Route::get('bussbranddelete/{id}', 'PageController@bussbranddelete');
    Route::get('getservicebyid', 'PageController@getservicebyid');
    Route::get('getservicebyid', 'PageController@getservicebyid');


    /*
     * * Team route
     */

    Route::post('teamssave', 'DashboardController@teamssave');
    Route::get('teamssave/{id}', 'DashboardController@teamcancelFile');
    Route::get('getteammembers', 'DashboardController@getteammembers');
    Route::get('getcustomerbooking', 'DashboardController@getcustomerbooking');
    Route::get('getblogs', 'ItemController@getblogs');
    Route::get('addblogs', 'ItemController@addblogs');
    Route::delete('teamssave/{id}', 'DashboardController@DeleteTeamMember');
    Route::post('updateteammembersave/{id}', 'DashboardController@updateteammembersave');
    Route::get('uploadteamimg', 'DashboardController@uploadteamimg');
    Route::get('getteammemberbyid', 'DashboardController@getteammemberbyidgetteammemberbyid');
    Route::get('teammemberpic/{image_id}/{member_id}', 'DashboardController@teammemberpic');
    Route::get('uploadteammemberpic/{image_id}', 'DashboardController@uploadteammemberpic');
    Route::post('uploadteamimg', 'DashboardController@uploadteamimg');

    /**
     * * Upload user gallery
     * */
    Route::get('usergalleryupload', 'DashboardController@usergalleryupload');
    Route::post('usergalleryupload', 'DashboardController@usergalleryupload');
    Route::get('myresumeupload', 'DashboardController@myresumeupload');
    Route::get('myresumeupload/{id}', 'DashboardController@DeleteMyResumeFile');
    Route::post('myresumeupload', 'DashboardController@myresumeupload');
    Route::post('mycoverletterandresume', 'DashboardController@mycoverletterandresume');
    Route::post('paymentmethods', 'DashboardController@savepaymentmethods');
    Route::get('getpaymentmethod', 'DashboardController@getpaymentmethod');
    Route::get('getcoverltrandresume', 'DashboardController@getcoverltrandresume');
    Route::get('existingclandresume', 'DashboardController@existingclandresume');
    Route::post('ctusergallery', 'DashboardController@ctusergallery');
    Route::post('videogallery', 'DashboardController@videogallery');
    Route::get('getgallery', 'DashboardController@getmygallery');
    Route::get('getvideogallery', 'DashboardController@getvideogallery');
    Route::get('getgallery/{id}/{cat_id}', 'DashboardController@DeleteMygalleryImage');
    Route::get('getvideogallery/{id}/{cat_id}', 'DashboardController@DeleteMyvideogallery');
    Route::get('classifiedcat' ,'DashboardController@GetClassifiedcat');
    Route::get('deleteasset/{asset_id}', 'DashboardController@DeleteAsset');


    Route::get('getaccountcats', 'DashboardController@getaccountcats');

    Route::get('getccinfo', 'PageController@getccinfo');

    Route::get('teamcancelimage', 'DashboardController@teamcancelimage');

    Route::get('account/team-members', 'DashboardController@team_members');
    Route::get('account/team-members/add', 'DashboardController@add_team_member');
    Route::post('account/team-members/add', 'DashboardController@save_team_member');

    Route::get('account/team-members/edit/{id}', 'DashboardController@edit_team_member');
    Route::post('account/team-members/edit/{id}', 'DashboardController@update_team_member');

    Route::get('account/team-members/delete/{id}', 'DashboardController@delete_team_member');



    /*
     * * Membership Route
     */
    Route::get('plans', 'MembershipController@plans')->middleware('paid');
    Route::get('checkout', 'MembershipController@checkout')->middleware('paid');
    Route::get('account/transactions', 'MembershipController@transactions')->middleware('paidredirect');

    Route::get('account/invoices', 'MembershipController@invoices')->middleware('paidredirect');

    Route::get('account/transactions/view/{txn_id}', 'MembershipController@view_txn_info')->middleware('paidredirect');
    Route::get('account/invoice/print', 'MembershipController@print_invoice')->middleware('paidredirect');
    ;
    Route::get('account/invoice/download', array('as' => 'pdfview', 'uses' => 'MembershipController@invoice_generate'))->middleware('paidredirect');
    Route::get('account/my-subscriptions', 'MembershipController@subscriptions')->middleware('paidredirect');
    Route::get('account/subscriptions', 'MembershipController@subscriptions')->middleware('paidredirect');

    Route::get('account/membership/billing/{auto_status}', 'MembershipController@change_auto_billing_status')->middleware('paidredirect');

    /*
     * * Account Route
     */

    Route::get('account/ask-a-qn', 'FrontendController@submit_a_qn');

    Route::get('account/remove_watchlist_item', 'FrontendController@remove_watchlist_item');

    Route::get('watchlistdelete/{id}/{watchtype}', 'ProfileController@watchlistdelete');


    Route::get('getCourses','PageController@getCourses');
    Route::post('changecoursedetail','PageController@ChangeCourseDetail');
    Route::post('deletecourse','PageController@DeleteCourses');
    Route::get('getSMSPackages','PackagesController@getSMSPackages');
    Route::get('getListingPackages','PackagesController@getListingPackages');
    Route::get('getBusinessInfo','FrontendController@getBusinessInfo');

    Route::Post('fb/save','FrontendController@saveFbCredential');

});
Route::get('team/{id}', 'FrontendController@team_single_page');
Route::get('thank-you', 'MembershipController@thank_you');
Route::get('cron_invoice_sent', 'MembershipController@cron_invoice_sent');
Route::get('business-register', 'PageController@getBusinessRegister');
Route::post('BannerUploadImage', 'ProfileController@BannerUploadImage');