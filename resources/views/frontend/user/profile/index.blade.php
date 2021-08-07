@section('after-styles-end')
<link rel="stylesheet" href="{{url('../new_assets/lightslider/lightslider.min.css')}}" />
<style type="text/css">
    .se-pre-con2 {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background: url("{{url("images/spinner.gif")}}") center no-repeat #fff;
        background-color: rgba(0, 0, 0, 0.9);
        background-size: 240px;
    }

    .fb_dialog {
        right: 5pt !important;
        bottom: 52pt !important;
        background: transparent !important;
    }

    .fb_dialog iframe {
        bottom: 70px !important;
        right: -5px !important;
    }

    @media (max-width:640px) {
        .social-block-icons-rows .social-block-icons li {
            padding: 10px 5px;
        }

        .social-block-icons-rows .paypal-icons {
            padding: 10px 15px;
            text-align: left;
        }
    }
    .tooltiptext{
        position: absolute;
        top: -47px;
        left: 52px;
        background-color: #000000ab;
        border: 1px solid #000;
        padding: 9px;
        font-size: 10px;
        border-radius: 9px;
        font-weight: bold;
        color: #5bc5b5;display: none;
    }
    /* #fb-root iframe{
               z-index:1029 !important;
        } */
</style>

@endsection
@extends('frontend.layouts.account')
@section('content')
<style type="text/css">
    .fb_dialog {
        right: 5pt !important;
    }
</style>
<div class="se-pre-con2" style="display: none;">
    <div class="show-text-booking-wait">
        <p>Please wait we are sending you deal details via email.</p>
    </div>
</div>
<!------------START : Banner Guide Block------------>

<div class="bannerUpload bgGrayDark">
    <div class="uploadIcon">
        <img id="imgBanner" src="{{url($record[0]['bannerpath'])}}" alt="Banner image">
    </div>
</div>
<!------------END : Banner Guide Block------------>
@foreach($record as $user)
<!------------START : Slider Buttons Block------------>
<div class="slider-buttons">

    <div class="container">
        <div class="row">
            <div class="col-xs-3">
                <?php
                $check_previous = 0;
                if (!auth::check()) {
                $check_previous = 1;
                } else {
                if (auth::check() && (auth::user()->roles[0]->name != 'ServiceProvider' && auth::user()->roles[0]->name != 'Distributor' && auth::user()->roles[0]->name != 'SchoolCollege')) {
                $check_previous = 1;
                }
                }
                ?>


                @if($check_previous==1)
                <?php
                if ($previous)
                $previous_link = "onclick=\"window.open('/profile?id=" . base64_encode($previous) . "','_self')\" ";
                else
                $previous_link = "";
                if ($next)
                $next_link = "onclick=\"window.open('/profile?id=" . base64_encode($next) . "','_self')\" ";
                else
                $next_link = "";
                ?>
                <div class="slider-button" <?php echo!empty($previous_link) ? $previous_link : ''; ?>>
                    <i class="fas fa-angle-left"></i>
                    <span class="hidden-xs">Previous provider</span>
                </div>
                @endif
            </div>

            <div class="col-xs-6 col-padding-adjustment text-center" style="<?php echo (auth::check() && (auth::user()->roles[0]->name == 'ServiceProvider' || auth::user()->roles[0]->name == 'Distributor' || auth::user()->roles[0]->name == 'SchoolCollege')) ? 'padding-bottom: 15px;' : ''; ?>">
                <h2 style='margin-top: 0;'>{{$user -> UserBusiness -> business_name}}</h2>
            </div>
            <div class="col-xs-3 text-right" <?php echo!empty($next_link) ? $next_link : ''; ?>>
                @if($check_previous==1)
                <div class="slider-button">
                    <span class="hidden-xs">Next provider</span>
                    <i class="fas fa-angle-right"></i>
                </div>
            </div>
            @endif
        </div>
    </div>

