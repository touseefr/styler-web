@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Dear Admin,</b></p>
    <p>{{$NAME}} has submitted a query. Please review below:</p>
    <p><b>Name:</b> {{$NAME}}</p>
    <p><b>Email:</b> {{$EMAIL}}</p>
    <p><b>Phone:</b> {{$PHONE}}</p>
    <p><b>Message:</b> <?php echo nl2br($MESSAGE); ?></p>
    <br/>	
    <div>
        <b><p>Thanks,</p>
            <p>Styerlzone</p></b>
    </div>
</div>
@endsection