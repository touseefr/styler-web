@extends ('backend.layouts.master') @section ('title', 'Video Management') @section('page-header')
<h1>Video Management</h1>
@stop @section('content')

@if(Session::has('message'))
	<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
@endif

@section ('breadcrumbs')
    <li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
    <li class="active">Video Management</li>
@stop

<div class="row">
	<div class="col-xs-12">
		<div class="box box-default">
			<!-- form start -->
			<form name="video_upload" class="form-horizontal" action="" method="post" enctype="multipart/form-data">
				<input type="hidden" name="_token" value="{{csrf_token()}}"/>
				<div class="box-body">
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-2">Video</label>
						<div class="col-sm-5">
							<input name="video" class="form-control" id="video" type="text" value="<?php echo Settings::get('video');?>" required/>
						</div>
						<div class="col-sm-5"></div>
					</div>						
				</div>
				<!-- /.box-body -->
				<div class="box-footer">
					<button type="submit" class="btn btn-info pull-right">Save</button>
				</div>
				<?php 
						if(Settings::get('video')){
							echo '<iframe width="420" height="315" src="'.Settings::get('video').'"></iframe>';
						}
				?>
				
				<!-- /.box-footer -->
			</form>
		</div>
		<!-- /.box -->
	</div>
</div>
<div class="clearfix"></div>
@stop