</div>
<!------------END : Slider Buttons Block------------>
<!------------START : Feature Banner Block------------>
<div class="profile">
    <div class="container">
        <div class="row">
            <div class="col-sm-3">
                <div class="service-provider-info text-center">
                    @if($user->profilepic)
                    @if(File::exists(public_path().$user->profilepic['path'].'thumb_small_'.$user->profilepic['name']))
                    <img src="{{$user -> profilepic['path'].'thumb_small_'.$user -> profilepic['name']}}" alt="Profile image" />
                    @else
                    <img src="images/user_pic.jpg" alt="Profile image" />
                    @endif
                    @else
                    <img src="images/user_pic.jpg" alt="Profile image" />
                    @endif
                    <div class="profile-date mt-10px-imp">{{ date('M d Y', strtotime($user -> created_at))}}</div>
                    <div class="profile-stars mt-10px-imp" ng-init="rate = {{$user -> rating}}">
                        <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating font-size-rating"></uib-rating>
                    </div>
                    @if(!Auth::id())
                    <div widget-rating userto="{{$user -> id}}" userfrom="0" businesstitle="{{$user -> userbusiness -> business_name}}" />
                </div>
                @endif

                <div class="profile-review">{{ count($user -> ReviewTo)}}
                    @if(count($user -> ReviewTo)>1)
                    reviews
                    @else
                    review
                    @endif
                </div>
                @if(Auth::id() && $user->id != Auth::id())
                <div widget-rating userto="{{$user -> id}}" userfrom="{{ Auth::id() }}" businesstitle="{{ isset(Auth::user() -> userbusiness -> business_name)?Auth::user() -> userbusiness -> business_name:''}}" />
            </div>
            @endif
            <button class="btn-white-1 mt-10px-imp mb-10px-imp" data-toggle="modal" data-target=".bs-example-modal-review">Write a Review</button>
        </div>
    </div>

    <div class="col-sm-6">
        <div class="service-provider1">
            <div class="service-provider-content1  trix-content">
                @if($user->userBusiness)
                <?php echo html_entity_decode($user->userBusiness->about); ?>
                @endif
                @if($user->userInfo)
                <p> {{html_entity_decode($user -> userInfo -> about)}}</p>
                @endif
            </div>
        </div>
    </div>

    <div class="col-sm-3">
        @if(isset($user->gallery) && count($user->gallery)>0)
        <div class="sliderHeightFix">
            <div class="slickNormalAdaptive">
                @foreach($user->gallery as $k =>$item)
                <img data-fancybox="gallery" href="{{$item['image_path']}}{{$item['image_org']}}" data-thumb="{{$item['image_path']}}{{$item['image_name']}}" src="{{$item['image_path']}}{{$item['image_name']}}" />
                @endforeach
            </div>
        </div>
        @endif
    </div>
</div>
</div>
</div>
<!------------END : Feature Banner Block------------>

<!------------START : Social Row Block------------>
<div class="container">
    <div class="social-block social-block-icons-rows">
        <div class="row">

            <div class="col-sm-9 col-xs-12">
                <div class="social-block-icons">
                    <ul>
                        <?php if (isset($user->UserSocialAccounts['facebook']) && strlen($user->UserSocialAccounts['facebook']) > 0) { ?>
                        <li class="facebook">
                            <a href="{{urlHelper($user -> UserSocialAccounts['facebook'])}}"><i class="fab fa-facebook-f fb"></i>
                            </a>
                        </li>
                        <?php
                        }
                        if (isset($user->UserSocialAccounts['twitter']) && strlen($user->UserSocialAccounts['twitter']) > 0) {
                        ?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['twitter'])}}" class="twitter"><i class="fab fa-twitter tw"></i></a></li>
                        <?php
                        }
                        if (isset($user->UserSocialAccounts['linkedin']) && strlen($user->UserSocialAccounts['linkedin']) > 0) {
                        ?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['linkedin'])}}" class="twitter"><i <i class="fab fa-linkedin tw"></i></a></li>
                        <?php
                        }
                        if (isset($user->UserSocialAccounts['youtube']) && strlen($user->UserSocialAccounts['youtube']) > 0) {
                        ?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['youtube'])}}" class="youtube"><i class="fab fa-youtube"></i></a></li>
                        <?php
                        }
                        if (isset($user->UserSocialAccounts['pinterest']) && strlen($user->UserSocialAccounts['pinterest']) > 0) {
                        ?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['pinterest'])}}" class="pinterest"><i class="fab fa-pinterest-square"></i></a></li>
                        <?php
                        }
                        if (isset($user->UserSocialAccounts['instagram']) && strlen($user->UserSocialAccounts['instagram']) > 0) {
                        ?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['instagram'])}}" class="instagram"><i class="fab fa-instagram"></i></a></li>
                        <?php
                        }
                        if (isset($user->UserSocialAccounts['google-plus']) && strlen($user->UserSocialAccounts['google-plus']) > 0) {
                        ?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['google-plus'])}}" class="google-plus"><i class="fab fa-google-plus-square"></i></a></li>
                        <?php
                        }
                        if (isset($user->UserSocialAccounts['flickr']) && strlen($user->UserSocialAccounts['flickr']) > 0) {
                        ?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['flickr'])}}" class="flickr"><i class="fab fa-flickr"></i></a></li>
                        <?php
                        }
                        if (isset($user->UserSocialAccounts['reddit']) && strlen($user->UserSocialAccounts['reddit']) > 0) {
                        ?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['reddit'])}}" class="reddit"><i class="fab fa-reddit-square"></i></a></li>
