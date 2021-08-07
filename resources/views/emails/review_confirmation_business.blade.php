@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Hi, {{$NAME}},</b></p>
    <p>Guess what? You just received a fantastic review on Stylerzone. Great work!</p>
    <p>If you haven’t already checked it, now’s a good time to take a few seconds to read it and share your thoughts <a href="{{env('APP_URL').'/account#/reviews/received-reviews'}}">here</a> </p>
    <p>As a valued business on Stylerzone, your review can be potentially read by thousands of existing and potential customers. It’s your chance to shine!</p>
    <p> If you loved the feedback, thank your customer for the fab review. A little thanks goes a long way. </p>
    <p> Get more customers to write you a review. Send them to your page <a href="{{env('APP_URL').'/account#/reviews/request'}}">link</a> each time they visit you</p>
    <p>In case you have any questions, you can email us at <a href="mailto:support@stylerzone.com.au.">support@stylerzone.com.au</a>.</p>
    <p>Make it a great day!</p>
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $id }}">click here.</a></p>    
</div>
@endsection