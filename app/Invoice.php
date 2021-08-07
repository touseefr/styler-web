<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use PDF;
use App\Transaction;
use App\User;use Auth;
use Mail;
class Invoice extends Model {

	protected $table = 'invoices';
	protected $fillable = array('path', 'txn_id', 'user_id', 'generated_on');
	
	/*
	** Invoice Download
	*/
	
	/* public static function invoice_download($txn_id){
		$invoice = Invoice::where('txn_id', $txn_id)->get();
		if(@$invoice[0]->id){
			$pdf = PDF::loadView('backend.invoice.pdfview');
			return $pdf->download('invoice_'.$txn_id.'.pdf');
		}
		else{
			$args = array('txn_id' => $txn_id, 'path' => '/invoices/invoice_'.$txn_id.'.pdf');
			if(Invoice::create($args)){
				PDF::loadView('backend.invoice.pdfview')->save(public_path().'/invoices/invoice_'.$txn_id.'.pdf')->stream('download.pdf'); 
				$pdf = PDF::loadView('backend.invoice.pdfview');
				return $pdf->download('invoice_'.$txn_id.'.pdf');
			}
		}
	} */			public static function invoice_download($inv_id){				$invoice = Invoice::where('id', $inv_id)->get();		if(file_exists('http://beautycollective.com.au/public'.@$invoice[0]->path)){			$pdf = PDF::loadView('backend.invoice.pdfview');			return $pdf->download('invoice_'.$inv_id.'.pdf');		}		else{			/* $args = array('user_id' => Auth::user()->id, 'path' => '/invoices/invoice_'.$inv_id.'.pdf', 'generated_on' => date('Y-m-d H:i:s')); */			$invoice = '';			$invoice = Invoice::find($inv_id);			$invoice->user_id = Auth::user()->id;			$invoice->path = '/invoices/invoice_'.$inv_id.'.pdf';			$invoice->generated_on = date('Y-m-d H:i:s');			$invoice->save();				PDF::loadView('backend.invoice.pdfview')->save(public_path().'/invoices/invoice_'.$inv_id.'.pdf')->stream('download.pdf'); 				$pdf = PDF::loadView('backend.invoice.pdfview');				return $pdf->download('invoice_'.$inv_id.'.pdf');		}		/* $invoice = Invoice::where('id', $inv_id)->get();		if(@$invoice[0]->id){			$pdf = PDF::loadView('backend.invoice.pdfview');			return $pdf->download('invoice_'.$inv_id.'.pdf');		}		else{			$args = array('user_id' => Auth::user()->id, 'path' => '/invoices/invoice_'.$inv_id.'.pdf');			if(Invoice::create($args)){				PDF::loadView('backend.invoice.pdfview')->save(public_path().'/invoices/invoice_'.$inv_id.'.pdf')->stream('download.pdf'); 				$pdf = PDF::loadView('backend.invoice.pdfview');				return $pdf->download('invoice_'.$inv_id.'.pdf');			}		} */	}
	
	/*
	** Send Invoice email
	*/
	
	public static function send_invoice_email($txn_id){
		$txn_info = Transaction::where('transaction_id', $txn_id)->get();
		$invoice = Invoice::where('txn_id', $txn_id)->get();
		if(@$invoice[0]->id){
		}
		else{
			$args = array('txn_id' => $txn_id, 'path' => '/invoices/invoice_'.$txn_id.'.pdf');
			if(Invoice::create($args)){
				PDF::loadView('backend.invoice.pdfview')->save(public_path().'/invoices/invoice_'.$txn_id.'.pdf')->stream('download.pdf'); 
			}
			$invoice = '';
			$invoice = Invoice::where('txn_id', $txn_id)->get();
		}
		// send email
			$user = User::find($txn_info[0] -> user_id);
			
			$user['inv_path'] = public_path().$invoice[0]->path;
			$data = array('name'=>$user -> name,'txn_id'=>$txn_id);
			
			Mail::send('backend.emails.invoice', $data, function($send) use ($user){
				
			$send->from(getenv('ADMIN_EMAIL'));
			$send->attach($user['inv_path']);
			$send->to($user -> email)->subject('Invoice Receipt');
			});
	}

}
