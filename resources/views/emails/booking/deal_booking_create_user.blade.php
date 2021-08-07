@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <h2>Login Details</h2>
    <div>Hi, <?php echo $name; ?></div>
    <div>Email : <?php echo $email; ?></div>
    <div>Password : <?php echo $password; ?></div>
    For Login : <a href="{{env('APP_URL')}}/auth/login">Click Here</a>
</div>
@endsection