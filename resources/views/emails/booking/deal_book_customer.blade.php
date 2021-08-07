@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <div>Hi, {!! $customer_info['fname'].' '.$customer_info['lname'] !!}</div>
    <div>Your booking with {!! $sevrice_provider['business_name'] !!} is confirmed!</div>
    <div style="font-size: 15px;font-weight: bold;">Your Booking:</div>
    @if ($starting_time !== '')
    <div>Booking At: {!!$starting_time!!}</div>
    @endif
    <div>Deal Name : {!! $deal['title'] !!}</div>
    @if ($status === 0)
    <div>Deal token : {!! $later_token !!}</div>
    @endif
    <div>Service Provider Name : {!! $sevrice_provider['business_name'] !!}</div>
    <div>Address : {!! $sevrice_provider['business_address'] !!}</div>
    <div>Phone : {!! $sevrice_provider['contact_number'] !!}</div>
    <div>You can also view or change the details of your booking on your dashboard <a href="{{url('/account#/settings/booking')}}">Click here.</a>.
        Got questions? Contact our support team at support@stylerzone.com.au.</div>
    <div>Thanks for booking with Stylerzone and we hope you enjoy your treatment.
    </div>
    <p>Thanks,</p>
    <p>Styerlzone</p>    
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{url('deactivateMe/' . $customer_id) }}">click here.</a></p>                   
</div>
@endsection