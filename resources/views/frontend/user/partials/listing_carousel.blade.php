<!--<div class="col-md-12">
    <div class="carousel_container"> 
        <div class="carousel_slides account_listing deal_veiw_slider">
		<slick dots="false" infinite="false" speed=300 slides-to-show=4 touch-move="false" slides-to-scroll=1 class="slider one-time" responsive="[{breakpoint: 990, settings: {slidesToShow: 3}}, {breakpoint: 768,settings: {slidesToShow: 2}}, {breakpoint: 480,settings: {slidesToShow: 1}}]">
			@foreach(Auth::user()->listing as $listing)
				@if($listing->type != 'gallery' && $listing->type != 'business')
				<div class="slide col-md-3 col-sm-3 col-md-3 col-xs-12">
					@if($listing->type == 'job')
						{{-- <h6>
						<i><img src="images/job_title.jpg" alt="job" /></i>
						<i><img src="images/jobs_ico.png" alt="job" /></i>
						<a href="jobs?id={{ $listing->id }}">{{ $listing->title }}</a>
						</h6> --}}
						<figure>
						<a href="jobs?id={{ $listing->id }}">
						@if(count($listing->assets))
						<img src="{{$listing->assets[0]['path'].'thumb_small_'.$listing->assets[0]['name']}}" alt="" />
						@else
						<img src="images/jobpic1.jpg" alt="" />	
						@endif
						</a>
					</figure>
					@elseif($listing->type == 'classified')
						{{-- <h6>
						<i><img src="images/title_one.jpg" alt="Classified"/></i>-->
						<i><img src="images/news_ico.png" alt="Classified"/></i>
						<a href="classifieds?id={{ $listing->id }}">{{ $listing->title }}</a>
						</h6> --}}
						<figure>
						<a href="classifieds?id={{ $listing->id }}">
						@if(count($listing->assets))
						<img src="{{$listing->assets[0]['path'].'thumb_small_'.$listing->assets[0]['name']}}" alt="" />
						@else
						<img src="images/jobpic1.jpg" alt="" />	
						@endif
						</a>
					</figure>
					@elseif($listing->type == 'deal')
						{{-- <h6>
						<i>	<img src="images/deal_ico.png"  alt="Deal" /></i>
						<a href="deals?id={{ $listing->id }}">{{ $listing->title }}</a>
						</h6> --}}
						<figure>
						<a href="deals?id={{ $listing->id }}">
						@if(count($listing->assets))
						<img src="{{$listing->assets[0]['path'].'thumb_small_'.$listing->assets[0]['name']}}" alt="" />
						@else
						<img src="images/jobpic1.jpg" alt="" />	
						@endif
						</a>
					</figure>
					@elseif($listing->type == 'businessforsale')
					{{-- <h6>
						<i><img src="images/blub_ico.png"  alt="businessforsale" /></i>
						<a href="business?id={{ $listing->id }}">{{ $listing->title }}</a>
						</h6> --}}
						<figure>
						<a href="business?id={{ $listing->id }}">
						@if(count($listing->assets))
						<img src="{{$listing->assets[0]['path'].'thumb_small_'.$listing->assets[0]['name']}}" alt="" />
						@else
						<img src="images/jobpic1.jpg" alt="" />	
						@endif
						</a>
					</figure>
					@endif
					<div class="date_time">
						<span class="date date_1"><i class="fa fa-calendar"></i> {{date('Y-m-d',strtotime($listing->created_at))}}</span>
			!--<span class="time">{{ $listing->views }}</sp-->
					</div>
				</div>
				@endif
			@endforeach
          </slick>
        </div>
    </div>
 <!--carousel_contai-->
</div>
