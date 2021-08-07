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
                     <div class="col-sm-12">
					 @if(Session::has('message'))
						<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
					@endif
							
        
        @if(count(Auth::user()->ReviewTo))
<div class="home_review">
    <div class="rev_title">
        <section class="container">
           <h1>Recieved Reviews</h1>
        </section>
    </div>
    <section class="container">
        <div class="latest_review">
            <div class="row">
                @foreach(Auth::user()->ReviewTo as $index => $reviews)
                <div class="col-md-6 col-sm-12 user_latest_reviews" @if($index > 1) style="display:none;" @endif>
                    <div class="row">
                        <div class="col-md-3 col-sm-3 col-xs-12 text-sm-center">
                            @if($reviews->UserFrom->profilepic)
                            <figure>
                                <a href="{{ URL::to('/') }}/{{ 'profile?id='.$reviews->UserFrom->id}}">
                                    @if(File::exists(public_path().$reviews->UserFrom->profilepic['path'].'thumb_small_'.$reviews->UserFrom->profilepic['name']))
                                        <img src="{{$reviews->UserFrom->profilepic['path'].'thumb_small_'.$reviews->UserFrom->profilepic['name']}}" alt="" width="118" height="117" class="img-circle center-block" />
                                    @else
                                        <img src="images/user_pic.jpg" alt="" class="img-responsive img-circle center-block" />
                                    @endif
                                </a>
                            </figure>
                        @else
                            <figure>
                                <a href="{{ URL::to('/') }}/{{ 'profile?id='.$reviews->UserFrom->id}}">
                                    <img src="images/user_pic.jpg" alt="" class="img-responsive img-circle center-block" />
                                </a>
                            </figure>
                            @endif
                            <div class="review_post text-md-center">
                                <h2>{{ $reviews->UserFrom->name }}</h2>
                                <!--<span>{{ count($reviews->UserFrom->ReviewTo) }} Reviews</span>
                                <span>{{ $reviews->UserFrom->roles[0]->name }}</span>-->
                            </div>
                        </div>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                            <span>{{date('M d Y',strtotime($reviews->created_at))}}</span>
                            <span class="review_rating" ng-init="rate{{$index}} = {{ $reviews->rating }}">
                                <uib-rating ng-model="rate{{$index}}" max="5" readonly="true"  titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating"></uib-rating>
                            </span>
                            <p>
                            @if(strlen($reviews->review_comment) >350)
                                {{  substr($reviews->review_comment,0,350).'...' }}
                            @else
                                {{ $reviews->review_comment }}
                            @endif
                            </p>
                            <div class="reply_on_comment"> 
                            <form>

                            <textarea class="form-control" row="4"></textarea>
                                
                            <button type="submit">Submit</button>

                            </form>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
                @if(count(Auth::user()->ReviewTo) > 2)
                <div class="rev_more"> <a id="load_more" href="#" class="">More</a></div>
                @endif
            </div>
        </div>
        <!--latest_rev-->
    </section>
</div>
@endif

     
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
