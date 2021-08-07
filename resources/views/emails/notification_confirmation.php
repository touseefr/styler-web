@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Hi,</b></p>
    <p>Notification Alert: You have a new notification for <b><?php echo $data['title']; ?></b></p> 
    <p><b>Name:</b> <?php echo $data['name']; ?></p>
    <p><b>Email:</b> <a href="mailto:<?php echo $data['email']; ?>}}"><?php echo $data['email']; ?></a></p>
    <p><b>Message:</b> <?php echo $data['message']; ?></p>
    <br/>
    <div>
        <b><p>Thanks,</p>
            <p>Styerlzone</p></b>
    </div>
</div>
@endsection