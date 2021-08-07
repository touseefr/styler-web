<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
//use App\Http\Requests;
use App\Models\UserSubscription\UserSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class ReviewController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function manageBadReview()
    {
        return view('backend.reviews.badwords')->withBadwords($this->fetchBadWords());
    }

    private function fetchBadWords()
    {
        $badwords = DB::table('bad_words')->get();
        return $badwords;
    }

    public function saveBadWord(Request $request)
    {
        $id     = $request->input('wordId');
        $word   = $request->input('badWord');
        $type   = ($request->has('isActive')) ? $request->input('isActive') : '0';
        $record = array("bad_word" => $word, "is_active" => $type);
        try {
            if ($request->has('wordId') && $id) {
                DB::table('bad_words')
                    ->where('id', $id)
                    ->update($record);
            } else {
                DB::table('bad_words')->insert($record);
            }
            return array("status" => "200", "msg" => "All is Well");
        } catch (Exception $e) {
            return array("status" => "210", "msg" => "Some thing went wrong.Please try later", "error" => $e->showMessage());
        }
    }

    public function deleteBadWord($id)
    {
        DB::table('bad_words')->where('id', $id)->delete();
        return back();
    }

    public function fetchBadReviews()
    {
        $reviews_all = DB::table('rating_reviews')->whereIn('status', [0])->orderBy('id', 'desc')->get();
        return view('backend.reviews.bad_reviews')->with(array('reviews' => $reviews_all));
    }
    public function showReceipt($id)
    {
        $usersub = UserSubscription::find($id);
        if (!empty($usersub->stripe_invoiceId)) {
            $stripeInfo = json_decode($usersub->stripe_invoiceId);
            $invoiceId  = $stripeInfo->data->object->invoice;
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
            $invoice_info = \Stripe\Invoice::retrieve($invoiceId);
            return Redirect::to($invoice_info->hosted_invoice_url);             
        }

    }
    public function getPreviousInvoices(Request $request){    
        // print_r($request->input('customer_id'));     
     $customer_id=$request->input('customer_id');
     \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
     $invoice_info=\Stripe\Invoice::all(["customer"=>$customer_id]); 
     return view('backend.invoice.previous_invoices')->with(array('invoices' => $invoice_info));
     exit;
    
    }
    public function getCurrentBalance(){
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $stripe_balance= \Stripe\Balance::retrieve();
        print_r($stripe_balance);
        exit;
    }
      public function ReviewReport(Request $request) {
        $reviews_all = DB::table('rating_reviews')->whereIn('rating_reviews.status', ['4'])->orderBy('rating_reviews.id', 'desc')->get();        
//        print_r($reviews_all);
//        exit;
        return view('backend.reviews.reportreviews')->with(array('reviews' => $reviews_all));
    }

}
