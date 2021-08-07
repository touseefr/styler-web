@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p>Your Stylerzone Premier Business Account free trial is ending in two days.</p>
    <p>Over the last couple of months, we hope you were able to see the potential of using Stylerzone’s full features to help your beauty business flourish.</p>			
    <p>If you wish to continue using your Stylerzone’s Premier Business Account, you can upgrade your subscription now.</p>     
    <p> 
        <a href="<?php echo env('APP_URL') . '/account#/settings/subscription'; ?>" target="_blank"
           style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;">
            Upgrade my Account
        </a>
    </p>
    <p>Need more time to decide? Click here to extend your free trial to 7 days. </p>
    <p>Once the free trial period ends, your account will automatically be downgraded to Basic Account.</p>
    <p>With a Basic Account, you will still be able to have your own business page with your contact details, store hours, and a photo and video. You will still appear on our search results. You also have the option to continue using our online booking system for a fee.</p>
    <p>However, you will no longer be able to access the following features when you downgrade to a Basic Account:</p>
    <ul>
        <li>Maximize marketing efforts. You will no longer be able to post your deals and promotions</li>
        <li>Recruit staff. You will no longer be able to  post jobs on our classifieds.</li>
        <li>Connect with suppliers. You will no longer be able to trade with other businesses on our website.</li>
        <li>Sell your products. You will no longer post ads and information about the products you’re selling.</li>
        <li>Benefit from customer feedback. You will no longer be able to receive reviews from your customers.</li>        
    </ul>    
    <p>Got questions? Contact our support team at support@stylerzone.com.au.</p>  
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="<?php echo env('APP_URL') . '/deactivateMe/' . base64_encode($user_id) ?>">click here.</a></p>                                                
</div>
@endsection
