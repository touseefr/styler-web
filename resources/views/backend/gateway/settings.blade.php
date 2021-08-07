@extends ('backend.layouts.master')

@section ('title', 'Payment Gateway Management')

@section('page-header')
    <h1>
       Payment Gateway Management
    </h1>
@endsection

@section ('breadcrumbs')
    <li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
    <li class="active">Payment Gateway Management</li>
@stop

@section('content')
@if(Session::has('message'))
   <div class="alert alert-{{Session::get('type')}}" style="text-align: center;">					   {{Session::get('message')}}</div>
@endif
<?php 
$paypal_settings = unserialize(Settings::get('paypal_settings'));
?>
<div class="row">
			<div class="col-xs-12">
				<div class="box">
					
					<!-- /.box-header -->
					<form name="gateway_settings" action="" method="post" class="form-horizontal">
					<input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">

					<div class="box-body">
							<div class="form-group">
								<label for="inputEmail3" class="col-sm-4">Mode</label>
								<div class="col-sm-8">
								<?php 
										$modes = array('sandbox' => 'Sandbox', 'production' => 'Production');
										foreach($modes as $key => $value){
											$checked = ($key == $paypal_settings['mode']) ? 'checked' : '';
											echo '<input '.$checked.' type="radio" name="mode" value="'.$key.'"/> '.$value.'';
										}
							    ?>	
								</div>
							</div>
							<div class="form-group">
								<label for="inputEmail3" class="col-sm-4">Paypal Email</label>
								<div class="col-sm-8">
									<input name="paypal_email" class="form-control" id="paypal_email" placeholder="paypal Email" type="text" value="{{$paypal_settings['paypal_email']}}" required />
								</div>
							</div>
							<div class="form-group">
								<label for="inputEmail3" class="col-sm-4">API Username</label>
								<div class="col-sm-8">
									<input name="api_username" class="form-control" id="api_username" placeholder="API Username" type="text" value="{{$paypal_settings['api_username']}}" required />
								</div>
							</div>
							<div class="form-group">
								<label for="inputEmail3" class="col-sm-4">API Password</label>
								<div class="col-sm-8">
									<input name="api_password" class="form-control" id="api_password" placeholder="API Password" type="text" value="{{$paypal_settings['api_password']}}" required />
								</div>
							</div>
							<div class="form-group">
								<label for="inputEmail3" class="col-sm-4">Signature</label>
								<div class="col-sm-8">
									<input name="api_signature" class="form-control" id="api_signature" placeholder="Signature" type="text" value="{{$paypal_settings['api_signature']}}" required />
								</div>
							</div>
						
					</div>
					<div class="box-footer">
						<button type="submit" class="btn btn-info pull-right">Save</button>
					</div>
					</form>
					<!-- /.box-body -->
				</div>
				<!-- /.box -->
			</div>
			<!-- /.col -->
		</div>



    <div class="clearfix"></div>
@stop