<?php
}
if (isset($user->UserSocialAccounts['vine']) && strlen($user->UserSocialAccounts['vine']) > 0) {
?>
                        <li><a href="{{urlHelper($user -> UserSocialAccounts['vine'])}}" class="vine"><i class="fab fa-vimeo-square"></i></a></li>
                        <?php } ?>
                    <!--                        <li class="rss"><a href=""><i class="fas fa-rss rss"></i></a></li>-->






                        <?php
                        $url = '';
                        if (isset($user->userBusiness->website) &&!empty(isset($user->userBusiness->website))) {
                        if ((!(substr($user->userBusiness->website, 0, 7) == 'http://')) && (!(substr($user->userBusiness->website, 0, 8) == 'https://'))) {
                        $url = 'http://' . $user->userBusiness->website;
                        } else {
                        $url = $user->userBusiness->website;
                        }
                        }
                        ?>


                        <li class="rss"><a href="{{$url}}" target="_blank"><i class="fas fa-globe globe"></i></a></li>
                        <li class="rss" style="width:50px;text-align: center;display: block;"> 
                            @if($user->UserBusiness->contact_number)
                            <span id="tooltiptext" 
                            style="font-size:15px; color:white; background:#4abdac; border:none"
                            class="tooltiptext">tel +<?php echo $user->UserBusiness->contact_number; ?></span>
                            @endif
                            <a  id="phonenumberIcon"  target="_blank" style="width:100%;display: block;" > <i class="fas fa-phone cell"></i>

                            </a>

                        </li>
                        <li class="rss">
                            <a data-toggle="modal" data-target="#myModal" style="text-decoration: none;"> <i class="fas fa-envelope envelop"></i>CONTACT US</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3 col-xs-12 text-right">
                <div class="paypal-icons">
                    <?php
                    if (isset($user['payment_integration_info']) &&!empty($user['payment_integration_info']) && count($user['payment_integration_info']->toArray()) > 0) {
                    $payment_status = unserialize($user['payment_integration_info'][0]->value);
                    if (isset($payment_status['paypal']) && $payment_status['paypal'] == true) {
                    ?>
                    {{-- <i class="fas fa-money-check"></i> --}}
                    <i class="far fa-money-bill-alt"></i> Cash
<?php
}
if (isset($payment_status['creditcard']) && $payment_status['creditcard'] == true) {
?>
                    <i class="fa fa-credit-card ml-15"></i> Card
<?php
}
}
?>
                </div>
            </div>

        </div>
    </div>
</div>
<!------------END : Social Row Block------------>
<!-- Modal -->
<div id="myModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Contact Us</h4>
            </div>
            <form id="frmContactMe">
                <div class="modal-body">
                    <div class="msgStatus" style="display: none;"></div>
                    <div class="form-group">
                        <label for="fromname">Name:</label>
                        <input type="text" class="form-control" id="fromname" name="fromname" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email address:</label>
                        <input type="email" class="form-control" id="email" name="sendfrom" required>
                        <input type="hidden" name="sendto" value="{{$user -> email}}" />
                        <input type="hidden" name="sendtoid" value="{{$user -> id}}" />
                    </div>
                    <div class="form-group">
                        <label for="comment">Messsage:</label>
                        <textarea class="form-control" name="senderMsg" rows="5" id="comment" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" id="btnSendMail" class="btn btn-default">Submit</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </form>
        </div>

    </div>
