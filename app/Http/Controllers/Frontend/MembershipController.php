<?php namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Frontend\Reviews\ReviewsContract;
use App\Team;
use App\Plan;
use App\Transaction;
use App\User;
use App\Invoice;
use Auth;
use PDF;
use Request;
use Mail;
use DB;
/**
 * Class MembershipController
 * @package App\Http\Controllers
 */
class MembershipController extends Controller {
	
	
	/**
	 * [__construct description]
	 * @author Mohan Singh <mslogicmaster@gmail.com>
	 */
	public function __construct() {
		
	}
	
	/*
	** Plans list
	*/
	
	public function plans(){
		$plans = Plan::all();
		return view('frontend.membership.plans')->with(array('plans' => $plans));
	}
	
	/*
	** Checkout page
	*/
	
	public function checkout(){
		$plan_id = base64_decode($_REQUEST['p']);
		$plan_info = Plan::find($plan_id);
		if(empty($plan_info->price)){
			/*** If free plan **/
			 $user = Auth::user();
			$args = array('payer_email' => $user->email, 'payee_email' => '', 'txn_id' => uniqid(), 'status' => 'Approved', 'mode' => 'free', 'amount' => $plan_info->price, 'currency' => $plan_info->currency);
			$response = Transaction::insert_txn_data($user->id, $plan_id, $args);
			if($response['type'] == 'success'){
				return redirect('thank-you?txn_id='.$args['txn_id']);
			}
			else{
				return view('frontend.membership.error')->with(array('type' => 'error', 'message' => $response['message']));
			}
		}
		else{
			/** If paid plan **/
			
			return view('frontend.membership.checkout');
		}
	}
	
	/*
	** Thank you
	*/
	
	public function thank_you(){
		return view('frontend.membership.thanks');
	}
	
	/*
	** Account Transactions
	*/
	
	public function transactions(){
		$transactions = Transaction::where('user_id', Auth::user()->id)->get();
		if(!empty($transactions)){
			foreach($transactions as $trans){
				$plan = unserialize($trans->plan);
				//print_r($plan);
				$purchase_date = strtotime($plan['purchased_date']);
				$pur_date = date('d M,Y', $purchase_date);
				
				$expire_date = strtotime($plan['expired_date']);
				$expir_date = date('d M,Y', $expire_date );
				$arg = array(
						'id'				=>	$trans->id,
						'user_id'			=>	$trans->user_id,
						'transaction_id'	=>	$trans->transaction_id,
						'state'				=>	$trans->state,
						'mode'				=>	$trans->mode,
						'plan_id'			=>	$plan['id'],
						'plan_name'			=>	$plan['name'],
						'plan_price'		=>	$plan['price'],
						'plan_duration'		=>	$plan['duration'],
						'purchased_date'	=>	$pur_date,
						'expired_date'		=>	$expir_date
						
						
				);
			}
		}
		
		return response()->json(array($arg), 200);
		
		//return view('frontend.membership.transactions.transactions')->with(array('transactions' => $transactions));
	}
	
	
	/*
	** get user invoices
	*/
	
	public function invoices(){
		//$arg = array('test' => 'dfff');
		$invoices = Invoice::where('user_id', Auth::user()->id)->orderBy('inv_status')->get();
		print_r($invoices);
		exit();
		if($invoices){
			foreach($invoices as $invoice){
				$inv_status = ($invoice->inv_status == 1) ? 'Paid' : 'Unpaid';
				$arg[] = array(
								'id' 			=> $invoice->id,
								'user_id' 		=> $invoice->user_id,
								'path' 			=> $invoice->path,
								'plan_info' 	=> @unserialize($invoice->plan_info),
								'inv_status'	=> $inv_status,
								'generated_on'	=> $invoice->generated_on,
								'paid_on'		=> $invoice->paid_on
							);
			}
		}
		return response()->json($arg, 200);
	}
	
	/*
	** View Transaction Info
	*/
	
	public function view_txn_info($txn_id){
		return view('frontend.membership.transactions.view_info')->with(array('txn_id' => $txn_id));
	}
	
	/*
	** Print Invoice
	*/
	
	public function print_invoice(){
		return view('backend.invoice.pdfview');
	}
	/*
	** Download Invoice
	*/
	public function invoice_generate(Request $request)
    {
		$inv_id = $_REQUEST['inv_id'];
		return Invoice::invoice_download($inv_id);
		
	}
	
	/*
	** My Subscriptions
	*/
	
