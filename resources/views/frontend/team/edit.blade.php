@extends('frontend.layouts.account') @section('content')
<section class="container animated fadeIn">
     @include('frontend.includes.sub_header')
</section>
<div class="clear"></div>
<section class="bg_gray border_top login_container">
    <div class="container">
        <div class="row" style="padding-top: 80px;padding-bottom: 80px;">
            <div class="col-md-12">
                <div class="row">
                     <div class="col-sm-10 col-sm-offset-1">
					 @if(Session::has('message'))
						<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
					@endif
				<div class="add-new-team-member text-right">	
					<a href="{{url('account/team-members')}}" class="btn btn-primary">Back</a>
				</div>				
    <div class="col-md-12">
			   <form method="POST" action="{{url('account/team-members/edit')}}/{{$team->id}}" accept-charset="UTF-8" class="form-horizontal ng-pristine ng-valid" enctype="multipart/form-data">
			   
			   <input name="_token" value="{{csrf_token()}}" type="hidden"/>

			   <div class="form-group">
					<label class="col-sm-2 control-label" for="title">Member Name: </label>
					<div class="col-sm-10">
						<input type="text" class="form-control" value="{{$team->member_name}}" name="member_name" id="member_name">
					</div>
				</div>
				
				 <div class="form-group">
					<label class="col-sm-2 control-label" for="content">Upload Photo</label>
					<div class="col-sm-10">
						<input type="file" class="form-control" name="upload_photo" id="upload_photo">
						@if($team->image_id)
							<?php 
									$media_url = App\Media::get_media($team->image_id, 'small');
							?>
							<img src="{{$media_url}}"/>
						@endif
						
						
					</div>
				</div>
				
				<div class="form-group">
					<label class="col-sm-2 control-label" for="title">Designation: </label>
					<div class="col-sm-10">
						<input type="text" class="form-control" value="{{$team->designation}}" name="designation" id="designation">
					</div>
				</div>
				
				<div class="form-group">
					<label class="col-sm-2 control-label" for="title">About: </label>
					<div class="col-sm-10">
						<textarea name="about" id="about" class="form-control">{{$team->about}}</textarea>
					</div>
				</div>
				
				<button id="btn_update_team_mem" type="submit" class="col-md-offset-2 btn btn-primary">Update</button>
                </form>
               </div>
        </div> <!-- end col-sm-10 -->
                </div>
            </div>
        </div>
    </div>
</section>
@endsection