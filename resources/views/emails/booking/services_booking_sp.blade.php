@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <div>Hi, <?php echo $sevrice_provider['business_name']; ?></div>
    <div>Someone has made a booking.</div>
    <div style="font-size: 15px;font-weight: bold;">Your Booking:</div>
    <div>Booking At: {!!$starting_time!!}</div>
    <div>
        <?php foreach ($booked_services as $service) { ?>
            <div> Title : <?php echo $service['title']; ?></div>
            <div>Description : <?php echo $service['des']; ?></div>
            <div>Price : <?php echo $service['price']; ?></div>
        <?php } ?>
    </div>
    <div>Customer Name : <?php echo $customer_info['name']; ?></div>
    <div>Customer Email : <?php echo $customer_info['email']; ?></div>  

    <div>You can also view or change the details of your booking on your dashboard <a href="{{env('APP_URL').'/account#/settings/booking'}}">Click here.</a>.
        Got questions? Contact our support team at support@stylerzone.com.au.</div>
    <div>Thanks for booking with Stylerzone and we hope you enjoy your treatment.
    </div>
    <div><p>Thanks,</p>
        <p>Styerlzone</p> </div>    
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . base64_encode($sevrice_provider['id']) }}">click here.</a></p>                   
</div>
@endsection