	public function subscriptions(){
		$transactions = Transaction::where('user_id', Auth::user()->id)->get();
			if(!empty($transactions)){
				foreach($transactions as $trans){
					$plan = unserialize($trans->plan);
					$purchase_date = strtotime($plan['purchased_date']);
					$pur_date = date('d M,Y', $purchase_date);
					
					$expire_date = strtotime($plan['expired_date']);
					$expir_date = date('d M,Y', $expire_date);
					
					$today = strtotime(date('Y-m-d'));
					
					//$curr_date = date();
					if($expire_date < $today){
						$plan_status = "Expired";
						$plan_status_color = "red";
					}
					else{
						$plan_status = "Active";
						$plan_status_color = "green";
					}
					$arg = array(
							'id'				=>	$trans->id,
							'user_id'			=>	$trans->user_id,
							'transaction_id'	=>	$trans->transaction_id,
							'state'				=>	$trans->state,
							'mode'				=>	$trans->mode,
							'plan_id'			=>	$plan['id'],
							'plan_name'			=>	$plan['name'],
							'plan_price'		=>	$plan['price'],
							'plan_duration'		=>	$plan['duration'],
							'purchased_date'	=>	$pur_date,
							'expired_date'		=>	$expir_date,
							'plan_status'		=>  $plan_status,
							'plan_status_color' =>  $plan_status_color
					);
				}
		}
		//print_r($arg);
		return response()->json(array($arg), 200);
		
		//return view('frontend.membership.my_memberships')->with(array('transactions' => $transactions));
	}
	
	/*
	** Change auto billing status
	*/
	
	public function change_auto_billing_status($auto_status){
		$user = User::find(Auth::User()->id);
		$user->auto_billing = $auto_status;
		$user->save();
		$message = ($auto_status == 1) ? 'You have successfully started next billing cycle.' : 'You have successfully stopped next billing cycle.';
		
		/*
		** Send mail to user
		*/
		$template_name = ($auto_status == 1) ? 'emails.subscription_start' : 'emails.subscription_stopped';
		$datas = array('EMAIL' => $user->email, 'NAME' => $user->name, 'BILLING_STATUS' => $auto_status);
		
		Mail::send($template_name, $datas, function($messages) use ($datas)
	   {
		  $subject = ($datas['BILLING_STATUS'] == 1) ? getenv('SUBSCRIPTION_START') : getenv('SUBSCRIPTION_STOPPED');
		   $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM')); 

		   $messages->to($datas['EMAIL'])->subject($subject);
	   });
	   
	   /*
		** Send mail to admin
		*/
		
		$template_name_admin = ($auto_status == 1) ? 'emails.admin_subscription_start' : 'emails.admin_subscription_stopped';
		$datas_admin = array('EMAIL' => $user->email, 'NAME' => $user->name, 'BILLING_STATUS' => $auto_status);
		
		Mail::send($template_name_admin, $datas_admin, function($messages_admin) use ($datas_admin)
	   {
		  $subject_admin = ($datas_admin['BILLING_STATUS'] == 1) ? getenv('ADMIN_SUBSCRIPTION_START') : getenv('ADMIN_SUBSCRIPTION_STOPPED');
		  
		  $subject_admin = $datas_admin['NAME'].' '.$subject_admin;
		  
		   $messages_admin->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM')); 

		   $messages_admin->to(getenv('ADMIN_EMAIL'))->subject($subject_admin);
	   });
			   
		return redirect('account/my-subscriptions') -> with(array('type' => 'success', 'message' => $message));
	}
	
	/*
	** cron job invoice_sent
	*/
	
	public function cron_invoice_sent(){
		
		/******************************** send email notification and create invoice ******************************/
		
		$transactions = DB::select("select * from transactions where current_plan = 1");
		foreach($transactions as $transaction){
			echo $transaction->id;
			echo '<br/>';
		}
		//echo 'ddddddddddddd';
		
		/* $datas = array('QUESTION' => 'test question', 'EMAIL' => 'hitesh@gmail.com', 'NAME' => 'hitesh kumar');
		
		Mail::send('emails.ask-a-qn', $datas, function($messages) use ($datas)
	   {
		   $subject = 'as a question';
		
		   $messages->from(getenv('ADMIN_EMAIL'), getenv('ADMIN_FROM')); 

		   $messages->to('hitesh.iquincesoft@gmail.com')->subject($subject);
	   }); */
		
	}
}