<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;

/**
 * Class DashboardController
 * @package App\Http\Controllers\Backend
 */
class DashboardController extends Controller {

    /**
     * @return \Illuminate\View\View
     */
    public function index() {
        
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $stripe_balance= \Stripe\Balance::retrieve();
//        echo "<pre>";
//        print_r($stripe_balance);
//        echo "<br />**********************************************************************************************************************<br />";
        $available_balance=$stripe_balance->available[0]->amount;
        $pending_balance=$stripe_balance->pending[0]->amount;
//        echo $available_balance."<br />";
//        echo $pending_balance."<br />";
        $total_balance=($available_balance+$pending_balance)/100;
//        echo "<br />**********************************************************************************************************************<br />";
//        echo $total_balance;
//        echo date('Y-m-d', strtotime('first day of last month'));
//        echo  strtotime('first day of last month');
//        echo "<br/>";$d = new DateTime('first day of this month');

//        echo  strtotime('last day of last month');
//        echo "<br />";
//        $previous_month_invoices= \Stripe_BalanceTransaction::all(["created"=>["gte"=>strtotime('first day of last month'),"lte"=>strtotime('last day of last month')],"limit"=>10]);        
//        while($i=1){
//            
//            if($previous_month_invoices->has_more){
//                
//            }
//            
//        }
                
//        $previous_month_invoices= \Stripe_BalanceTransaction::all(["created"=>["gte"=>strtotime('first day of this month'),"lte"=>strtotime('now')],"limit"=>100]);        
//        print_r($previous_month_invoices);
//        exit;

        return view('backend.dashboard')->withBalance($total_balance);
    }

    /*
     * * User Visits
     */

    public function users_visits() {
        return view('backend.dashboard.visits');
    }

}
