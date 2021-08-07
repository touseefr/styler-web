@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Hello,</b></p>
    <p>We heard you’ve forgotten your password. No worries! You can access your account again by simply choosing a new password. The link below takes you to a secure place where you can quickly change your password:</p>			
    <p><a href="{{ env('APP_URL').'/password/reset/' . $token }}" target="_blank"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          >Change Password</a></p>

    <p>This change password link expires in 24 hours. If you didn’t request to change your Stylerzone password, you don’t need to do anything.</p>
    <br />
    <p>But if you keep receiving these password reset emails from us that you aren’t aware of, we suggest updating your account settings and password to keep your Stylerzone account safe.</p>

    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $id }}">click here.</a></p>                                                
</div>
@endsection