@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Dear Admin,</b></p>
    <p>This is to inform you that the review posted by <b>{{$user_from['name']}}</b> has been reported as "fake"by service provider <b>{{$user_to['name']}}</b>. Please look into and do the needful.</p>
    <p>Review Detail</p>
    <p>{{$fake_detail}}</p>
    <br/>
    <div>
        <b><p>Thanks,</p>
            <p>Styerlzone</p>
    </div>
</div>
@endsection