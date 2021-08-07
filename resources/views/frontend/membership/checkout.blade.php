@extends('frontend.layouts.account') @section('content')
<section class="container animated fadeIn">
     @include('frontend.includes.sub_header')
</section>
<div class="clear"></div>
<section class="bg_gray border_top login_container">
    <div class="container">
        <div class="row" style="padding-top: 80px;padding-bottom: 80px;">
            <div class="col-md-12">
                <div class="row">
                     <div class="col-sm-10 col-sm-offset-1">
			<form name="payment-form" action="" method="post">		  
      <div id="payment_form" style="">
                     <input value="" name="_token" type="hidden">
                     <input value="135" name="pid" type="hidden">
                     <!--<input type="hidden" value="Basic" name="type">
                     <input type="hidden" value="2" name="plan_id">-->
                     <div class="make-a-payment">
                      
                        
                  
                        <div class="row">
                           <div class="col-md-12">
                              <div class="payment">
                                 <div id="payment" class="woocommerce-checkout-payment">
                                    <ul class="wc_payment_methods payment_methods methods">
									 <li class="paypal-pay">
                                          <div style="padding: 0px;" class="col-md-2">
                                             <input checked id="payment_method_paypal" class="input-radio" name="payment_method" value="paypal" data-order_button_text="Proceed to PayPal" type="radio"><strong>PayPal</strong>
                                          </div>
                                          <div class="col-md-5">
                                             <img class="img-responsive" style="float:left;" src="https://www.rentalect.com/assets/images/paypal-icon.png" alt="PayPal Acceptance Mark">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                             <a href="https://www.paypal.com/us/webapps/mpp/paypal-popup" class="a_link" onclick="javascript:window.open('https://www.paypal.com/us/webapps/mpp/paypal-popup','WIPaypal','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=1060, height=700'); return false;" title="What is PayPal?">What is PayPal?</a>	
                                          </div>
                                          <div class="col-md-6"></div>
                                       </li>
									   <br/>
									   <br/>
									 									
                                       <li class="wc_payment_method payment_method_credit">
                                          <input id="show" class="input-radio" name="payment_method" value="credit" required="required" type="radio">
                                          <label for="payment_method_credit"><strong>Credit Card </strong>
                                          <img class="visa-img" src="https://www.rentalect.com/assets/images/visa.png" alt="Visa">
                                          <img src="https://www.rentalect.com/assets/images/mastercard.png" alt="Mastercard">
                                          <img src="https://www.rentalect.com/assets/images/amex.png" alt="Amex">
                                          <img src="https://www.rentalect.com/assets/images/discover.png" alt="Discover">
                                          <img src="https://www.rentalect.com/assets/images/jcb.png" alt="JCB">
                                          <img src="https://www.rentalect.com/assets/images/diners.png" alt="Diners">
                                          </label>
                                          <div style="display: none;" class="payment_box payment_method_credit">
                                             <fieldset>
                                                <div class="credit_new_card" data-description="" data-amount="5000" data-name="Porter and York" data-currency="usd" data-image="" data-bitcoin="false" data-locale="en">
                                                   <fieldset id="wc-credit-cc-form" class="wc-credit-card-form wc-payment-form">
                                                      <div class="row">
                                                         <div class="col-md-4">
                                                            <label for="first_name">First Name<span class="required">*</span></label>
                                                            <input class="form-control" autocomplete="off" placeholder="First Name" name="first_name" required="required" type="text">
                                                         </div>
                                                         <div class="col-md-4">
                                                            <label for="last_name">Last Name<span class="required">*</span></label>
                                                            <input class="form-control" autocomplete="off" placeholder="Last Name" name="last_name" required="required" type="text">
                                                         </div>
                                                         <div class="col-md-4">
                                                            <label for="credit-card-type">Card Type <span class="required">*</span></label>
                                                            <select class="form-control" name="card_type" required="required">
                                                               <option value="">Select a type</option>
                                                               <option value="amex">American Express</option>
                                                               <option value="mastercard">Master</option>
                                                               <option value="visa">Visa</option>
                                                               <option value="discover">Discover</option>
                                                            </select>
                                                         </div>
                                                      </div>
                                                      <div class="row">
                                                         <div class="col-md-4">
                                                            <label for="card-num">Card Number<span class="required">*</span></label>
                                                            <input class="form-control" autocomplete="off" placeholder="Card Number" name="credit-card-number" required="required" type="text">
                                                         </div>
                                                         <div class="col-md-4">
                                                            <label for="credit-card-expiry">Expiration Month <span class="required">*</span></label>
                                                            <select class="form-control" name="expiry-month" id="expiry-month" required="required">
                                                               <option value="">Month</option>
                                                               <option value="01">Jan (01)</option>
                                                               <option value="02">Feb (02)</option>
                                                               <option value="03">Mar (03)</option>
                                                               <option value="04">Apr (04)</option>
                                                               <option value="05">May (05)</option>
                                                               <option value="06">June (06)</option>
                                                               <option value="07">July (07)</option>
                                                               <option value="08">Aug (08)</option>
                                                               <option value="09">Sep (09)</option>
                                                               <option value="10">Oct (10)</option>
                                                               <option value="11">Nov (11)</option>
                                                               <option value="12">Dec (12)</option>
                                                            </select>
                                                         </div>
                                                         <div class="col-md-4">
                                                            <label for="credit-card-expiry">Expiration Year <span class="required">*</span></label>
                                                            <select class="form-control" name="expiry-year" required="required">
                                                               <option value="">Year</option>
                                                               <option value="2013">2013</option>
                                                               <option value="2014">2014</option>
                                                               <option value="2015">2015</option>
                                                               <option value="2016">2016</option>
                                                               <option value="2017">2017</option>
                                                               <option value="2018">2018</option>
                                                               <option value="2019">2019</option>
                                                               <option value="2020">2020</option>
                                                               <option value="2021">2021</option>
                                                               <option value="2022">2022</option>
                                                               <option value="2023">2023</option>
                                                            </select>
                                                         </div>
                                                      </div>
                                                      <div class="row">
                                                         <div class="col-md-4">
                                                            <label for="credit-card-cvc">Card Code <span class="required">*</span></label>
                                                            <input class="form-control" autocomplete="off" placeholder="CVC" name="credit-card-cvc" required="required" type="text">
                                                         </div>
                                                         <div class="col-md-4">
                                                            <label for="zipcode">Zipcode<span class="required">*</span></label>
                                                            <input class="form-control" autocomplete="off" placeholder="Zipcode" name="zipcode" required="required" type="text">
                                                         </div>
                                                      </div>
                                                      <div class="clear"></div>
                                                   </fieldset>
                                                </div>
                                             </fieldset>
                                          </div>
                                       </li>
                               
                                      
                                      <div class="col-md-12 terms-cond padd0">
                                          <div class="form-group">
                                             <input style="float:left;" name="term_cond" class="margin-top0" required="required" type="checkbox">
                                             <div class="registrat-txt11">I have read and understand the <a href="https://www.rentalect.com/terms-and-conditions" class="a_link">terms of the contract</a></div>
                                          </div>
                                       </div>
                                       <div class="clear"></div>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="regist1">
                        <center><button value="" type="submit" class="btn btn-primary">Countinue</button></center>
                     </div>
                  </div>
				  </form>
<!--         <div class="col-sm-1"></div> -->
       
        </div> <!-- end col-sm-10 -->
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
