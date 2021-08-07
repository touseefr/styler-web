@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p>At Stylerzone, we believe that there is always something when can do to make things better as we hate to let you go. What made you cancel? You can reply to this email. Your response can help us improve our service.</p>
    <p>Here are a few things we need to let you know if you’re really decided to cancel your Stylerzone membership:</p>
    <ul>
        <li>Your business profile will no longer be visible to hundreds of current and potential clients in your area.</li>
        <li>You will no longer receive inquiries and bookings from clients.</li>                            
        <li>Your offers, job postings, and other listings will no longer be visible.</li>                            
        <li>You will still be able to sign in with your details within (time period) if you wish to reactivate your account.</li>                            
    </ul>
    <p>Your membership will be cancelled 30 days from the date of your last payment.</p>

    <p>We at Stylerzone and your customers will surely miss having you here! We wish you all the best of luck.</p>
    <p>Or you can always give Stylerzone another go and see how we can make things work for you.</p>  
    <p><a href="{{env('APP_URL').'/account/confirm/' }}" target="_blank"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          >Reactive Now</a></p>                        
    <p>If you got some questions please contact us at support@stylerzone.com.au or  </p>                   
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />
    <br />    
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $id }}">click here.</a></p>                                                
</div>
@endsection
