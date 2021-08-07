@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Hi,  {{$customerName}}!,</b></p>
    <p>How was your service with {{$BusinessName}}?</p>
    <p>Stylerzone and our business partners would love to hear your feedback.</p>
    <p>Please click on the link below share your experience.</p>    
    <a href="{{env('APP_URL').'/profile?id='.$userId}}"
       style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
       > Write a review</a>
    <p>Thanks again for booking with Stylerzone and we hope you enjoyed your service.</p>   
    <p>Thanks,</p>
    <p>Styerlzone</p> 
</div>
@endsection