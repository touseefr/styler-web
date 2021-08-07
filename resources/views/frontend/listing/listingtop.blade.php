<style>
    .angular-google-map-container {
        height: 400px !important;
    }
</style>
<?php
$myfile = (isset($item->assets[0]['path']) ? $item->assets[0]['path'] : '') . (isset($item->assets[0]['name']) ? $item->assets[0]['name'] : '');
if (File::exists(public_path() . $myfile)) {
    $file_path = url('/') . $myfile;
} else {
    $file_path = url("new_assets/images/banner-bg.png");
}
?>
@section('twitter')
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="{{ $item -> title}}" />
<meta name="twitter:description" content="{{ substr($item -> description, 0, 100).'...'}}" />
<meta name="twitter:image" content="{{$file_path}}" />
@endsection

@section('facebook')
<meta property="og:url" content="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
      />
<meta property="og:type" content="article" />
<meta property="og:title" content="{{ $item -> title}}" />
<meta property="og:description" content="{{ substr($item -> description, 0, 100).'...'}}" />
<?php
$myfile = (isset($item->assets[0]['path']) ? $item->assets[0]['path'] : '') . (isset($item->assets[0]['name']) ? $item->assets[0]['name'] : '');
if (File::exists(public_path() . $myfile)) {
    $file_path = url('/') . $myfile;
} else {
    $file_path = url("new_assets/images/banner-bg.png");
}
?>
<meta property="og:image" content="{{$file_path}}" />
<meta property="fb:app_id" content="<?php echo env('FACEBOOK_CLIENT_ID'); ?>" />
@endsection



