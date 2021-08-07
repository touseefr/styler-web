<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\Notification\CreatenotificationRequest;
use App\Repositories\Frontend\Notification\NotificationContract;
use Illuminate\Support\Facades\Mail;
use App\Repositories\Frontend\User\UserContract;
use App\Repositories\Frontend\Assets\AssetsContract;
use DB;
use User;
use Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;
use App\Jobs\StylerZoneEmails;
use zcrmsdk\crm\crud\ZCRMRecord;
use zcrmsdk\crm\setup\restclient\ZCRMRestClient;


class NotificationController extends Controller {

    function __construct(NotificationContract $notification, UserContract $user) {
        $this->notification = $notification;
        $this->user = $user;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $notifications = $this->notification->getUserNotificatons();
        return response()->json($notifications, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        //
    }

    public function save(CreatenotificationRequest $request) {
        $list = $this->notification->create($request->all());
        return response()->json($list, 200);
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

    public function deactivateMe($user_id, Request $request) {
        try {
            if ($user_id) {
                $user = \App\Models\Access\User\User::find(base64_decode($user_id));
                if (!$user) {
                    $request->session()->flash("error_msg", "Account Does not Exist.Please contact the support");
                    return redirect('email/unsubscribe');
                }
                if ($user->status == 1) {
                    $user->status = 0;
                    $user->save();
                    if($user->roles[0]->name=='JobSeeker' || $user->roles[0]->name=='Individual' || $user->roles[0]->name=='Employee'){
                        if($user->zoho_id){
                            $configuration = array(
                                "client_id" => env('ZOHO_CLIENT_ID'),
                                "client_secret" => env('ZOHO_CLIENT_SECRET'),
                                "redirect_uri" => env('ZOHO_REDIRECT_URL'),
                                "currentUserEmail" => env('ZOHO_CURRENT_USER_EMAIL'),
                                "token_persistence_path" => base_path() . "\vendor\zohocrm\php-sdk\src\oauth\persistence"
                            );
                            ZCRMRestClient::initialize($configuration);
                            echo $user->zoho_id;
                            $zcrmRecordIns = ZCRMRecord::getInstance("contacts", $user->zoho_id);
                            $zcrmRecordIns->setFieldValue("Email_Opt_Out",true);
                            $apiResponse=$zcrmRecordIns->update();
                    }
                }

                    $request->session()->flash("success_msg", "Your account is Deactivated.Contact support to activate your account.");
                    Auth::logout();
                    return redirect('email/unsubscribe');
                } else {
                    $request->session()->flash("error_msg", "Your account already deactivated.Contact support to activate your account.");
                    return redirect('email/unsubscribe');
                }
            } else {
                $request->session()->flash("error_msg", "Something went wrong Please try again later.");
                return redirect('support');
            }
        } catch (Exception $e) {
            $request->session()->flash("error_msg", "Something went wrong Please try again later.");
            return redirect('email/unsubscribe');
        }
    }
    public function deactivateMeByEmail($email, Request $request) {
        try {
            if ($email) {
                $user = \App\Models\Access\User\User::where('email', $email)->first();
                if (!$user) {
                    $request->session()->flash("error_msg", "Account Does not Exist.Please contact the support");
                    return redirect('email/unsubscribe');
                }
                if ($user->status == 1) {
                    $user->status = 0;
                    $user->save();
                    if($user->roles[0]->name=='JobSeeker' || $user->roles[0]->name=='Individual' || $user->roles[0]->name=='Employee'){
                        if($user->zoho_id){
                            $configuration = array(
                                "client_id" => env('ZOHO_CLIENT_ID'),
                                "client_secret" => env('ZOHO_CLIENT_SECRET'),
                                "redirect_uri" => env('ZOHO_REDIRECT_URL'),
                                "currentUserEmail" => env('ZOHO_CURRENT_USER_EMAIL'),
                                "token_persistence_path" => base_path() . "\vendor\zohocrm\php-sdk\src\oauth\persistence"
                            );
                            ZCRMRestClient::initialize($configuration);
                            echo $user->zoho_id;
                            $zcrmRecordIns = ZCRMRecord::getInstance("contacts", $user->zoho_id);
                            $zcrmRecordIns->setFieldValue("Email_Opt_Out",true);
                            $apiResponse=$zcrmRecordIns->update();
                    }
                        // $moduleIns = ZCRMRestClient::getInstance()->getModuleInstance("accounts"); // to get the instance of the module
                        // $recordids = array(
                        //     $user->zoho_id
                        // ); // to create an array of record ids
                        // $moduleIns->deleteRecords($recordids); // to delete the records

                }else{

                }
                    $request->session()->flash("success_msg", "Your account is Deactivated.Contact support to activate your account.");
                    return redirect('email/unsubscribe');
                } else {
                    $request->session()->flash("error_msg", "Your account already deactivated.Contact support to activate your account.");
                    return redirect('email/unsubscribe');
                }
            } else {
                $request->session()->flash("error_msg", "Something went wrong Please try again later.");
                return redirect('email/unsubscribe');
            }
        } catch (Exception $e) {
            $request->session()->flash("error_msg", "Something went wrong Please try again later.");
            return redirect('email/unsubscribe');
        }
    }

    public function testit() {

        echo base64_encode('1101');
        exit;
    }

    public function Reminder() {
        $expiring_users = DB::table('user_subscription')
                        ->select('user_subscription.id as sub_id', 'user_subscription.*', 'users.*', 'user_business.*')
                        ->join('users', 'user_subscription.user_id', '=', 'users.id')
                        ->join('user_business', 'user_business.user_id', '=', 'users.id')
                        ->where('trial_status', 1)
                        ->where('expiring_email', 0)
                        ->whereRaw('DATEDIFF(ending_date,NOW())<=2 AND  DATEDIFF(ending_date,NOW())>0')->get();
        foreach ($expiring_users as $user) {
            $user = (array) $user;
            $this->dispatch((new StylerZoneEmails($user, 'emails.expiring_users')));
            DB::table('user_subscription')
                    ->where('id', $user['sub_id'])
                    ->update(['expiring_email' => 1]);
        }
        exit;
    }

    public function emailUnsubscription(){
        return view('frontend.auth.unsubscribe');
    }
    public function  DelteZohoAccount(){
        $configuration = array(
            "client_id" => env('ZOHO_CLIENT_ID'),
            "client_secret" => env('ZOHO_CLIENT_SECRET'),
            "redirect_uri" => env('ZOHO_REDIRECT_URL'),
            "currentUserEmail" => env('ZOHO_CURRENT_USER_EMAIL'),
            "token_persistence_path" => base_path() . "\vendor\zohocrm\php-sdk\src\oauth\persistence"
        );


        ZCRMRestClient::initialize($configuration);

        $zcrmRecordIns = ZCRMRecord::getInstance("contacts", "3296695000009602004");
        $zcrmRecordIns->setFieldValue("Email_Opt_Out",false);
        $apiResponse=$zcrmRecordIns->update();
        echo "<pre>";
        print_r($apiResponse);


        // $record=ZCRMRecord::getInstance("contracts","3296695000009602004"); //to get the instance of the record
        // $record->setFieldValue("Phone","221515151515151");
        // $records=array();
        // array_push($records, $record);

        // $responseIn=$moduleIns->updateRecords($records); //updating the records

        // foreach($apiResponse->getEntityResponses() as $responseIns){
        //     echo "HTTP Status Code:".$responseIns->getHttpStatusCode();  //To get http response code
        //     echo "Status:".$responseIns->getStatus();  //To get response status
        //     echo "Message:".$responseIns->getMessage();  //To get response message
        //     echo "Code:".$responseIns->getCode();  //To get status code
        //     echo "Details:".json_encode($responseIns->getDetails());
        // }
        // $record->setFieldValue("Email Opt Out ","false");

        // $moduleIns = ZCRMRestClient::getInstance()->getModuleInstance("contracts"); // to get the instance of the module
        // $record=$moduleIns->getInstance("3296695000009602004");
        // $record->setFieldValue('','');
        // // $record=ZCRMRecord::getInstance("Invoices","3296695000009602004");
        //This function use to set FieldApiName and value similar to all other FieldApis and Custom field
        exit;
        $recordids = array(
            "3296695000008426002"
        ); // to create an array of record ids
        $responseIn = $moduleIns->deleteRecords($recordids); // to delete the records

        foreach ($responseIn->getEntityResponses() as $responseIns) {
            echo "HTTP Status Code:" . $responseIn->getHttpStatusCode(); // To get http response code
            echo "Status:" . $responseIns->getStatus(); // To get response status
            echo "Message:" . $responseIns->getMessage(); // To get response message
            echo "Code:" . $responseIns->getCode(); // To get status code
            echo "Details:" . json_encode($responseIns->getDetails());
        }
    }

}
