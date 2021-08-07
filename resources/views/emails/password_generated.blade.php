@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Dear user,</b></p>
    <p>Your system generated password is {{$password}}</p>
    <br/>
    <p>
        to reset your password please follow below link.
        <br>
        {{ trans('strings.click_here_to_reset') . (env('APP_URL').'/password/reset/' . $token) }}
    </p>
    <div>
        <b><p>Thanks,</p>
            <p>Styerlzone</p></b>
    </div>
</div>
@endsection