<section class="bg_gray border_top" style="padding-bottom: 35px;padding-top: 50px;">

    <div class="image-gallary-wrap">
        @if($item->type == 'job')
        @include('frontend.listing.photos', array('item' =>(object) $item))
        <?php $item = (object) $item; ?> @else
        @include('frontend.listing.photos', array('item' => $item)) @endif
    </div>
    <div class="container">        
        <div class="row">

            @if($item->type == 'deal'&& $item->user->roles[0]->name=="SchoolCollege")
            <div class="col-md-8 col-xs-12">
                <div class="row">
                    <div class="col-md-12">                                                                       
                        <div class='clearifx mt-25'>
                            <div class="pull-left mb-20">
                                <h4 class="title_h4 mb-10">{{ $item -> title}}</h4>
                                <div class="socialShareable clearfix">
                                    <span>Share this</span>
                                    <ul class="social_links">
                                        <li>
                                            <a href="#" socialshare socialshare-provider="facebook" socialshare-text="{{ $item -> title}}" socialshare-description="{{ substr($item -> description, 0, 100).'...'}}"
                                               socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                               socialshare-type="feed" socialshare-via="696604057079970" -@if(isset($item->assets[0]))
                                               socialshare-media="{{ url('/').(isset($item -> assets[0] -> path)? $item -> assets[0] -> path : $item -> assets[0]['path'])}}{{isset($item -> assets[0] -> name)?$item -> assets[0] -> name:$item -> assets[0]['name']}}"
                                               @endif class="facebook">
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" socialshare socialshare-provider="twitter" socialshare-text="{{ $item -> title}}" socialshare-hashtags="{{ $item -> title}}"
                                           socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                           socialshare-media="" class="twitter">
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" socialshare socialshare-provider="linkedin" socialshare-text="{{ $item -> title}} " socialshare-description="{{ substr($item -> description, 0, 200).'...'}}"
                                           socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                           class="in_icon">
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <!-- @if($item->type != 'job')
                            <span class="pull-left">{{ \Carbon\Carbon::createFromTimeStamp(strtotime($item->created_at))->diffForHumans() }}</span>         
                              @if(isset($item->locations[0]))
                              <span class="pull-left">{{ $item -> locations[0] -> name}},{{ $item -> locations[0] -> state}}</span>                                            
                              @endif 
                            @endif -->
                        </div>
                        <div class="listing-features pull-right">
                            @if($item->type != 'job')
                            <span class="listing-feature-icon">
                                <img src="images/money-bag-24.png" alt="Price" title="Price">
                                <span class="amount">
                                    @if($item->type == 'deal')                                   
                                    <span  style="text-decoration: line-through;font-size: 15px;" class="text-muted">{{$item -> price}}</span>                                        @if(!empty($item->price)) ${{ ($item -> price - $item -> discount)}} @else POA @endif
                                    @else @if(!empty($item->price)) ${{ $item -> price}} @else POA @endif @endif

                                </span>
                                <span class="copy">
                                    Price
                                </span>
                            </span>
                            @endif
                            <span class="listing-feature-icon">
                                <div class="below_image_bar_small_text">
                                    <span>Views:{{count($item -> listingViews)}}</span><br>
                                    <span>Watchlist: {{count($item -> listingWatch)}}</span>
                                </div>
                            </span>                                    
                        </div>
                    </div>
                    <div class="clearfix"></div>                        
                </div>

                <div class="col-md-12">                         
                    <div class="clearfix"></div>
                    <div class="disc-block-wrap">
                        <div class="pt-15 mb-20">                                    
                            <div class="disc-block mt-15" style="overflow: auto ;padding-bottom: 10px;">
                                <h4 class="paragraph-padding">Summary</h4>
                                <hr class="mt-5 mb-5">
                                @if($item->type == 'job')                                    
                                <p class="paragraph-padding"><?php echo html_entity_decode($item->job_summary); ?></p>
                                <h4 class="paragraph-padding">Description</h4>
                                @endif
                                <?php echo $item->description; ?>
                                @if(isset($item->listing_meta))
                                <br><br>

                                <ul>
                                    @foreach($item->listing_meta as $key => $value)

                                    <?php $key = str_replace('_', " ", $key);
                                    ?> @if(is_object($value))
                                    <li>
                                        {{$key}} :
                                        <ul>
                                            @foreach($value as $sub_key => $sub_value)
                                            <?php $sub_value = str_replace('true', "Yes", $sub_value); ?>
                                            <?php $sub_value = str_replace('false', "No", $sub_value); ?>
                                            <li>{{$sub_key}}: {{$sub_value}}</li>
                                            @endforeach
                                        </ul>
                                    </li>
                                    @else @endif @endforeach
                                </ul>
                                @endif
                            </div>

                        </div>
                    </div>                       

                </div>
                <div class="col-md-12">
                    @if($item->type == 'deal'&& $item->user->roles[0]->name=="SchoolCollege")
                    <ul class="sc-features">
                        <?php
                        $deliver_mode = array("Face To Face", "Online");
                        $intake = array("Weekly", "Monthly", "Six Month", "Yearly");
                        $course_type = array("Domestic", "International", "Domestic, International");
                        ?>
                        @if(strlen($item->sc_deal_delivery_mode)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fas fa-shipping-fast"></i></span>
                            <span class="timings">
                                <span class="title">Deliver Mode</span>
                                <small class="status">{{$deliver_mode[$item -> sc_deal_delivery_mode]}}</small>
                            </span>
                        </li>
                        @endif
                        @if(strlen($item->sc_deal_intakes)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fas fa-infinity"></i></span>
                            <span class="timings">
                                <span class="title">Intake</span>
                                <small class="status">{{$intake[$item -> sc_deal_intakes]}}</small>
                            </span>
                        </li>
                        @endif
                        @if(strlen($item->sc_deal_prerequisite)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fa fa-check-square-o"></i></span>
                            <span class="timings">
                                <span class="title">Prerequisite</span>
                                <small class="status">{{$item -> sc_deal_prerequisite}}</small>
                        </li>
                        @endif
                        @if(strlen($item->sc_deal_assessment)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fa fa-th-list"></i></span>
                            <span class="timings">
                                <span class="title">Assessment Mode</span>
                                <small class="status">{{$item -> sc_deal_assessment}}</small>
                            </span>
                        </li>
                        @endif
                        @if(strlen($item->sc_deal_requirements)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fa fa-edit"></i></span>
                            <span class="timings">
                                <span class="title">Entry Requirement</span>
                                <small class="status">{{$item -> sc_deal_requirements}}</small>
                            </span>
                        </li>
                        @endif
                        @if(strlen($item->sc_deal_duration)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fa fa-clock-o"></i></span>
                            <span class="timings">
                                <span class="title">Duration</span>
                                <small class="status">{{$item -> sc_deal_duration}}</small>
                            </span>
                        </li>
                        @endif
                        @if(strlen($item->sc_deal_enrolment)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fa fa-hashtag"></i></span>
                            <span class="timings">
                                <span class="title">Enrollment</span>
                                <small class="status">{{$item -> sc_deal_enrolment}}</small>
                            </span>
                        </li>
                        @endif
                        @if(strlen($item->sc_deal_course_type)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fa fa-pencil"></i></span>
                            <span class="timings">
                                <span class="title">Type</span>
                                <small class="status">{{$course_type[$item -> sc_deal_course_type]}}</small>
                            </span>
                        </li>
                        @endif
                        @if(strlen($item->sc_deal_total_tuition_hours)>0)
                        <li class="col-xs-12 col-sm-6 col-md-4">
                            <span class="icon"><i class="fas fa-user-clock"></i></span>
                            <span class="timings">
                                <span class="title">Tuition Hours</span>
                                <small class="status">{{$item -> sc_deal_total_tuition_hours}}</small>
                            </span>
                        </li>
                        @endif


                    </ul>

                    @endif
                </div>

            </div>
        </div>
        <div class=" col-md-4 col-xs-12">
            <div class="profile-info-box">
                <div class="avatar-round">

                    @if($item->user->profilepic) @if(File::exists(public_path().$item->user->profilepic['path'].'thumb_small_'.$item->user->profilepic['name']))
                    <img src="{{$item -> user -> profilepic['path'].'thumb_small_'.$item -> user -> profilepic['name']}}" />                                @else
                    <img src="images/user_pic.jpg" /> @endif @else
                    <img src="images/user_pic.jpg"> @endif
                </div>

                <div class="inner-wrap text-center">
                    <a href="profile?id={{base64_encode($item -> user -> id)}}" class="service listing_business_area" style="margin-bottom:0px !important;">{{ isset($item -> user -> UserBusiness -> business_name)?$item -> user -> UserBusiness -> business_name:''}}</a>         
                    @if(isset($item->user->UserBusiness->business_email))
                    <div class="profile-stars mt-10px-imp" ng-init="rate = {{$item -> user -> rating}}" style="margin-top:0px !important;">
                        <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating font-size-rating"></uib-rating>
                    </div>
                    <div class="btn-contact-call" style="border-radius: 4px;">
                        <img src="images/contact-20.png" alt="Contact" title="Contact"> {{ $item -> contact}}
                    </div>
                    <div class="mt-10">
                        <?php echo isset($item->user->UserBusiness->about) ? substr($item->user->UserBusiness->about, 0, 180) . '..' : ''; ?>
                    </div>



                    @include('frontend.listing.emaildialog', array('item' => $item)) @endif @if($item->type == 'classified' || $item->type ==
                    'deal') @if(Auth::check())

                    <div class="btn btn-contact-email" ng-controller="BusinessNewController">
                        <a href="javascript:void(0)" ng-click="ReportBusiness('<?php echo $item->type ?>', '<?php echo $item->title ?>', '<?php echo $item->id ?>')"
                           title="Eamil">
                            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                            Report <?php echo $item->type ?></a>
                    </div>

                    @endif @endif


                    <div class="payment-accept">
                        @if(!empty($payment_mode))
                        <span>Payment Accepted</span>
                        <ul class="payment_accepted payment-mode">
                            @foreach($payment_mode as $key => $val)
                            <li>
                                {{-- <i class="fas fa-money-check"></i>  --}}
                                <i class="far fa-money-bill-alt"></i>
                                Cash
                            </li>
                            @endforeach
                        </ul>
                        @endif
                    </div>

                </div>
                @if($item->type == 'deal') @if((Auth::check()) && (Auth::user()->roles[0]->name=='Distributor' || Auth::user()->roles[0]->name=='SchoolCollege'))
                <div class="btn_book">
                    <button id="btn-deal-book-now-other" class="btn_book_now" auth-status="{{(Auth::check())?1:0}}">Redeem</button>
                </div>
                @else
                <div class="btn_book">
                    <button id="btn-deal-book-now" class="btn_book_now" auth-status="{{(Auth::check())?1:0}}">Book Now</button>
                    <button id="btn-book-later" class="btn_book_later" auth-status="{{(Auth::check())?1:0}}">Book Later</button>
                </div>
                @endif @endif

            </div>
            @if($item->type == 'deal'&& $item->user->roles[0]->name=="SchoolCollege")
            <div class="googleMap">
                <?php
                $location = json_encode(
                        [
                            'latitude' => $item->latitude,
                            'longitude' => $item->longitude,
                            'state' => $item->state,
                            'name' => '',
                            'postcode' => $item->postcode,
                            'zoom' => '.5'
                        ]
                );
                ?>
                <location-map location-info="{{ $location}}"></location-map>
            </div>
            @endif
        </div>
        @endif
        <div class="cleafix"></div>
        @if($item->user->roles[0]->name!="SchoolCollege")
        <div class="{{($item->type == 'deal'&& $item->user->roles[0]->name=='SchoolCollege')?'col-md-8 new-one':'col-md-8 new-one'}}">
            <div class="listing-features-wrap-small">
                <div class="row">
                    @if($item->type == 'job')
                    <div class="col-md-12">
                        @else
                        <div class="col-md-8 col-xs-12">
                            @endif 
                            @if($item->type == 'job' && Auth::check() && Auth::user()->roles[0]->name=='JobSeeker')
                            <div class="clearfix mb-10">
                                <div class="pull-left">                                    
                                    <h4 class="title_h4">{{ $item -> title}}</h4>

                                    @if($item->type == 'job')
                                    <p class="pt-15"><i class="fa fa-map-marker"></i> {{$item -> suburb}} -{{$item -> state}} -{{$item -> postcode}}</p>
                                    @endif 
                                </div>
                                <div class="pull-right">
                                    @if(Auth::check() && Auth::user()->roles[0]->name=='JobSeeker' && $item->user_id!=Auth::user()->id && $item->user_id!=Auth::user()->id)
                                    <div id="job_shortlist_btn1" class="mr-10 d-inlineB">
                                        <shortlist-job class="btn btn-sm btn-primary" id="{{$item -> id}}" title="Shortlist This Job">Shortlist
                                        </shortlist-job>
                                    </div>
                                    @endif
                                    @if(isset(Auth::user()->id) && $item->user_id!=Auth::user()->id)
                                    <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#applyjobModal" id="applyjobModaltext" @if($applied == 1) disabled @endif
                                    >
                                        @if($applied == 1)
                                        Applied
                                        @else
                                        Apply Now
                                        @endif
                                    </button>                                                
                                    @endif
                                </div>
                            </div>
                            <div class="clearfix">
                                <div class="mr-10 d-inlineB">
                                    <span class="m-0">{{ \Carbon\Carbon::createFromTimeStamp(strtotime($item->created_at))->diffForHumans() }}</span>                                                @if(isset($item->locations[0]))
                                    <span class="m-0">{{ $item -> locations[0] -> name}},{{ $item -> locations[0] -> state}}</span>                                                @endif
                                </div>
                                &verbar;
                                <div class="d-inlineB below_image_bar_small_text ml-20">
                                    <span class="m-0"><strong>Salary:</strong> </span>
                                    <span class="m-0">${{ $item -> expected_salary}}</span>                                            &verbar;
                                    <span class="ml-10"><strong>Apply Before:</strong> {{ date('m-d-Y', strtotime($item -> expiry))}}</span>
                                </div>
                                &verbar;
                                <div class="d-inlineB below_image_bar_small_text ml-20">
                                    <span class="m-0"><strong>Views:</strong> {{count($item -> listingViews)}}</span>                                                &verbar;
                                    <span class="m-0"><strong>Watchlist:</strong> {{count($item -> listingWatch)}}</span>
                                </div>
                            </div>
                            @else
                            <h4 class="title_h4 mb-10">{{ $item -> title}}</h4>
                            <div class="socialShareable clearfix">
                                <span>Share this</span>
                                <ul class="social_links">
                                    <li>
                                        <a href="#" socialshare socialshare-provider="facebook" socialshare-text="{{ $item -> title}}" socialshare-description="{{ substr($item -> description, 0, 100).'...'}}"
                                           socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                           socialshare-type="feed" socialshare-via="696604057079970" -@if(isset($item->assets[0]))
                                           socialshare-media="{{ url('/').(isset($item -> assets[0] -> path)? $item -> assets[0] -> path : $item -> assets[0]['path'])}}{{isset($item -> assets[0] -> name)?$item -> assets[0] -> name:$item -> assets[0]['name']}}"
                                           @endif class="facebook">
                                    </a>
                                </li>
                                <li>
                                    <a href="#" socialshare socialshare-provider="twitter" socialshare-text="{{ $item -> title}}" socialshare-hashtags="{{ $item -> title}}"
                                       socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                       socialshare-media="" class="twitter">
                                    </a>
                                </li>
                                <li>
                                    <a href="#" socialshare socialshare-provider="linkedin" socialshare-text="{{ $item -> title}} " socialshare-description="{{ substr($item -> description, 0, 200).'...'}}"
                                       socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                       class="in_icon">
                                    </a>
                                </li>
                                <!--                                <li><a href="#" class="wifi"></a></li>-->
                            </ul>
                        </div>

                        @if($item->type == 'job')
                        <p ><i class="fa fa-map-marker"></i> {{$item -> suburb}} -{{$item -> state}} -{{$item -> postcode}}</p>
                        @endif 
                        @endif

                        <div class='clearifx'>
                            @if($item->type != 'job')

                            @if(isset($item->locations[0]))
                            <span class="pull-left">{{ $item -> locations[0] -> name}},{{ $item -> locations[0] -> state}}</span>                                            
                            @endif
                            @endif
                            @if($item->type == 'job')
                            <div class="pull-right">
                                @if($item->type != 'job')
                                <span class="listing-feature-icon-job pull-right" style='border-left:none;'>
                                    <div class="below_image_bar_small_text">
                                        <span>Views:{{count($item -> listingViews)}}</span>
                                        <span>Watchlist: {{count($item -> listingWatch)}}</span>
                                    </div>
                                </span>
                                @endif
                            </div>
                            @endif

                        </div>
                    </div>
                    @if($item->type == 'job')
                    <div class="col-md-12 col-xs-12 listing-features">
                        @else
                        <div class="listing-features">
                            @endif @if($item->type != 'job')
                            <span class="listing-feature-icon">                                 
                                <img src="images/money-bag-24.png" alt="Price" title="Price">
                                <span class="amount">
                                    @if($item->type == 'deal')
                                    <span  style="text-decoration: line-through;font-size: 15px;{{((int)$item -> discount == 0)?'display:none;':''}}"class="text-muted">{{$item -> price}}</span>                                        @if(!empty($item->price)) ${{ ($item -> price - $item -> discount)}} @else POA @endif
                                    @else @if(!empty($item->price)) ${{ $item -> price}} @else POA @endif @endif
                                </span>
                                <span class="copy">
                                    Price
                                </span>
                            </span>
                            @endif
                            <!--{{-- @endif --}}-->
                            @if($item->type == 'classified')                            

                            @endif
                            @if($item->type == 'job') @else
                            <span class="listing-feature-icon">
                                <div class="below_image_bar_small_text">
                                    <span>Views:{{count($item -> listingViews)}}</span><br>
                                    <span>Watchlist: {{count($item -> listingWatch)}}</span>
                                </div>
                            </span>
                            @endif
                        </div>

                    </div>
                </div>              
                @if($item->type == 'job')    
                <?php
                $visa_type = array(1 => "Australian citizen", 2 => "Australian/NZ residents", 3 => "Working and Holiday visa", 4 => "Student visa");
                ?>
                <br />
                <div class="disc-block-wrap">
                    <div class="pt-15">
                        <div class="disc-block trix-content">
                            @if($item->visa_id)   
                            <div class="col-md-6 job-right-protion">
                                <b>Job Visa:</b> <span>{{$visa_type[$item -> visa_id]}}</span>
                            </div>
                            @endif
                            @if($item->expected_salary)                               
                            <div class="col-md-6 job-right-protion">
                                <b>Expected Salary:</b> 
                                @if($item->expected_salary)
                                <span>${{$item ->expected_salary}}</span>
                                @endif
                            </div>
                            @endif
                            @if(isset($item -> business_feature_stock) )
                            <div class="col-md-6 job-right-protion" >
                                @if(isset(json_decode($item -> business_feature_stock) ->name))
                                <b>Industry:</b> <span>{{json_decode($item -> business_feature_stock) ->name}}</span>
                                @else
                                <b>Industry:</b> <span>Jobs</span>
                                @endif
                            </div>       
                            @endif
                            @if(isset($item->categories[0]->name) && $item->categories[0]->name)
                            <div class="col-md-6 job-right-protion" >
                                <b> Role:</b> <span>{{$item -> categories[0] -> name}}</span>
                            </div>             
                            @endif
                            @if($item->post_title)
                            <div class="col-md-6 job-right-protion">                               
                                <b>Job Type:</b> <span>{{json_decode($item -> post_title) -> name}}</span>
                            </div>
                            @endif
                            @if($item->gender_require)
                            <div class="col-md-6 job-right-protion">

                                <b>Gender:</b> <span style="text-transform: capitalize;">{{($item -> gender_require=='noprefrence')?'No Prefrence':$item -> gender_require}}</span>
                            </div>
                            @endif

                        </div>
                    </div>
                </div>
                @endif

                <div class="disc-block-wrap">
                    <div class="pt-15 mb-20">

                        <div class="disc-block trix-content" style="min-height: 245px; overflow: auto ;padding-bottom: 10px;">
                            @if($item->type == 'job')    
                            <br />
                            <h4 class="paragraph-padding">Summary</h4>
                            <hr class="mt-5 mb-5 hr-color">
                            <?php echo $item->job_summary; ?>
                            <br />
                            <h4 class="paragraph-padding">Description</h4>
                            <hr class="mt-5 mb-5 hr-color">
                            @endif
                            @if($item->type != 'job')                                    
                            <h4 class="paragraph-padding">Description</h4>
                            <hr class="mt-5 mb-5 hr-color">
                            @endif
                            <div> 
                                <?php echo html_entity_decode($item->description); ?>
                            </div>    
                            @if($item->type == 'deal' && $item->user->roles[0]->name!="SchoolCollege" )

                            @if(count($item->listingMeta)>0)
                            <div class="deal_fine_print">
                                <h4 class="paragraph-padding">Things you need to know</h4>
                                <hr class="mt-5 mb-5 hr-color">

                                <ul class="paragraph-padding">        
                                    @foreach($item->listingMeta as $key=>$values)
                                    @if(!empty($values->meta_key=="new_customer_only") && $values->meta_value)                                        
                                    <li><span><i class="fas fa-arrow-right"></i></span>New customers only</li>                                   
                                    @endif
                                    @if(!empty($values->meta_key=="limit_upto"))                                        
                                    <li><span><i class="fas fa-arrow-right"></i></span>Limit of {{$values -> meta_value}} voucher </li>                                   
                                    @endif
                                    @if(!empty($values->meta_key=="phone_bookings"))                                        
                                    <li><span><i class="fas fa-arrow-right"></i></span>Phone bookings  {{($values->meta_value)?"accepted":"not accepted"}}</li>                                   
                                    @endif
                                    @if(!empty($values->meta_key=="valid_for_age"))                                        
                                    <li><span><i class="fas fa-arrow-right"></i></span>Age Valid {{str_replace("_", " ", $values -> meta_value)}}</li>                                   
                                    @endif
                                    @if(!empty($values->meta_key=="refunds"))                                        
                                    <li><span><i class="fas fa-arrow-right"></i></span>{{($values->meta_value=="true")?"Refundable.":"Not Refundable."}}</li>                                   
                                    @endif
                                    @if(!empty($values->meta_key=="surchage_apply"))                                        
                                    <li><span><i class="fas fa-arrow-right"></i></span>{{($values->meta_value)?"Surchage apply.":"Surchange not apply."}}</li>                                   
                                    @endif
                                    @if(!empty($values->meta_key=="pulic_holidays"))                                        
                                    <li><span><i class="fas fa-arrow-right"></i></span>{{($values->meta_value=="true")?"Valid on public holidays also.":"Not valid on public holidays."}}</li>                                   
                                    @endif
                                    @if(!empty($values->meta_key=="days_valid"))                                     

                                    @if($values->meta_key=="days_valid" &&  in_array("true",(array) GuzzleHttp\json_decode($values->meta_value)))       
                                    @foreach($item->listing_meta as $key => $value)

                                    <?php $key = str_replace('_', " ", $key);
                                    ?> @if(is_object($value))
                                    <li>
                                        <span style="margin-right: 1px;"><i class="fas fa-arrow-right"></i></span>
                                        <b style="text-transform: capitalize;">{{$key}} :</b>
                                        <ul style="display: inline-flex;padding-bottom: 0px;">
                                            <?php $count = 0; ?>
                                            @foreach($value as $sub_key => $sub_value)                                           
                                            @if($sub_value=='true')
                                            <li>{{$sub_key}} {{($count < (count((array) $value) - 1))?',':''}}</li>                                            
                                            @endif
                                            <?php $count++; ?>

                                            @endforeach
                                        </ul>
                                    </li>
                                    @else @endif @endforeach
                                    @endif                                   
                                    @endif
                                    @endforeach
                                </ul>

                            </div>
                            @endif

                            <div class="deal_fine_print">
                                <h4 class="paragraph-padding">Redeem</h4>
                                <hr class="mt-5 mb-5 hr-color">

                                <ul class="paragraph-padding"> 
                                    <li><span><i class="fas fa-arrow-right"></i></span><b>Expiry:</b>30 days from purchase</li>
                                    <li><span><i class="fas fa-arrow-right"></i></span>Book Now or Book later</li>
                                    <li><span><i class="fas fa-arrow-right"></i></span>You will receive an email or SMS confirming your booking</li>
                                    <li><span><i class="fas fa-arrow-right"></i></span>If you have any trouble with online booking or do not receive confirmation after 48 hours, please email <a href="mailto:{{$item -> email}}" style="color:#4abdac;">{{$item -> email}}</a></li>
                                    <li><span><i class="fas fa-arrow-right"></i></span>24 hours notice is required to change a booking you have made. No-show and late cancellations will result in your voucher being forfeited</li>
                                </ul>
                            </div>

                            @endif

                        </div>

                    </div>
                </div>
                <!--                deal right protion go download due to these closing tags start-->
                @if($item->type == 'deal')
<!--            </div>-->
            @endif
        </div>
        <!--        </div>-->
        <!--                deal right protion go download due to these closing tags end-->
        <div class=" col-md-4">
            <div class="profile-info-box">
                <div class="avatar-round">

                    @if($item->user->profilepic) @if(File::exists(public_path().$item->user->profilepic['path'].'thumb_small_'.$item->user->profilepic['name']))
                    <img src="{{$item -> user -> profilepic['path'].'thumb_small_'.$item -> user -> profilepic['name']}}" />                                @else
                    <img src="images/user_pic.jpg" /> @endif @else
                    <img src="images/user_pic.jpg"> @endif
                </div>

                <div class="inner-wrap text-center">
                    <a href="profile?id={{ base64_encode($item -> user -> id)}}" class="service listing_business_area" style="margin-bottom:0px !important;">{{ isset($item -> user -> UserBusiness -> business_name)?$item -> user -> UserBusiness -> business_name:''}}</a>                                @if(isset($item->user->UserBusiness->business_email))
                    <div class="profile-stars mt-10px-imp" ng-init="rate = {{$item -> user -> rating}}" style="margin-top:0px !important;">
                        <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating font-size-rating"></uib-rating>
                    </div>
                    <div class="btn-contact-call" style="border-radius: 4px;">
                        <img src="images/contact-20.png" alt="Contact" title="Contact"> {{ $item -> contact}}
                    </div>
                    <div class="mt-10"><?php echo isset($item->user->UserBusiness->about) ? substr(($item->user->UserBusiness->about), 0, 180) : ''; ?></div>
                    @include('frontend.listing.emaildialog', array('item' => $item)) @endif @if($item->type == 'classified' || $item->type ==
                    'deal') @if(Auth::check())

                    <div class="btn btn-contact-email" ng-controller="BusinessNewController">
                        <a href="javascript:void(0)" ng-click="ReportBusiness('<?php echo $item->type ?>', '<?php echo $item->title ?>', '<?php echo $item->id ?>')"
                           title="Eamil">
                            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                            Report <?php echo $item->type ?></a>
                    </div>

                    @endif @endif


                    <div class="payment-accept">
                        @if(!empty($payment_mode))
                        <span>Payment Accepted</span>
                        <ul class="payment_accepted payment-mode">                                                                
                            <?php
                            if (isset($payment_mode['paypal']) && $payment_mode['paypal'] == true) {
                                ?>
                                <li>
                                    {{-- <i class="fas fa-money-check"></i>  --}}
                                            <i class="far fa-money-bill-alt"></i> Cash                                  
                                </li>
                                <?php
                            }
                            if (isset($payment_mode['creditcard']) && $payment_mode['creditcard'] == true) {
                                ?>
                                <li>
                                    <i class="fa fa-credit-card ml-10"></i> Card
                                </li>
                            <?php } ?>
                        </ul>
                        @endif
                    </div>

                </div>
                @if($item->type == 'deal') @if((Auth::check()) && (Auth::user()->roles[0]->name=='Distributor' || Auth::user()->roles[0]->name=='SchoolCollege'))
                <div class="btn_book mt-10">
                    <button id="btn-deal-book-now-other" class="btn_book_now" auth-status="{{(Auth::check())?1:0}}">Redeem</button>
                </div>
                @else
                <div class="btn_book mt-10">
                    <button id="btn-deal-book-now" class="btn_book_now" auth-status="{{(Auth::check())?1:0}}">Book Now</button>
                    <button id="btn-book-later" class="btn_book_later" auth-status="{{(Auth::check())?1:0}}">Book Later</button>
                </div>
                @endif 

            </div>
            @endif


            @if($item->type == 'deal'&& $item->user->roles[0]->name=="SchoolCollege")
            <div class="row">

                <div class="col-xs-12" style="margin-top: 20px;">
                    <div class="profile-google-map">                    
                        <?php
                        $location = json_encode(
                                [
                                    'latitude' => $item->latitude,
                                    'longitude' => $item->longitude,
                                    'state' => $item->state,
                                    'name' => '',
                                    'postcode' => $item->postcode
                                ]
                        );
                        ?>
                        <location-map location-info="{{ $location}}"></location-map>
                    </div>
                </div>

            </div>
            @endif
        </div>                
    </div>
</div>  
@endif
@if($item->type == 'deal'&& $item->user->roles[0]->name!="SchoolCollege")
<div class="container">

    <div class="row classified_contact">

        <div class="col-md-5 col-sm-6">

            <div class="row">
                <h1 style="font-weight: bold;">Timing</h1>
                <div class="col-md-12 contact_provid">

                    @if(isset($item->user->userBusiness->operating_hours))
                    <table class="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Opening Hours</th>
                                <th>Closing Hours</th>
                            </tr>
                        </thead>
                        <tbody>                               
                            @foreach($item->user->userBusiness->operating_hours as $day => $operating_hours)
                            <tr>
                                <td>
                                    <span style="text-transform: capitalize;">{{$day}}</span>
                                </td>
                                <td>
                                    @if(isset($operating_hours->holiday) && $operating_hours->holiday==1)
                                    <span id='openhours'><?php echo date('h:i A', strtotime('+5 hours', strtotime($operating_hours->open))); ?></span>
                                    @else
                                    <span id='openhours'>Closed</span>
                                    @endif
                                </td>
                                <td>
                                    @if(isset($operating_hours->holiday) && $operating_hours->holiday==1)
                                    <span id='openhours'><?php echo date('h:i A', strtotime('+5 hours', strtotime($operating_hours->close))); ?></span>
                                    @endif
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-md-7 col-sm-6">
            <div class="map border-top map-with-opening-hours" style="margin-top: 15px;">
                <?php
                $location = json_encode(
                        [
                            'latitude' => $item->latitude,
                            'longitude' => $item->longitude,
                            'state' => $item->state,
                            'name' => $item->suburb,
                            'postcode' => $item->postcode
                        ]
                );
                ?>
                <location-map location-info="{{ $location}}"></location-map>
            </div>
        </div>

    </div>
</div>
@endif
</div>
</div>
</section>
<div class="modal fade" id="applyjobModal" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content mt-70">
            <div class="modal-header">
                <button type="button" id="applyjobModalClose" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Your Application</h4>
            </div>
            <div class="modal-body">
                @if (Auth::check()) @if ($item->user_id != Auth::id())
                <apply-job id="{{$item -> id}}" userid="{{$item -> user_id}}"></apply-job>
                @endif @else {!! link_to('auth/login', 'APPLY', array("class"=>'apply_link')) !!} @endif
            </div>
        </div>
    </div>
</div>