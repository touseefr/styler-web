@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>From</b>{{$FROM}}</p>
    <p><b>Dear Owner,</b></p>
    <p>{{$MESSAGE}}</p>
    <br/>
    <div>
        <b><p>Thanks,</p>
            <p>Styerlzone</p></b>
    </div>
</div>
@endsection