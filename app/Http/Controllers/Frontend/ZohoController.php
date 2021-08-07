<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Jobs\SendReminderEmail;
use App\Http\Controllers\Controller;
use zcrmsdk\crm\setup\restclient\ZCRMRestClient;
use zcrmsdk\oauth\ZohoOAuth;
use zcrmsdk\crm\crud\ZCRMModule;
use zcrmsdk\crm\setup\org\ZCRMOrganization;
use zcrmsdk\crm\crud\ZCRMRecord;
use Illuminate\Support\Facades\Mail;

class ZohoController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {

        echo "i am here";
        Mail::send('emails.test', array(), function ($message) {
            $subject = 'test from email address';

            $message->from('contact@stylerzone.com.au', getenv('ADMIN_FROM'));

            $message->to('asifnaveed2013@gmail.com')->subject($subject);
        });


//        echo "i am here";
//
//        for ($i = 0; $i < 1; $i++) {
//            $this->dispatch((new SendReminderEmail()));
//        }
//
//        return \GuzzleHttp\json_encode(array("status" => "200", "msg" => "i am herer"));
        exit;
        $configuration = array(
            "client_id" => "1000.SOUFW4P8WEVE19295PT8P6W7HJZSLH",
            "client_secret" => "8b2d6f0201cf49fda2d10bf323f613dfd43374cf59",
            "redirect_uri" => "http://beautyc.loc",
            "currentUserEmail" => "hunain@stylerzone.com.au",
            "token_persistence_path" => __DIR__
        );
        ZCRMRestClient::initialize($configuration);
//        $oAuthClient = ZohoOAuth::getClientInstance(); 
//        $grantToken = "1000.9d68031f5a27e2673b7afad0e82ced31.1d33e86b70c5f420cb12cc42188cddc2";
//        $oAuthTokens = $oAuthClient->generateAccessToken($grantToken);
//        print_r($oAuthTokens);
//        exit;
//        $oAuthClient = ZohoOAuth::getClientInstance(); 
//        $refreshToken = "paste_the_refresh_token_here";
//        $userIdentifier = "provide_user_identifier_like_email_here";
//        $oAuthTokens = $oAuthClient->generateAccessTokenFromRefreshToken($refreshToken,$userIdentifier);




        echo "<pre>";

        $record = ZCRMRecord::getInstance("accounts", '3296695000000862025');
        $record->setFieldValue("Membership_Plan", 'Trendy Basic');
        $record->setFieldValue("Subscription_Expire", date('Y-m-d', strtotime('2019-09-16 07:49:29')));
        $response = $record->update();
        print_r($response->getResponseJSON());


        exit;
        echo date('yyyy-MM-dd HH:mm:ss', strtotime('20-10-1989'));
//        exit;
        $moduleIns = ZCRMRestClient::getInstance()->getModuleInstance("Contacts"); //to get the instance of the module
        $records = array();
        $record = ZCRMRecord::getInstance("Contacts", null);  //To get ZCRMRecord instance        
        $record->setFieldValue("Last_Name", "mAn3"); //This 
//        $record->setFieldValue("Account_Name", "My na,me1"); //This 
//        $record->setFieldValue("Email", "gonetzc+1@test.com"); //This 
//        $record->setFieldValue("Phone", "020200021155"); //This 
        $record->setFieldValue("Singup_Date", date('Y-m-d')); //This 
        $record->setFieldValue("Date_of_Birth", date('Y-m-d')); //This 
        array_push($records, $record);
        $responseIn = $moduleIns->createRecords($records);



//            $users=$bulkAPIResponse->getData();
//        $zcrmModuleIns = ZCRMModule::getInstance("Organisation");
//        $bulkAPIResponse = $zcrmModuleIns->getAllUsers();
//        $recordsArray = $bulkAPIResponse->getData(); // $recordsArray - array of ZCRMRecord instances
        print_r($responseIn);
        echo "i am here too...";
        exit;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        //
    }

}
