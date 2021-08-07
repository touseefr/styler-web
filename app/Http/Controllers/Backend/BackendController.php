<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Repositories\Backend\Subscription\InvoiceRecordsContract;
use Input;
use App\Transaction;
use App\User;
use App\Review;
use Settings;
use App\Http\Requests;
use Illuminate\Http\Request;
use DB;
use PDF;
use Auth;
use Mail;
use Redirect;
Use App\Invoice;

/**
 * Class GatewayController
 * @package App\Http\Controllers\Backend
 */
class BackendController extends Controller {
    /*
     * * Backend admin login
     */

    private $invoice_records;

    function __construct(InvoiceRecordsContract $invoicerecords) {
        $this->invoice_records = $invoicerecords;
//        parent::__construct();
    }

    public function admin_login() {
        return view('backend.login.login');
    }

    /*
     * * Admin login submit
     */

    public function admin_login_post() {
        $username = Input::get('username');
        $password = Input::get('password');
        if (Auth::attempt(['email' => $username, 'password' => $password])) {
            //return Redirect::intended('/admin/dashboard');
            return redirect('admin/dashboard');
        }

        return redirect('admin/login')->with(array('type' => 'error', 'message' => 'That username/password combo does not exist.'));
    }

    /*
     * * Admin logout
     */

    public function admin_logout() {
        Auth::logout();
        return redirect('admin/login');
    }

    /**
     * @return \Illuminate\View\View
     */
    public function video_settings() {
        return view('backend.video.video');
    }

    /*
     * * Video save
     */

    public function video_settings_save() {
        Settings::set('video', Input::get('video'));
        return redirect('admin/video')->with(array('type' => 'success', 'message' => 'Video has been posted successfully!'));
    }

    /*
     * * Transactions
     */

    public function transactions() {

        $transactions = $this->invoice_records->getInvoiceDetail();
        $mode = array("Previous", "Active");
        $plan_name = array(
            "plan_E0VKE9WT1Y2WE3" => "Monthly Add on booking system",
            "plan_E0VKFf9gXOswGu" => "Annually Add on booking system",
            "plan_E1en4B0RGC0472" => "Monthly Glamours - Premium",
            "plan_E1eoYxQNFld1yM" => "Annually Glamours - Premium",
            "plan_E0a93bgwoQUa6k" => "Monthly Glamours - Premium",
            "plan_E1eldC6p1p9Cao" => "Annually Glamours - Premium",
            "plan_E1emJ7wxlmrwF4" => "Monthly Glamours - Premium",
            "plan_E1emMYpcUKiZwr" => "Annually Glamours - Premium",
        );
        return view('backend.transactions.transactions')->with(array('transactions' => $transactions, "mode" => $mode, "plan_name" => $plan_name));
    }

    /*
     * * View Transaction Info
     */

    public function view_txn_info($txn_id) {
        return view('backend.transactions.view_info')->with(array('txn_id' => $txn_id));
    }

    public function invoice_generate(Request $request) {
        $txn_id = $_REQUEST['txn_id'];
        return Invoice::invoice_download($txn_id);

        /* $txn_id = $_REQUEST['txn_id'];
          PDF::loadView('backend.invoice.pdfview')->save(public_path().'/invoices/invoice_'.$txn_id.'.pdf')->stream('download.pdf');
          $pdf = PDF::loadView('backend.invoice.pdfview');
          return $pdf->download('invoice_'.$txn_id.'.pdf'); */

        // return view('backend.invoice.pdfview');
    }

    /*
     * * Print Invoice
     */

    public function print_invoice() {
        return view('backend.invoice.pdfview');
    }

    /*
     * * Send Invoice
     */

    public function send_invoice() {
        $txn_id = Input::get('txn_id');
        Invoice::send_invoice_email($txn_id);
    }

    /*     * ************************************* Reviews Functions *********************************** */
    /*     * ******************************************************************************************* */
    /*
     * * Reviews
     */

    public function reviews() {
        /*
         * * Pagination
         */

        /* $limit = Settings::get('pagination_limit');
          $set = (isset($_GET['set'])) ? $_GET['set'] : 1;
          $offset = User::get_offset($limit, $set);
          $targetset = url('admin/reviews');
          $reviews_limited = DB::select("select * from rating_reviews order by id desc limit {$offset}, {$limit}");
          $reviews_all = DB::select("select * from rating_reviews order by id desc");
          $total_records = count($reviews_all);

          return view('backend.reviews.reviews')->with(array('reviews' => $reviews_limited, 'targetset' => $targetset, 'total_records' => $total_records, 'limit' => $limit, 'set' => $set)); */

        $reviews_all = DB::table('rating_reviews')->whereIn('status', [1, 2,4])->orderBy('id', 'desc')->get();
        return view('backend.reviews.reviews')->with(array('reviews' => $reviews_all));
    }

