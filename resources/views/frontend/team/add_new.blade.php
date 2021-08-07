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
			   {!! Form::open(array('class' => 'form-horizontal', 'files' => 'true', 'url' => '/account/team-members/add')) !!}

			   <div class="form-group">
					<label class="col-sm-2 control-label" for="title">Member Name: </label>
					<div class="col-sm-10">
						<input type="text" class="form-control" name="member_name" id="member_name">
					</div>
				</div>
				
				 <div class="form-group">
					<label class="col-sm-2 control-label" for="content">Upload Photo</label>
					<div class="col-sm-10">
						<input type="file" class="form-control" name="upload_photo" id="upload_photo">
					</div>
				</div>
				
				<div class="form-group">
					<label class="col-sm-2 control-label" for="title">Designation: </label>
					<div class="col-sm-10">
						<input type="text" class="form-control" name="designation" id="designation">
					</div>
				</div>
				
				<div class="form-group">
					<label class="col-sm-2 control-label" for="title">About: </label>
					<div class="col-sm-10">
						<textarea name="about" id="about" class="form-control"></textarea>
					</div>
				</div>
				
				<button id="btn_save_team_mem" type="submit" class="col-md-offset-2 btn btn-primary">Add</button>
                {!! Form::close()!!}
               </div>
        </div> <!-- end col-sm-10 -->
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
