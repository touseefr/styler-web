@extends('frontend.layouts.account') @section('content')

     @include('frontend.includes.hearderportion')

<div class="clear"></div>
<section class="border_top login_container single-team-container">
    <div class="container">
        <div class="row" style="padding:30px 0;">
            <div class="col-md-4">

            	<?php
                            $assetinfo = \DB::table('assets')->where(array('id' => $team->image_id))->get();
                            if (!empty($assetinfo)) {
                            $assetinfo = $assetinfo[0];
                            $profile_pic = $assetinfo->path . $assetinfo->name;
                            } else {
                            $profile_pic = 'images/user_pic.jpg';
                            }
                            ?>
            	<img class="img-thumbnail" src="{{$profile_pic}}">
            	<center>
            		<ul class="team-social-icons social-icons" style="color: black">
		              <li><a href="" class="social-icon"> <i class="fa fa-facebook"></i></a></li>
		              <li><a href="" class="social-icon"> <i class="fa fa-twitter"></i></a></li>
		              <li><a href="" class="social-icon"> <i class="fa fa-rss"></i></a></li>
		              <li><a href="" class="social-icon"> <i class="fa fa-youtube"></i></a></li>
		              <li><a href="" class="social-icon"> <i class="fa fa-linkedin"></i></a></li>
		              <li><a href="" class="social-icon"> <i class="fa fa-google-plus"></i></a></li>
				  </ul>
			  </center>
            </div>
            <div class="col-md-8">
            	<h1>{{$team->member_name}}</h1>
            	<h2>{{$team->designation}}</h2>
            	<p><?php echo nl2br($team->about); ?></p>
            </div>
        </div>
    </div>
</section>
@endsection
