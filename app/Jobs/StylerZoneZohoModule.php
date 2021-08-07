<?php


namespace App\Jobs;

use App\Podcast;
use App\AudioProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;
use zcrmsdk\crm\setup\restclient\ZCRMRestClient;
use zcrmsdk\crm\crud\ZCRMRecord;

class StylerZoneZohoModule implements ShouldQueue {

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $zoho_Data;
    protected $function_type;
    public $tries = 50;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($zoho_Data, $function_type) {
        $this->zoho_Data = $zoho_Data;
        $this->function_type = $function_type;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $configuration = array(
            "client_id" => env('ZOHO_CLIENT_ID'),
            "client_secret" => env('ZOHO_CLIENT_SECRET'),
            "redirect_uri" => env('ZOHO_REDIRECT_URL'),
            "currentUserEmail" => env('ZOHO_CURRENT_USER_EMAIL'),
            "token_persistence_path" => base_path() . "\vendor\zohocrm\php-sdk\src\oauth\persistence"
        );
        ZCRMRestClient::initialize($configuration);
        if ($this->function_type == 'create_user') {
            $account_type = $this->zoho_Data['account_type'];
            if ($account_type === 'service_provider' || $account_type === 'school_college' || $account_type === 'distributor') {
                $moduleIns = ZCRMRestClient::getInstance()->getModuleInstance("accounts"); //to get the instance of the module
                $records = array();
                $record = ZCRMRecord::getInstance("accounts", null);  //To get ZCRMRecord instance
                $record->setFieldValue("Account_Name", ($this->zoho_Data['Account_Name']) ? $this->zoho_Data['Account_Name'] : $this->zoho_Data['Account_Name']); //This
                $record->setFieldValue("Account_Email", $this->zoho_Data['Account_Email']); //This
                $record->setFieldValue("Signup_Date", $this->zoho_Data['Signup_Date']); //This
                $record->setFieldValue("Phone", ($this->zoho_Data['Phone']) ? $this->zoho_Data['Phone'] : '' ); //This
                $record->setFieldValue("Newsletter", (isset($this->zoho_Data['Newsletter']) && !empty($this->zoho_Data['Newsletter'])) ? 'Yes' : 'No' ); //This
                $record->setFieldValue("Membership_Plan", $this->zoho_Data['Membership_Plan']); //This
                if (isset($this->zoho_Data['User_Role']) && !empty($this->zoho_Data['User_Role'])) {
                    $record->setFieldValue("User_Role", $this->zoho_Data['User_Role']); //This
                }
                $record->setFieldValue("Subscription_Expire", $this->zoho_Data['Subscription_Expire']); //This
                if (isset($this->zoho_Data['Date_Of_Birth']) && !empty($this->zoho_Data['Date_Of_Birth'])) {
                    $record->setFieldValue("Date_Of_Birth", $this->zoho_Data['Date_Of_Birth']); //This
                }
                array_push($records, $record);
                $responseIn = $moduleIns->createRecords($records);
                $zohoUser = $responseIn->getResponseJSON();
                if (is_array($zohoUser)) {
                    if ($zohoUser['data']) {
                        if (isset($zohoUser['data'][0])) {
                            if (isset($zohoUser['data'][0]['code']) && $zohoUser['data'][0]['code'] == 'SUCCESS') {
                                $user = \App\Models\Access\User\User::find($this->zoho_Data['user_id']);
                                $user->zoho_id = $zohoUser['data'][0]['details']['id'];
                                $user->save();
                            }
                        }
                    }
                }
            } else {
                $moduleIns = ZCRMRestClient::getInstance()->getModuleInstance("Contacts"); //to get the instance of the module
                $records = array();
                $record = ZCRMRecord::getInstance("Contacts", null);  //To get ZCRMRecord instance
                $record->setFieldValue("Last_Name", ($this->zoho_Data['Account_Name']) ? $this->zoho_Data['Account_Name'] : $this->zoho_Data['Account_Name']); //This
                $record->setFieldValue("Email", $this->zoho_Data['Account_Email']); //This
                $record->setFieldValue("Singup_Date", $this->zoho_Data['Signup_Date']); //This
                $record->setFieldValue("Phone", ($this->zoho_Data['Phone']) ? $this->zoho_Data['Phone'] : '' ); //This
                if (isset($this->zoho_Data['User_Role']) && !empty($this->zoho_Data['User_Role'])) {
                    $record->setFieldValue("User_Role", $this->zoho_Data['User_Role']); //This
                }
                if (isset($this->zoho_Data['Date_Of_Birth']) && !empty($this->zoho_Data['Date_Of_Birth'])) {
                    $record->setFieldValue("Date_of_Birth", date('Y-m-d', strtotime($this->zoho_Data['Date_Of_Birth']))); //This
                }
                array_push($records, $record);
                $responseIn = $moduleIns->createRecords($records);
                $zohoUser = $responseIn->getResponseJSON();
                if (is_array($zohoUser)) {
                    if ($zohoUser['data']) {
                        if (isset($zohoUser['data'][0])) {
                            if (isset($zohoUser['data'][0]['code']) && $zohoUser['data'][0]['code'] == 'SUCCESS') {
                                $user = \App\Models\Access\User\User::find($this->zoho_Data['user_id']);
                                $user->zoho_id = $zohoUser['data'][0]['details']['id'];
                                $user->save();
                            }
                        }
                    }
                }
            }
        } elseif ($this->function_type == 'update_user_subscription') {
            if ($this->zoho_Data['zoho_id']) {                
                $record = ZCRMRecord::getInstance("accounts", $this->zoho_Data['zoho_id']);
                $record->setFieldValue("Membership_Plan", $this->zoho_Data['Membership_Plan']);
                $record->setFieldValue("Subscription_Expire", date('Y-m-d',strtotime($this->zoho_Data['Subscription_Expire'])));
                $response = $record->update();
            }
        } elseif ($this->function_type == 'update_user_abn_update') {
            if ($this->zoho_Data['zoho_id']) {
                $record = ZCRMRecord::getInstance("accounts", $this->zoho_Data['zoho_id']);
                $record->setFieldValue("ABN_Number", $this->zoho_Data['abn']);
                $record->setFieldValue("ABN_Name", $this->zoho_Data['abn_name']);
                $response = $record->update();
            }
        }
    }

}
