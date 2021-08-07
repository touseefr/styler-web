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
					<a href="{{url('account/team-members/add')}}" class="btn btn-primary">Add New Member</a>
					<a href="{{url('account')}}" class="btn btn-primary">Back</a>
				</div>	
									
         <table class="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th>Sr No.</th>
                    <th>Member Name</th> 
                    <th>Photo</th> 
                    <th>Designation</th>
                    <th>About</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            @foreach($team_members as $member)
            <?php 
                    $media_url = App\Media::get_media($member->image_id, 'small');
            ?>
                <tr>	
                        <td>{{$member->id}}</td>
                        <td>{{$member->member_name}}</td>
                        <td><img width="40" src="{{$media_url}}"/></td>
                        <td>{{$member->designation}}</td>
                        <td>{{App\Review::getExcerpt($member->about)}}</td>
                        <td>
                                <a href="{{url('account/team-members/edit')}}/{{$member->id}}" class="btn btn-xs btn-primary"><i class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"></i></a>
                                
                                <a onclick="return confirm('Are you sure you want to delete this member?')" href="team-members/delete/{{$member->id}}" class="btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i></a>
                        </td>
                </tr>
            @endforeach
                            
            </tbody>
        </table>
        </div> <!-- end col-sm-10 -->
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
