@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <div>Hi, <?php echo $customer_info['name']; ?></div>
    <div>Your booking with <?php echo $sevrice_provider['business_name']; ?> is confirmed!</div>
    <div style="font-size: 15px;font-weight: bold;">Your Booking:</div>
    <div>Booking At: <?php echo $starting_time; ?></div>
    <div>
        <?php foreach ($booked_services as $service) { ?>
            <div> Title : <?php echo $service['title']; ?></div>
            <div>Description : <?php echo $service['des']; ?></div>
            <div>Price : <?php echo $service['price']; ?></div>
        <?php } ?>
    </div>
    <div>Service Provider Name : <?php echo $sevrice_provider['business_name']; ?></div>
    <div>Address : <?php echo $sevrice_provider['business_address']; ?></div>
    <div>Phone : <?php echo $sevrice_provider['contact_number']; ?></div>
    <div>You can also view or change the details of your booking on your dashboard <a href="{{env('APP_URL').'/account#/settings/booking'}}">Click here.</a>.
        Got questions? Contact our support team at support@stylerzone.com.au.</div>
    <div>Thanks for booking with Stylerzone and we hope you enjoy your treatment.
    </div>
    <div><p>Thanks,</p>
        <p>Styerlzone</p> </div>    
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $customer_id }}">click here.</a></p>                   
</div>
@endsection