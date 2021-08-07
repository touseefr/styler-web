@extends('emails.emailTemplate') 
@section('email_content')
		<div>
			<p><b>Dear {{$TO_NAME}},</b></p>
			<p>You have received a new review on your profile. Please review below:</p>
			
			<p><b>Name:</b> {{$FROM_NAME}}</p>
			<p><b>Review Rating:</b> {{$RATING}}</p>
			<p><b>Review:</b> {{nl2br($REVIEW)}}</p>
			<p><b>Approximate Price:</b> {{$APPROXIMATE_PRICE}}</p>
			
			<br/>
			
			<div>
				<b><p>Thanks & Regards,</p>
				<p>Stylerzone Team</p></b>
			</div>
		</div>
@endsection