</div>
<!------------START : Appointment Block------------>
<div class="appointment">
    <div class="container">
        <div class="row">
            <div class="col-md-3 col-sm-3 col-padding-adjustment">
                <div class="opening-hours">
                    @if($user->roles[0]->name != 'SchoolCollege' && $user->roles[0]->name != 'Distributor')
                    <a href='{{url('/booking/'.base64_encode($user_id))}}' style="text-decoration: none;color: #ffffff;font-size: 14px;font-weight: bold;"><button class="btn-green-1">Make an appointment</button></a>
                    @endif
                    <h4>Opening hours</h4>
                    <div class="row opening-hours-time row-padding-adjustment-2 text-capitalize">

                    </div>


                </div>
            </div>
            <div class="col-md-6 col-sm-6 col-padding-adjustment">
                <div>
                    <div class="col-md-12 col-sm-12 col-padding-adjustment">
                        <div class="write-review">

                            <button class="btn-white-1" onclick="window.open('/gallery/{{ $user -> id}}', '_self')">Gallery</button>



                        </div>
                    </div>
                </div>
                @if($user->roles[0]->name != 'SchoolCollege')
                <div>
                    @if($user->roles[0]->name != 'Distributor')
                    <div class="col-md-6 col-sm-6 col-padding-adjustment">
                        <div class="write-review">
                            <h4>Services</h4>
                            <div class="row service-name row-padding-adjustment-2 pp" style="max-height: 212px;overflow-y: auto;">
                                @if (count($user->business_services)>0)
                                @foreach($user->business_services as $business_service)
                                <!--<div class="col-xs-6 col-padding-adjustment-2"><span>{{$business_service -> title}}</span></div>-->
                                <div class="bg-teal col-padding-adjustment-2 courseName new-col-tag" style='background: #514c49;color:#fff;padding:2px 10px;'><?php echo html_entity_decode($business_service->title); ?></div>
                                @endforeach
                                @else
                                <h1 class="text-center" style="font-size: 40">No Service</h1>
                                @endif
                            </div>
                        </div>
                    </div>
                    @endif
                    <div class="<?php echo ($user->roles[0]->name == 'Distributor') ? 'col-md-12' : 'col-md-6'; ?> col-sm-6 col-padding-adjustment">
                        <div class="write-review">
                            <h4>Brands</h4>
                            <div class="row service-name row-padding-adjustment-2 pp" style="max-height: 212px;overflow-y: auto;">
                                @if (count($user->BusinessBrands)>0)
                                @foreach($user->BusinessBrands as $business_service)
                                <div class="bg-teal col-padding-adjustment-2 courseName new-col-tag" style='background: #514c49;color:#fff;padding:2px 10px;'>
<?php echo html_entity_decode($business_service->title); ?>
                                </div>
                                @endforeach
                                @else
                                <h1 class="text-center" style="font-size: 40">No Brand</h1>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
                @else
                <div class="col-md-12 pt-15">
                    <h3>Courses</h3>
                    <hr style="border-color: #d7d7d7" />
                    <div class="">
                        @if (count($user->scCourses)>0)
                        @foreach($user->scCourses as $course)
                        <div class="col-md-6" style="border-bottom: solid 1px #eee;width: 100%;padding: 7px;"><a href="javascript:window.open('{{$course -> course_website}}','_blank');" class="" style="color:#333;">{{$course -> course_title}}</a><span class="" style="float: right;"><span class="cls-courseType" style="{{($course -> course_type == 1|| $course ->course_type==2)?'':'display:none;'}}">Domestic</span><span style="{{($course -> course_type == 0|| $course -> course_type==2)?'':'display:none;'}}margin-left: 15px;" class="cls-courseType cls-greycolor">International</span></span></div>
                        @endforeach
                        @else
                        <h1 class="text-center" style="font-size: 40">No Course Available</h1>
                        @endif
                    </div>
                    <hr class="mt-15">
                </div>
                @endif
            </div>

            <div class="col-md-3 col-sm-3 col-padding-adjustment">
                @if(!empty($user->video_gallery))
                <div class="service-video">

                    <div class="carousel_container">
                        <div class="carousel_slides">

                            <slick dots="false" infinite="false" speed=300 slides-to-show=1 touch-move="false" slides-to-scroll=1 class="slider one-time" responsive="[{breakpoint: 990, settings: {slidesToShow: 1}}, {breakpoint: 768,settings: {slidesToShow: 1}}, {breakpoint: 480,settings: {slidesToShow: 1}}]">

                                @foreach($user->video_gallery as $video)

                                <div class="text-center">
                                    <iframe id="y_video" width="80%" height="200" src="{{$video['video_emb_link']}}?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>
                                </div>
                                @endforeach

                            </slick>
                        </div>
                    </div>
                </div>
                @else
                <div class="empty-box">
                    NO VIDEO AVAILABLE
                </div>
                @endif
            </div>

        </div>
    </div>
