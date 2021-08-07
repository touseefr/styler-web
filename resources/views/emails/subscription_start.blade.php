@extends('emails.emailTemplate') 
@section('email_content')
		<div>
			<p><b>Dear {{$NAME}},</b></p>
			<p>Your subscription has been started successfully. Now you will charge from next billing cycle.</p>
			
			<br/>
			
			<div>
				<b><p>Thanks & Regards,</p>
				<p>Stylerzone Team</p></b>
			</div>
		</div>
@endsection