@extends ('backend.layouts.master')

@section ('title', 'Transaction Info')

@section('page-header')
    <h1>
      Transaction ID: {{$txn_id}}
    </h1>
@endsection

@section ('breadcrumbs')
    <li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
    <li class="active">Transaction Info</li>
@stop

@section('content')
@if(Session::has('message'))
   <div class="alert alert-{{Session::get('type')}}" style="text-align: center;">					   {{Session::get('message')}}</div>
@endif
<?php 

$transaction_info = App\Transaction::where('transaction_id', $txn_id)->get();
$txn_date = date('Y/m/d', strtotime($transaction_info[0] -> created_at));
$user = DB::select("select * from users where id = {$transaction_info[0] -> user_id}");
$user_info = DB::select("select * from user_info where user_id = {$transaction_info[0] -> user_id}");
$invoice = App\Invoice::where('txn_id', $txn_id)->get();
$plan = @unserialize($transaction_info[0] -> plan);
$features = @unserialize($plan['features']);
?>
<div class="row">
			<div class="col-xs-12">
				<div class="box">
					
					<!-- /.box-header -->
					<div class="box-body">
						<div class="transaction-details">
						<div class="user-info boxess">
								<h3><strong>User Info</strong></h3>
								<hr/>
									<table class="table table-striped table-bordered table-hover">
										<tr>
												<td><b>Name:</b> </td>
												<td>{{ucwords($user[0] -> name)}}</td>
										</tr>
										<tr>
												<td><b>Email:</b> </td>
												<td>{{$user[0] -> email}}</td>
										</tr>
								
									</table>
									
						</div>
						<div class="txn-info boxess">
								<h3><strong>Transaction Info</strong></h3>
								<hr/>
								<table class="table table-striped table-bordered table-hover">
										<tr>
												<td><b>Transaction ID:</b> </td>
												<td>{{$txn_id}}</td>
										</tr>
										<tr>
												<td><b>Mode:</b> </td>
												<td>{{ucfirst($transaction_info[0] -> mode)}}</td>
										</tr>
								
								</table>
									
						</div>
						<div class="plan-info boxess">
								<h3><strong>Plan Info</strong></h3>
								<hr/>
								<table class="table table-striped table-bordered table-hover">
										<tr>
												<td><b>Plan Name:</b> </td>
												<td>{{ucwords($plan['name'])}}</td>
										</tr>
										<tr>
												<td><b>Description:</b> </td>
												<td>{{nl2br($plan['desc'])}}</td>
										</tr>
										<tr>
											<td><b>Duration:</b></td>
											<td>{{$plan['duration']}}</td>
										</tr>
										<tr>
											<td><b>Pricing:</b></td>
											<td>{{$transaction_info[0] -> amount}} {{$transaction_info[0] -> currency}}</td>
										</tr>
										<tr>
											<td><b>Discount(%):</b></td>
											<td>10.00</td>
										</tr>
										<tr>
											<td><b>Purchased date:</b></td>
											<td>{{$plan['purchased_date']}}</td>
										</tr>
										<tr>
											<td><b>Expiry date:</b></td>
											<td>{{$plan['expired_date']}}</td>
										</tr>
										<tr>
											<td><b>Features:</b></td>
											<td><table class="table table-striped table-bordered table-hover">
												<tr>
														<th>Amount of listings per month</th>
														<th>How many images can be uploaded?</th>
														<th>How many videos can be uploaded?</th>
														<th>Type of listing they can do</th>
												</tr>
												<tr>
													<td>{{$features['listing_per_month']}}</td>
													<td>{{$features['images_count']}}</td>
													<td>{{$features['videos_count']}}</td>
													<td><?php echo App\Plan::get_listing_types_text($features['listing_types']);?></td>
												</tr>
											</table></td>
										</tr>
								
								</table>
									
								
						</div>
							
						</div>
					</div>
					<!-- /.box-body -->
				</div>
				<!-- /.box -->
			</div>
			<!-- /.col -->
		</div>



    <div class="clearfix"></div>
@stop