</div>
<!------------END : Appointment Block------------>
<!------------START : Deals Block------------>
@if($user->roles[0]->name == 'SchoolCollege')
@include('frontend.includes.sclistingslider')
@else
@include('frontend.includes.listingslider')
@endif
<!------------END : Deals Block------------>
<!------------START : Members Slider Block------------>
<div class="container">
    <div class="members-slider">

                    <?php
                    $teams = App\Team::where('owner_id', base64_decode($_GET['id']))->get();
                    if (count($teams) > 0) :
                    ?>



        <div class="carousel_container team-profile">
            <!--First column-->
            <div class="carousel_slides">
                <slick dots="false" infinite="true" speed=300 slides-to-show=4 touch-move="false" slides-to-scroll=1 slick-slide="false" class="slider one-time" responsive="[{breakpoint: 990, settings: {slidesToShow: 4}}, {breakpoint: 768,settings: {slidesToShow: 2}}, {breakpoint: 480,settings: {slidesToShow: 1}}]">
                            <?php foreach ($teams as $team) : ?>
                    <div class="col-lg-3 col-sm-3 col-md-6 mb-r team-block">

                        <div class="avatar">
<?php
$assetinfo = \DB::table('assets')->where(array('id' => $team->image_id))->get();
if (!empty($assetinfo) && $assetinfo->count() > 0) {
$assetinfo = $assetinfo[0];
$profile_pic = $assetinfo->path . $assetinfo->name;
} else {
$profile_pic = 'images/user_pic.jpg';
}
?>
                            <a data-toggle="modal" data-target="#teamModal" style="text-decoration: none;" class="team-about" data-about="{{$team -> about}}" data-name="{{$team -> member_name}}" data-designation="{{$team -> designation}}">
                                <img width="200" height="200" src="{{$profile_pic}}" class="rounded-circle profile-image"></a>

                        </div>
                        <div class="profile-name">
                            <!-- <a href="{{url('team').'/'.$team ->id}}"> -->
                            <a data-toggle="modal" data-target="#teamModal" style="text-decoration: none;" class="team-about" data-about="{{$team -> about}}" data-name="{{$team -> member_name}}" data-designation="{{$team -> designation}}">
                                <b>{{ucwords($team -> member_name)}}</b>
                            </a>
                        </div>
                        <a data-toggle="modal" data-target="#teamModal" style="text-decoration: none;" class="team-about" data-about="{{$team -> about}}" data-name="{{$team -> member_name}}" data-designation="{{$team -> designation}}">
                            <div class="profile-desg">{{$team -> designation}}</div>
                        </a>
                    </div>
<?php endforeach; ?>
                </slick>

            </div>
            <!--/First column-->

        </div>
        @else
        <div class="">
            No team members available
        </div>
        @endif

    </div>
</div>

<!------------END : Members Slider Block------------>


<!------------START : Map Block------------>
<!-- Find a Service via your Location -->
<div class="profile_map">
    <h3 class="text-center text-heading">Map of {{$user -> UserBusiness -> business_name}}</h3>

    <div class="profile-map">
        <div id="map" style="width: 100%; height: 337px;"></div>

    </div>


</div>
<!------------END : Map Block------------>
<!------------START : Latest Reviews Block------------>
<latest-reviews user='{{$user_id}}' bind-to-window="true"></latest-reviews>
<!------------END : Latest Reviews Block------------>
<div class="clear"></div>

@endforeach
<div id="teamModal" class="modal fade" role="dialog" style="background-color: rgba(0, 0, 0, 0.5);position: fixed;">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <div class="display-team">
                    <h3 class="modal-title display-team-name"></h3>
                    <div class="display-team-designation"></div>
                </div>
            </div>
            <div class="modal-body">
                <p class="display-team-about text-justify"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-green-1" data-dismiss="modal">Close</button>
            </div>
        </div>

    </div>
