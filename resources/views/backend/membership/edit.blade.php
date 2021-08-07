@extends ('backend.layouts.master') 

@section ('title', 'Edit Membership Plan') 

@section('page-header')
<h1>
   Memberhsip Plans
</h1>
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a class="toolbar_btn" title="Faqs" href="{{url('admin/membership')}}">
                <i class="fa  fa-tags tool-icon"></i>
                <div>Plans</div>
            </a>
        </li>
        <li>
            <a href="{{url('admin/membership/add')}}" class="toolbar_btn" title="Create New Faq">
                <i class="fa fa-plus tool-icon"></i>
                <div>Add New Plan</div>
            </a>
        </li>   
    </ul>
</div>
@endsection

@section ('breadcrumbs')
    <li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
    <li><a href="{!!url('admin/membership')!!}">Plans</li></a></li>
    <li class="active">Edit Plan</li>
@stop

<?php 
	$features = unserialize($plan->features);
?>

@section('content')
@if(Session::has('message'))
   <div class="alert alert-{{Session::get('type')}}" style="text-align: center;">					   {{Session::get('message')}}</div>
@endif

<div class="row">
	<div class="col-xs-12">
		<div class="box box-default">
			<!-- form start -->
			{!! Form::open(array('url' => 'admin/membership/edit/', 'class' => 'form-horizontal')) !!}
				<input name="id" type="hidden" value="{{$plan->id}}" />
				<div class="box-body">
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-4">Plan Name</label>
						<div class="col-sm-8">
							<input name="name" class="form-control" id="name" placeholder="Plan Name" type="text" value="{{$plan->name}}" required />
						</div>
					</div>
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-4">Plan Description</label>
						<div class="col-sm-8">
							<textarea name="desc" class="form-control" id="desc" placeholder="Plan Description" required>{{$plan->desc}}</textarea>
						</div>
					</div>
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-4">Plan Price</label>
						<div class="col-sm-8">
							<input name="price" class="form-control" id="price" placeholder="Plan Price" type="text"  value="{{$plan->price}}" required />
						</div>
					</div>

					<div class="form-group">
						<label for="inputEmail3" class="col-sm-4">Currency Type</label>
						<div class="col-sm-8">
							<input name="currency_type" class="form-control" id="price" placeholder="Currency Type" type="text"  value="{{$plan->currency}}" required />
						</div>
					</div>

					<div class="form-group">
						<label for="inputEmail3" class="col-sm-4">Discount</label>
						<div class="col-sm-8">
							<input name="discount" class="form-control" id="discount" placeholder="Discount in %" type="text" value="{{$plan->discount}}"/>
						</div>
					</div>
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-4">Plan Duration</label>
						<div class="col-sm-8">
							<input name="duration" class="form-control" id="duration" placeholder="Plan Duration" type="text" value="{{$plan->duration}}" required />
						</div>
					</div>
					
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-4">Plan Features</label>
						<div class="col-sm-8">
							<table id="features">
								<thead>
									<th>#</th>
									<th>Listing/month</th>
									<th>Images</th>
									<th>Videos</th>								
								</thead>
								<tbody>
									<tr>
										<th width="150">Deals</th>
										<td><input name="features[deals][listing]" value="<?php echo $features['deals']['listing']?>" type="text"></td>
										<td><input name="features[deals][images]" value="<?php echo $features['deals']['images']?>" type="text"></td>
										<td><input name="features[deals][videos]" value="<?php echo $features['deals']['videos']?>" type="text"></td>
									</tr>
									
									<tr>
										<th>Business for Sale</th>
										<td><input name="features[businessforsale][listing]" value="<?php echo $features['businessforsale']['listing']?>" type="text"></td>
										<td><input name="features[businessforsale][images]" value="<?php echo $features['businessforsale']['images']?>" type="text"></td>
										<td><input name="features[businessforsale][videos]" value="<?php echo $features['businessforsale']['videos']?>" type="text"></td>
									</tr>
									
									<tr>
										<th>School & Colleges</th>
										<td><input name="features[schoolcolleges][listing]" value="<?php echo $features['schoolcolleges']['listing']?>" type="text"></td>
										<td><input name="features[schoolcolleges][images]" value="<?php echo $features['schoolcolleges']['images']?>" type="text"></td>
										<td><input name="features[schoolcolleges][videos]" value="<?php echo $features['schoolcolleges']['videos']?>" type="text"></td>
									</tr>
									
									<tr>
										<th>Gallery</th>
										<td><input name="features[gallery][listing]" value="<?php echo $features['gallery']['listing']?>" type="text"></td>
										<td><input name="features[gallery][images]" value="<?php echo $features['gallery']['images']?>" type="text"></td>
										<td><input name="features[gallery][videos]" value="<?php echo $features['gallery']['videos']?>" type="text"></td>
									</tr>
									
									<tr>
										<th>Servie Provider</th>
										<td><input name="features[serviceprovider][listing]" value="<?php echo $features['serviceprovider']['listing']?>" type="text"></td>
										<td><input name="features[serviceprovider][images]" value="<?php echo $features['serviceprovider']['images']?>" type="text"></td>
										<td><input name="features[serviceprovider][videos]" value="<?php echo $features['serviceprovider']['videos']?>" type="text"></td>
									</tr>
									
									<tr>
										<th>Jobs</th>
										<td><input name="features[jobs][listing]" value="<?php echo $features['jobs']['listing']?>" type="text"></td>
										<td><input name="features[jobs][images]" value="<?php echo $features['jobs']['images']?>" type="text"></td>
										<td><input name="features[jobs][videos]" value="<?php echo $features['jobs']['videos']?>" type="text"></td>
									</tr>
									
									<tr>
										<th>Classifieds</th>
										<td><input name="features[classified][listing]" value="<?php echo $features['classified']['listing']?>" type="text"></td>
										<td><input name="features[classified][images]" value="<?php echo $features['classified']['images']?>" type="text"></td>
										<td><input name="features[classified][videos]" value="<?php echo $features['classified']['videos']?>" type="text"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>				
				</div>
				<!-- /.box-body -->
				<div class="box-footer">
					<button type="submit" class="btn btn-info pull-right">Save</button>
				</div>
				<!-- /.box-footer -->
			{!! Form::close() !!}
		</div>
		<!-- /.box -->
	</div>
</div>
<div class="clearfix"></div>
@stop