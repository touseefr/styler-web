@extends('emails.emailTemplate') 
@section('email_content')
		<div>
			<p><b>Dear {{$NAME}},</b></p>
			<p>Your subscription has been stopped successfully. Now you will not charge from next billing cycle.</p>
			
			<br/>
			
			<div>
				<b><p>Thanks & Regards,</p>
				<p>Stylerzone Team</p></b>
			</div>
		</div>
@endsection