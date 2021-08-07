@extends('emails.emailTemplate')
@section('email_content')
<div>
    <p>Dear {{$customer}}</p>
    <p>You sms package is successfully active by admin. Detail are as follow. </p>
    <ul>
        <li>Name:{{$customer}}</li>
        <li>Email :{{$email}}</li>
        <li>Package :{{$package}}</li>
    </ul>
    <p>Browse our <a href="{{env('APP_URL')."/faq"}}">Quick Guide and Frequently Asked Questions.</a></p>
    <p>We’re here to help you. Contact us for any questions about your account at support@stylerzone.com.au.</p>
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />
    <br />
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $id }}">click here.</a></p>
</div>
@endsection