    /*
     * * Edit review
     */

    public function edit_review() {
        $review_id = Input::get('review_id');
        $review = Review::find($review_id);
        echo $review->review_comment;
    }

    /*
     * * Update review
     */

    public function update_review() {
        print_r(Input::all());
        $review = Review::find(Input::get('review_id'));
        $review->review_comment = Input::get('edit_review_comment');
        $review->save();
        return redirect('admin/reviews')->with(array('type' => 'success', 'message' => 'Review has been updated successfully.'));
    }

    /*
     * * Delete Review
     */

    public function delete_review($review_id) {
        echo $review_id;
        if (Review::find($review_id)->delete()) {
            return redirect('admin/reviews')->with(array('type' => 'success', 'message' => 'Review has been deleted successfully!'));
        } else {
            return redirect('admin/reviews')->with(array('type' => 'error', 'message' => 'Review could not be deleted!'));
        }
    }

    /*
     * * Approve Review
     */

    public function approve_review($review_id) {
        $review = Review::find($review_id);
        $review->status = 1;
        $review->save();
        return redirect('admin/reviews')->with(array('type' => 'success', 'message' => 'Review has been approved successfully!'));
    }

    public function bad_approve_review($review_id) {
        $review = Review::find($review_id);
        $review->status = 1;
        $review->save();
        return redirect('admin/bad/reviews')->with(array('type' => 'success', 'message' => 'Review has been approved successfully!'));
    }

    /*
     * * Suspend Review
     */

    public function suspend_review($review_id) {        
        $review = Review::find($review_id);
        $review->status = 3;
        $review->save();
        return redirect('admin/reviews')->with(array('type' => 'success', 'message' => 'Review has been suspended successfully!'));
    }

    public function get_sponser_view() {

        return view('backend.sponser.sponser');
    }

    public function searchInvoiceRecords(Request $request) {
        $invoices = $this->invoice_records->searchInvoiceRecords($request->all());
        $mode = array("Previous", "Active");
        $plan_name = array(
            "plan_E0VKE9WT1Y2WE3" => "Monthly Add on booking system",
            "plan_E0VKFf9gXOswGu" => "Annually Add on booking system",
            "plan_E1en4B0RGC0472" => "Monthly Glamours - Premium",
            "plan_E1eoYxQNFld1yM" => "Annually Glamours - Premium",
            "plan_E0a93bgwoQUa6k" => "Monthly Glamours - Premium",
            "plan_E1eldC6p1p9Cao" => "Annually Glamours - Premium",
            "plan_E1emJ7wxlmrwF4" => "Monthly Glamours - Premium",
            "plan_E1emMYpcUKiZwr" => "Annually Glamours - Premium",
        );

        $records = array();
        foreach ($invoices as $key => $transaction) {

            $invoice_link = "";
            if ($transaction->stripe_string_payment_succeeded && !empty($transaction->stripe_string_payment_succeeded)) {
                $invoices = unserialize($transaction->stripe_string_payment_succeeded);
                $invoice_link = 'href="' . $invoices['hosted_invoice_url'] . '"';
            }

            if (array_key_exists($transaction->plan_title, $plan_name)) {
                $records[] = array(
//                 $transaction->id,
                    $transaction->userDetail->name,
                    $mode[$transaction->type],
                    $plan_name[$transaction->plan_title],
                    $transaction->interval,
                    ($transaction->amount) / 100,
                    $transaction->start_from,
                    $transaction->end_at,
                    ' <a class="btn btn-xs btn-success mb-2" ' . $invoice_link . '">
                                    <i class="fa fa-th-list" aria-hidden="true"></i>
                                </a>',
                );
            }
        }
        return array("status" => "200", "records" => \GuzzleHttp\json_encode($records));
    }

    public function testFile(){
        echo "Welcome to Excel World";
        echo "<br />";
        echo $path = public_path() . "\assets\importData\Administrator_panel.xlsx";
        echo "<br />";
        echo "<pre>";
        $reader = \Maatwebsite\Excel\Facades\Excel::load($path);
        $headerRow = $reader->all();
        foreach ($headerRow as $row) {
            print_r($row);
            echo "<br />";
            echo "--------------------------------------------------------------------------------------";
            echo "<br />";
            foreach($row as $r) {
                print_r($r->reviewer);
                echo "<br />";
                echo "--------------------------------------------------------------------------------------";
                echo "<br />";
            }
//            print_r($row->getItems());
            echo "--------------------------------------------------------------------------------------";
            echo "<br />";
        }
//        print_r($headerRow);
        exit;
    }

}
