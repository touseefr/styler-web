@extends('emails.emailTemplate') 
@section('email_content')
<div>
    <p><b>Hello!,</b></p>
    <p>You’re almost ready to get started with Stylerzone! Just one last thing. Please confirm your account by tapping the button below to make sure we’ve got your email right.</p>			
    <p><a href="{{ $APP_URL.'/account/confirm/' . $token }}" target="_blank"
          style="display: block;background-color: #ff9e19;width:250px;text-align: center; padding:10px;border-radius: 4px;color: white;"
          > Confirm your email address</a></p>
    <p>Got questions? Please contact us on Support@stylerzone.com.au and we will get back to you.</p>
    <p>See you around!</p>
    <p>Thanks,</p>
    <p>Styerlzone</p>
    <br />    
    <br />        
    <p>If this is not you and you would like to unsubscribe from Stylerzone, please <a href="{{env('APP_URL').'/deactivateMe/' . $id }}">click here.</a></p>                                                
</div>
@endsection





