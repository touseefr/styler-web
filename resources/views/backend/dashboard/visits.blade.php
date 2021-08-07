@extends('backend.layouts.master') 

@section('page-header')
<h1>
    {{ trans('strings.backend.dashboard_title') }}
</h1>
@endsection @section('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">
        <i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{{ trans('strings.here') }}</li>
@endsection @section('content')

<!-- Info boxes -->
<?php 
		
		/* $limit = Settings::get('pagination_limit');
		$set = (isset($_GET['set'])) ? $_GET['set'] : 1;
		$offset = App\User::get_offset($limit, $set);
		$targetset = url('admin/dashboard/visits');
		$visits_limited = DB::select("select * from site_views order by id desc limit {$offset}, {$limit}"); */
		$visits_all = DB::select("select * from site_views order by id desc");
		//$total_records = count($visits_all);
?>
<div class="row">
			<div class="col-xs-12">
				<div class="box">
					
					<!-- /.box-header -->
					<div class="box-body">
					
						<table id="example1" class="table table-bordered table-striped">
						
							<thead>
								<tr>
                                                                    <th style="display: none;">ID</th>
									<th>IP Address</th>
									<th>Country</th>
									<th>User</th>
									<th>Device</th>
									<th>Browser</th>
									<th>Referer</th>
				
									<th>Last Activity</th>
								</tr>
							</thead>
							<tbody>
									@foreach($visits_all as $visit)
										<?php
											if($visit->user_id){
												$name = App\User::find($visit->user_id)['name'];
											}
											else{
												$name = 'Guest';
											}	
										?>
										<tr>
											<td style="display: none;">{{$visit->id}}</td>
											<td>{{$visit->ip_address}}</td>
											<td>{{$visit->country}}</td>
											<td>{{$name}}</td>
											<td>{{App\User::getOS($visit->http_user_agent)}}</td>
											<td>{{App\User::getBrowser($visit->http_user_agent)}}</td>
											<td>{{$visit->http_referer}}</td>
							
											<td>{{date('d/m/Y', strtotime($visit->created_at))}}</td>
										</tr>
									@endforeach
									
							
							</tbody>
						</table>
						<center>
								<?php 
										//echo App\User::pagination($targetset, $total_records, $limit, $set);
								?>
						</center>
					</div>
					<!-- /.box-body -->
				</div>
				<!-- /.box -->
			</div>
			<!-- /.col -->
		</div>


<!-- /.row -->
@endsection
