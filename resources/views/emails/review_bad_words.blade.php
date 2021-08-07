@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Hi, {{$NAME}},</b></p>
    <p>Your feedback has been received. Thanks for sharing your thoughts with us, but we noticed some inappropriate words in your recently added review.</p>
    <p>You may want to check your review and filter out inappropriate words as we think that using the right words can get better results. Once your review has been edited and written in a respectable way, it can get published.</p>
    <p>As a quick guideline, a good review contains:</p>
    <ul>
        <li>Provides constructive feedback.</li>
        <li>Detailed, specific, and friendly.</li>
        <li>Civil and friendly.</li>
        <li>Talks about elements of the service.</li>
        <li>Leaves a way for the business to contact you if possible.</li>        
    </ul>    
    <p>Stylerzone is a friendly and respectful place where thousands of businesses, customers like you, and potential customers count on each other to further improve business services and help with making purchase decisions. 
    </p>

    <p>Please help us keep Stylerzone a safe community for all.</p>
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $id }}">click here.</a></p>    
</div>
@endsection