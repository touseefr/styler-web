<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use Auth;
use Mail;
use PDF;
Use App\Invoice;

class Transaction extends Model {

	protected $table = 'transactions';
	protected $fillable = array('user_id', 'transaction_id', 'state', 'payer_email', 'mode', 'payee_email', 'plan', 'amount', 'currency', 'current_plan');
	
	public static function insert_txn_data($user_id, $plan_id, $args){
		$plan_info = Plan::find($plan_id);
		$plan = $plan_info->original;
		$user = Auth::user();
		$purchased_date = date('Y-m-d H:i:s');                
		$plan['purchased_date'] = $purchased_date;
		$plan['expired_date'] = Transaction::add_time($purchased_date, $plan['duration']);
		$payer_email = (empty($plan_info->price)) ? Auth::user()->email : $args['payer_email'];
		$payee_email = (empty($plan_info->price)) ? '' : $args['payee_email'];
		
			$args1 = array(
							'user_id' => $user_id,
							'transaction_id' => $args['txn_id'],
							'state' => $args['status'], 
							'payer_email' => $payer_email,
							'mode'	=> $args['mode'],
							'payee_email' => $payee_email,
							'plan' => serialize($plan),
							'amount' => $args['amount'],
							'currency'	=> $args['currency'],
							'current_plan' => 1
						);
	
			if(Transaction::create($args1)){

				/*
				** Send mail to user
				*/
				
				$datas = array('EMAIL' => $user->email, 'NAME' => $user->name, 'ORDER_NUM' => $args['txn_id'], 'PLAN_NAME' => $plan['name'], 'PLAN_DURATION' => $plan['duration'], 'TOTAL_AMOUNT' => $plan['price'], 'DISCOUNT' => $plan['discount'], 'AMOUNT_PAID' => $args['amount'], 'CURRENCY' => $args['currency'], 'DATE' => date(getenv('DATE_FORMATE'), strtotime($plan['purchased_date'])), 'EXPIRY' => date(getenv('DATE_FORMATE'), strtotime($plan['expired_date'])));
				
				Mail::send('emails.plan_purchased', $datas, function($message) use ($datas)
			   {
				   $subject = getenv('NEW_PLAN_PURCHASED');
				  
				   $message->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM')); 

				   $message->to($datas['EMAIL'])->subject($subject);
			   });
			   $_REQUEST['txn_id'] = $args['txn_id'];
			   Invoice::send_invoice_email($args['txn_id']);
			   /*
			   ** Enable auto billing on user account
			   */
				$userdata = User::find(Auth::user()->id);
				$userdata->auto_billing = 1;
				$userdata->save();
					
				
				return array('type' => 'success', 'message' => 'Transaction Completed!');
			}
			else{
				return array('type' => 'error', 'message' => 'Transaction could not be completed!');
			}
	}
	
	/*
	** add time
	*/

	public static function add_time($date, $time){
		$effectiveDate = date('Y-m-d H:i:s', strtotime("+".$time."", strtotime($date)));
		return $effectiveDate;
	}
	
	/*
	** Get membership status
	*/
	
	public static function get_mem_status($txn_id){
		$transaction = Transaction::find($txn_id);
		$plan_info = unserialize($transaction->plan);
		$plan_expired_date = $plan_info['expired_date'];
		$today_date = date('Y-m-d H:i:s');
		if($transaction->current_plan == 0){
			return 'Inactive';
		}
		elseif($plan_expired_date >= $today_date){
			return 'Active';
		}
		else{
			return 'Expired';
		}
	}
	
	/*
	** get auto billing
	*/
	
	public static function txn_auto_billing($txn_id){
		$transaction = Transaction::find($txn_id);
		$txn_status = Transaction::get_mem_status($txn_id);
		if($txn_status == 'Inactive' || $txn_status == 'Expired'){
			return 'Off';
		}
		elseif($txn_status == 'Active'){
			$user = User::find($transaction->user_id);
			$auto_billing = ($user->auto_billing == 1) ? 'On' : 'Off';
			return $auto_billing;
		}
	}
	
	/*
	** Get user current plan
	*/
	
	public static function get_current_plan($user_id){
		$current_plan = Transaction::where(array('current_plan' => 1, 'user_id' => $user_id))->get();
		if(!empty($current_plan['0'])){
			$plan_array = @unserialize($current_plan[0]->plan);
			return array('status' => 'true', 'plan' => $plan_array);
		}
		else{
			return array('status' => 'false', 'plan' => '');
		}
	}
}