</div>
@endsection
@section('after-scripts-end')
<script src='{{url('../new_assets/lightslider/lightslider.min.js')}}'></script>
<link rel="stylesheet" type="text/css" href="{{url('../new_assets/fancy/jquery.fancybox.min.css')}}">
<script src="{{url('../new_assets/fancy/jquery.fancybox.min.js')}}"></script>
<script type="text/javascript">
    $(document).ready(function() {
    $('[data-fancybox="gallery"]').fancybox({});
    $('#lightSlider').lightSlider({
    gallery: true,
            item: 1,
            loop: true,
            slideMargin: 0,
            thumbItem: 9,
            adaptiveHeight: true
    });
    $(".slickNormalAdaptive").slick({
    slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
            adaptiveHeight: true,
            vertical: false,
            prevArrow: "<button type='button' class='slick-prev pull-left'><img src='../../../../new_assets/images/images/pre.png' width='8' alt='Prev'/></button>",
            nextArrow: "<button type='button' class='slick-next pull-right'><img src='../../../../new_assets/images/images/next.png' width='8' alt='Next'/></button>"
            /* prevArrow:"<a href='javascript:;'><img src='../../../../new_assets/images/images/pre.png' alt='Prev'/></a>",
             nextArrow:"<a href='javascript:;'><img src='../../../../new_assets/images/images/next.png' alt='Next'/></a>" */
    });
    });</script>
<script type="text/javascript">
    function openGallaySlider() {
    $('.slick-track').each(function() { // the containers for all your galleries
    $(this).magnificPopup({
    delegate: 'a', // the selector for gallery item
            type: 'image',
            gallery: {
            enabled: true
            }
    });
    });
    }
    $(function() {
//                 $(document).tooltip({selector:'#phonenumberIcon'});        

//            
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#phonenumberIcon').attr('href', "tel: +<?php echo $user->UserBusiness->contact_number; ?>")
    } else{
        $('#phonenumberIcon').mouseover(function(){
             $('#tooltiptext').show();
        });
        $('#phonenumberIcon').mouseleave(function() {
             $('#tooltiptext').hide();
        });
    }
    })
</script>
<script type="text/javascript">
            var operating_hours = JSON.parse('<?php echo json_encode($user->UserBusiness->operating_hours); ?>');
    var html = '';
    $.each(operating_hours, function(i, val) {
    if (val.holiday == 1) {
    html += '<div class="col-xs-3 col-padding-adjustment-2">' + i.substr(0, 3) + '</div><div class="col-xs-9 col-padding-adjustment-2 text-uppercase">' + moment(val.open).format('hh:mm a') + ' - ' + moment(val.close).format('hh:mm a') + '</div>'
    } else {
    html += '<div class="col-xs-3 col-padding-adjustment-2">' + i.substr(0, 3) + '</div><div class="col-xs-9 col-padding-adjustment-2">Closed</div>'
    }
    });
    $('.opening-hours-time').html(html);
    $(".team-about").click(function() {
    $('.display-team-about').text($(".team-about").attr("data-about"));
    $('.display-team-name').text($(".team-about").attr("data-name"));
    var designation = $(".team-about").attr("data-designation");
    if (designation != "")
            $('.display-team-designation').text('(' + designation + ')');
    });</script>
<?php
if (isset($record[0]) && isset($record[0]->UserBusiness)) {
if ((isset($record[0]->UserBusiness->facebook_app_id) &&!empty($record[0]->UserBusiness->facebook_app_id)) && (isset($record[0]->UserBusiness->facebook_page_id) &&!empty($record[0]->UserBusiness->facebook_page_id))) {
?>
<div class="fb-customerchat" attribution=setup_tool page_id="<?php echo $record[0]->UserBusiness->facebook_page_id; ?>" theme_color="#58bcb9"></div>
<script>
    window.fbAsyncInit = function() {
    FB.init({
    appId: '<?php echo $record[0]->UserBusiness->facebook_app_id; ?>',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v5.0'
    });
    };
    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
    return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>
<?php
}
}
?>
<script src="http://maps.google.com/maps/api/js?key=AIzaSyBgUoek8OLWNtu9y2IB0GRSZDcK4OCi4R4" type="text/javascript"></script>
<script type="text/javascript">
    window.onload = function() {
    var map = new google.maps.Map(document.getElementById('map'), {
    maxZoom: 19,
            center: new google.maps.LatLng( - 33.92, 151.25),
            mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    var geocoder = new google.maps.Geocoder();
    var address = '<?php echo $user->userBusiness->business_address . ", " . $user->userBusiness->business_suburb . ", " . $user->userBusiness->state ?>';
    console.log(address);
    geocoder.geocode({
    'address': address
    }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    marker = new google.maps.Marker({
    position: results[0].geometry.location,
            map: map
    });
    bounds.extend(marker.position);
    map.fitBounds(bounds);
    }

    });
    };
</script>

@endsection