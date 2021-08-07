@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p>Hello</p>
    <p>We just tried to charge your credit card for {{$price}} but it failed</p>
    <p>Don’t worry! This just usually means you need to update your payment information. You might need to update your name on your credit card, credit card type, card number, expiry date, or your CVV code.</p>                        
    <p>In some instances, some payments fail because of a temporary system error or an interruption in your internet connection.</p>

    <p>Please refresh the payment page or go here to repeat the payment process. We’ll send you another email to let you know if it’s successful.</p>
    <p>Stylerzone will give you 7 days to update your billing information or payment method. </p>                          

    <p>Got any questions about billing and payment? Send us a message at support@stylerzone.com.au and we’ll get back to you quickly.</p>                        
    <p>Thanks for subscribing to Stylerzone!</p>                        
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />
    <br />    
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $id }}">click here.</a></p>                                                
</div>
@endsection