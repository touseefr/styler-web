@extends('emails.emailTemplate') 
@section('email_content')
		<div>
			<p><b>Dear {{$NAME}},</b></p>
			<p>Thank you for your purchase on BeautyTouch plan listed below. </p>
			<p>This email confirms payment for <b>Order Number: {{$ORDER_NUM}}</b></p> 
			<p><strong>Please find your account plan details below:</strong></p><br>
			<div style="width:700px;">
				<table style="table-layout: fixed;width:650px ! important;cellspacing=18;cellpadding=9;" border="1">
				<thead>
					<tr>
						<th>Plan Name</th>
						<th>Plan Duration</th>
						<th>Total Amount</th>
						<th>Discount(%)</th>
						<th>Amount Paid</th>
						<th>Currency</th>
						<th>Date</th>
						<th>Expiry Date</th>
					</tr>
				</thead>
				<tbody>

					<tr>
						<td>{{$PLAN_NAME}}</td>
						<td>{{$PLAN_DURATION}}</td>
						<td>{{$TOTAL_AMOUNT}}</td>
						<td>{{$DISCOUNT}}</td>
						<td>{{$AMOUNT_PAID}}</td>
						<td>{{$CURRENCY}}</td>
						<td>{{$DATE}}</td>
						<td>{{$EXPIRY}}</td>
					</tr>
					
				</tbody>
			</table>
			</div><br>
			<div>
				<b><p>Thanks & Regards,</p>
				<p>Stylerzone Team</p></b>
			</div>
		</div>
@endsection