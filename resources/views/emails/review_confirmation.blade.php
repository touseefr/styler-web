@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Hi, {{$NAME}},</b></p>
    <p>Thanks for taking your time  to share your experience and thoughtful comments. You’ve just made someone’s day much better! Thousands of other customers are counting on reviews like yours before making a choice about their beauty needs. </p>
    <p>You can already view your amazing review <a href="{{$CONFIRM_LINK}}">here</a>. We’ve also sent the recipient a quick note to make sure they get your feedback.</p>
    <p>See you around!</p>
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $id }}">click here.</a></p>    
</div>
@endsection
