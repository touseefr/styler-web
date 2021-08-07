@extends('emails.emailTemplate') 
@section('email_content')
<div>  
    <div>Hi, <?php echo $sevrice_provider['business_name']; ?></div>
    <div>Someone has made a booking.</div>
    <div style="font-size: 15px;font-weight: bold;">Your Booking:</div>
    @if ($starting_time !== '')
    <div>Booking At: {!!$starting_time!!}</div>
    @endif
    <div>Name : {!! $deal['title'] !!}</div>
    <div>Customer Name : {!! $customer_info['fname'].' '.$customer_info['lname']; !!}</div>
    <div>Customer Email : {!! $customer_info['uemail']; !!}</div>       
    <div>Phone : {!! $customer_info['contact_number']; !!}</div>       
    <div>You can also view or change the details of your booking on your dashboard <a href="{{env('APP_URL').'/account#/settings/booking'}}">Click here.</a>.
        Got questions? Contact our support team at support@stylerzone.com.au.</div>
    <div>Thanks for booking with Stylerzone and we hope you enjoy your treatment.
    </div>
    <div><p>Thanks,</p>
    <p>Styerlzone</p> </div>    
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $sevrice_provider['id'] }}">click here.</a></p>                   
</div>
@endsection