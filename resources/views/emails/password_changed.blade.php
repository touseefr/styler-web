@extends('emails.emailTemplate') 
@section('email_content')
		<div>
			<p><b>Dear {{$NAME}},</b></p>
			<p>The password for your BEAUTY TOUCH Account {{$EMAIL}} was recently changed.</p>
			<br/>
			<p><b>Don't recognize this activity?</b></p>
			<p>Please contact website administrator to recover your account.</p>
			<br/>
			<div>
				<b><p>Thanks & Regards,</p>
				<p>Stylerzone Team</p></b>
			</div>
		</div>
@endsection
