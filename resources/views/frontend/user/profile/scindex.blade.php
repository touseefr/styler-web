<style type="text/css">
    .se-pre-con2 {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background: url({{url("images/spinner.gif")}}) center no-repeat #fff;
    background-color: rgba(0,0,0,0.9);
     background-size: 240px;
    }
</style>
<div class="se-pre-con2" style="display: none;">
    <div class="show-text-booking-wait">
        <p>Please wait we are sending you deal details via email.</p>
    </div>    
</div>

@section('after-styles-end')
<link rel="stylesheet" href="{{url('../new_assets/lightslider/lightslider.min.css')}}" />
@endsection
@extends('frontend.layouts.account') 
@section('content')
<!------------START : Banner Guide Block------------>
<div class="banner banner-inner">
    <img src="new_assets/images/profile-banner-bg.png" alt="Banner image" />
    <div class="container">
        <div class="banner-content">
            <div class="banner-heading">
                <p>Stylerzone Service Providers</p>
            </div>
        </div>
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
                if ($previous)
                $previous_link = "onclick=\"window.open('/profile?id=" . $previous . "','_self')\" ";
                else
                $previous_link = "";


                if ($next)
                $next_link = "onclick=\"window.open('/profile?id=" . $next . "','_self')\" ";
                else
                $next_link = "";
                ?>



                <div class="slider-button" <?php echo!empty($previous_link) ? $previous_link : ''; ?>>
                    <i class="fas fa-angle-left"></i>
                    <span class="hidden-xs">Previous  provider</span>
                </div>
            </div>

            <div class="col-xs-6 col-padding-adjustment text-center">                
                <h2 style='margin-top: 0;'></h2>
            </div>
            <div class="col-xs-3 text-right" <?php echo!empty($next_link) ? $next_link : ''; ?>>
                <div class="slider-button">
                    <span class="hidden-xs">Next  provider</span>
                    <i class="fas fa-angle-right"></i>
                </div>
            </div>
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
                    <img src="{{$user -> profilepic['path'].'thumb_small_'.$user -> profilepic['name']}}" alt="Profile image"/>
                    @else
                    <img src="images/user_pic.jpg" alt="Profile image"/>
                    @endif
                    @else
                    <img src="images/user_pic.jpg" alt="Profile image"/>
                    @endif                    
                    <div class="profile-date mt-10px-imp">{{ date('M d Y', strtotime($user -> created_at))}}</div>
                    <div class="profile-stars mt-10px-imp" ng-init="rate = {{$user -> rating}}">
                        <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating font-size-rating"></uib-rating>
                    </div>
                    @if(!Auth::id())
                    <div widget-rating userto="{{$user -> id}}" userfrom="0" businesstitle="{{$user -> userbusiness -> business_name}}"/></div>
                @endif

                <div class="profile-review" >{{ count($user -> ReviewTo)}} reviews</div>
                @if(Auth::id() && $user->id != Auth::id())
                <div widget-rating userto="{{$user -> id}}" userfrom="{{ Auth::id() }}" businesstitle="{{ Auth::user()->userbusiness->business_name }}"/></div>
            @endif
            <button class="btn btn-block btn-white-1 mt-10px-imp mb-10px-imp" data-toggle="modal" data-target=".bs-example-modal-review">Write a Review</button>
            <button class="btn btn-block btn-white-1" onclick="window.open('/gallery/{{ $user -> id}}', '_self')" >Gallery</button>
        </div>
    </div>

    <div class="col-sm-9">
        <div class="service-provider">         
            <div class="service-provider-content mt-0">
              <h2 class="mt-0">{{$user -> UserBusiness -> business_name}}</h2>
              @if($user->userBusiness)
              {{$user -> userBusiness -> about}}
              @endif
              @if($user->userInfo)
              <p> {{$user -> userInfo -> about}}</p>
              @endif
              @if(isset($user->gallery) && count($user->gallery)>0)
              <div class="demo profileLightSlider">
                  <ul id="lightSlider">
                      @foreach($user->gallery as $k =>$item)
                      <li data-fancybox="gallery"  href="{{$item['image_path']}}{{$item['image_org']}}" data-thumb="{{$item['image_path']}}{{$item['image_name']}}">
                        <img src="{{$item['image_path']}}{{$item['image_name']}}" />
                      </li>
                      @endforeach
                  </ul>
              </div>
              @endif
                
            </div>
        </div>
    </div>

    <!-- <div class="col-sm-3">
        @if(isset($user->gallery) && count($user->gallery)>0)
        <div class="demo">
            <ul id="lightSlider">
                @foreach($user->gallery as $k =>$item)
                <li data-fancybox="gallery"  href="{{$item['image_path']}}{{$item['image_org']}}" data-thumb="{{$item['image_path']}}{{$item['image_name']}}">
                    <img src="{{$item['image_path']}}{{$item['image_name']}}" />
                </li>
                @endforeach
            </ul>
        </div>
        @endif
    </div> -->
</div>
</div>
</div>
<!------------END : Feature Banner Block------------>

<!------------START : Social Row Block------------>
<div class="container">
    <div class="social-block">
        <div class="row">

            <div class="col-md-9">
                <div class="social-block-icons">
                    <ul>

                        <?php if(isset($user->UserSocialAccounts['facebook']) && strlen($user->UserSocialAccounts['facebook'])>0){ ?>
                        <li class="facebook">
                            <a href="{{$user -> UserSocialAccounts['facebook']}}" ><i class="fab fa-facebook-f fb"></i>
                            </a>
                        </li>
                        <?php }if(isset($user->UserSocialAccounts['twitter']) && strlen($user->UserSocialAccounts['twitter'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['twitter']}}" class="twitter"><i class="fab fa-twitter tw"></i></a></li>   
                        <?php }if(isset($user->UserSocialAccounts['linkedin']) && strlen($user->UserSocialAccounts['linkedin'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['linkedin']}}"     class="twitter"><i <i class="fab fa-linkedin tw"></i></a></li>   
                        <?php }if(isset($user->UserSocialAccounts['youtube']) && strlen($user->UserSocialAccounts['youtube'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['youtube']}}" class="youtube"><i class="fab fa-youtube"></i></a></li>   
                        <?php }if(isset($user->UserSocialAccounts['pinterest']) && strlen($user->UserSocialAccounts['pinterest'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['pinterest']}}"     class="pinterest"><i class="fab fa-pinterest-square"></i></a></li>   
                        <?php }if(isset($user->UserSocialAccounts['instagram']) && strlen($user->UserSocialAccounts['instagram'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['instagram']}}"     class="instagram"><i class="fab fa-instagram"></i></a></li>   
                        <?php }if(isset($user->UserSocialAccounts['google-plus']) && strlen($user->UserSocialAccounts['google-plus'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['google-plus']}}"     class="google-plus"><i class="fab fa-google-plus-square"></i></a></li>   
                        <?php }if(isset($user->UserSocialAccounts['flickr']) && strlen($user->UserSocialAccounts['flickr'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['flickr']}}"     class="flickr"><i class="fab fa-flickr"></i></a></li>   
                        <?php }if(isset($user->UserSocialAccounts['reddit']) && strlen($user->UserSocialAccounts['reddit'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['reddit']}}"     class="reddit"><i class="fab fa-reddit-square"></i></a></li>   
                        <?php }if(isset($user->UserSocialAccounts['vine']) && strlen($user->UserSocialAccounts['vine'])>0){ ?>
                        <li ><a href="{{$user -> UserSocialAccounts['vine']}}"     class="vine"><i class="fab fa-vimeo-square"></i></a></li>   
                        <?php } ?>
                        <li class="rss"><a href=""><i class="fas fa-rss rss"></i></a></li>
                        <?php
                        $url = '';
                        if(isset($user->userBusiness->website) &&!empty(isset($user->userBusiness->website))){
                        if ((!(substr($user->userBusiness->website, 0, 7) == 'http://')) && (!(substr($user->userBusiness->website, 0, 8) == 'https://'))) {
                        $url = 'http://' . $user->userBusiness->website;
                        }else{
                        $url = $user->userBusiness->website;
                        }
                        }
                        ?>


                        <li class="rss"><a href="{{$url}}" target="_blank"><i class="fas fa-globe globe"></i></a></li>
                        <li class="rss"><a href="tel:+{{$user -> contact_number}}" target="_blank"> <i class="fas fa-phone cell"></i></a></li>
                        <li class="rss"><a   data-toggle="modal" data-target="#myModal" style="text-decoration: none;"> <i class="fas fa-envelope envelop"></i>CONTACT US</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-md-3 text-right">
                <div class="paypal-icons">

                    <?php
                    if(isset($user['payment_integration_info']) &&!empty($user['payment_integration_info'])){
                    $payment_status = unserialize($user['payment_integration_info'][0]->value);
                    if($payment_status['paypal'] == true){
                    ?>
                    <img src="new_assets/images/paypal.svg" alt="Paypal" />
                    <?php
                    }
                    if($payment_status['creditcard'] == true){
                    ?>
                    <img src="new_assets/images/creditcard.svg" alt="Paypal" />
<?php }} ?>
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
            <form id="frmContactMe" >
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
                        <textarea class="form-control"  name="senderMsg" rows="5" id="comment" required></textarea>
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
<!------------START : COURSES Block------------>
<div class="container pt-15">
  <h3>Courses</h3>
  <div class="">
    @if (count($user->scCourses)>0)
    @foreach($user->scCourses as $course)
    <div class="bg-teal courseName"><a href="javascript:window.open('{{$course->course_website}}','_blank');" class="d-inlineB text-white px-10 py-5 no-decor">{{$course -> course_title}}</a><span class="ml-10 mr-10" ><span class="text-white courseType" style="{{($course -> course_type==1 || $course ->course_type==2)?'':'display:none;'}}">Domestic</span><span style="{{($course -> course_type==0 || $course -> course_type==2)?'':'display:none;'}}}" class="text-white ml-10 courseType">International</span></span></div>
    @endforeach
    @else
    <h1 class="text-center" style="font-size: 40">No Course Available</h1>
    @endif
  </div>
  <hr class="mt-15">
</div>
<!------------START : Appointment Block------------>
<div class="appointment">
  <div class="container">      
    <div class="row">
      <div class="col-md-7 col-sm-12">
        <h3 class="mt-0">Opening hours</h3>
        @if($user->roles[0]->name == 'SchoolCollege')
        <div class="opening-hours">
          <a href='{{url('/booking/'.$user_id)}}' style="text-decoration: none;color: #ffffff;font-size: 14px;font-weight: bold;"></a>                    
          <div class="opening-hours-time text-capitalize"></div>
        </div>
        @endif
      </div>
      <div class="col-md-5 col-sm-12">
          @if(!empty($user->video_gallery))
          <div class="service-video">
              <div class="carousel_container">
                  <div class="carousel_slides">
                      <slick dots="false" infinite="false" speed=300 slides-to-show=1
                              touch-move="false" slides-to-scroll=1 class="slider one-time"
                              responsive="[{breakpoint: 990, settings: {slidesToShow: 1}}, {breakpoint: 768,settings: {slidesToShow: 1}}, {breakpoint: 480,settings: {slidesToShow: 1}}]">

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
@include('frontend.includes.sclistingslider')

<!------------END : Deals Block------------>    
<!------------START : Members Slider Block------------>
<div class="container">
    <div class="members-slider">

        <?php
        $teams = App\Team::where('owner_id', $_GET['id'])->get();
        if(count($teams) > 0):
        ?>



        <div class="carousel_container team-profile">
            <!--First column-->
            <div class="carousel_slides">
                <slick dots="false" infinite="true" speed=300 slides-to-show=4 touch-move="false"
                       slides-to-scroll=1 slick-slide="false" class="slider one-time"
                       responsive="[{breakpoint: 990, settings: {slidesToShow: 4}}, {breakpoint: 768,settings: {slidesToShow: 2}}, {breakpoint: 480,settings: {slidesToShow: 1}}]">
<?php foreach($teams as $team): ?>
                    <div class="col-lg-3 col-sm-3 col-md-6 mb-r team-block">

                        <div class="avatar">
                            <?php
                            $assetinfo = \DB::table('assets')->where(array('id' => $team->image_id))->get();
                            if (!empty($assetinfo)) {
                            $assetinfo = $assetinfo[0];
                            $profile_pic = $assetinfo->path . $assetinfo->name;
                            } else {
                            $profile_pic = 'images/user_pic.jpg';
                            }
                            ?>
                            <a data-toggle="modal" data-target="#teamModal" style="text-decoration: none;" class="team-about" data-about="{{$team -> about}}" data-name="{{$team -> member_name}}" data-designation="{{$team -> designation}}">
                                <img width="200" height="200"src="{{$profile_pic}}"class="rounded-circle profile-image" ></a>

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
    <h3 class="text-center text-heading">Map of Stylerzone Partners</h3>

    <div class="profile-map">
        @if(isset($user->userBusiness->latitude))
        <?php
        $location = json_encode(
        [
        'latitude' => $user->userBusiness->latitude,
        'longitude' => $user->userBusiness->longitude,
        'state' => $user->userBusiness->state,
        'name' => $user->userBusiness->business_suburb,
        'postcode' => $user->userBusiness->postcode
        ]
        );
        ?>
        <location-map location-info="{{ $location}}"></location-map>
        @endif
    </div>                   


</div>
<!------------END : Map Block------------>
<!------------START : Latest Reviews Block------------>


<latest-reviews user='{{$user_id}}'  bind-to-window="true" ></latest-reviews>
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

    $(document).ready(function () {
    $('[data-fancybox="gallery"]').fancybox({});
    $('#lightSlider').lightSlider({
        gallery: false,
        item: 3,
        loop: true,
        slideMargin: 0,
        thumbItem: 9
    });
    });</script>
<script type="text/javascript">

    function openGallaySlider() {
    $('.slick-track').each(function () { // the containers for all your galleries
    $(this).magnificPopup({
    delegate: 'a', // the selector for gallery item
            type: 'image',
            gallery: {
            enabled: true
            }
    });
    });
    }
</script>
<script>
    function getUserData() {
    FB.api('/me', {locale: 'en_US', fields: 'name, email'}, function (response) {
    console.log('Successful login for: ' + response);
    $("#fb_portion").css("display", "none");
    var data = response.name.split(" ");
    $('#rating_first_name').val(data[0]);
    $('#rating_last_name').val(data[1]);
    $('#rating_email').val(response.email);
    });
    }

    window.fbAsyncInit = function () {
    //SDK loaded, initialize it
    FB.init({
    appId: '<?php echo env('FACEBOOK_CLIENT_ID') ?>',
            xfbml: true,
            version: 'v2.8'
    });
    };
//load the JavaScript SDK
    (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
    return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0&appId=696604057079970&autoLogAppEvents=1";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    window.onload = function () {
//add event listener to login button
    document.getElementById('loginBtn').addEventListener('click', function () {
    //do the login
    FB.login(function (response) {
    if (response.authResponse) {
    //user just authorized your app
    document.getElementById('loginBtn').style.display = 'none';
    getUserData();
    }
    }, {scope: 'email,public_profile', return_scopes: true});
    }, false);
    }
</script>
<script type="text/javascript">
    var operating_hours = JSON.parse('<?php echo json_encode($user->UserBusiness->operating_hours); ?>');
    var html = '';
    $.each(operating_hours, function (i, val) {
    if (val.open != "") {
    html += '<div class="mt-15 px-10">' + '<h4>'+  i.substr(0, 3) +'</h4>' + '<div class="mt-5">'+ moment(val.open).format('hh:mm A') +'</div>' + '<div class="mt-5">' + moment(val.close).format('hh:mm A') +'</div>' + '</div>'
    } else {
    html += '<div class="">' + i.substr(0, 3) + '</div><div class="">Closed</div></div>'
    }
    });
    $('.opening-hours-time').html(html);
    $(".team-about").click(function(){
    $('.display-team-about').text($(".team-about").attr("data-about"));
    $('.display-team-name').text($(".team-about").attr("data-name"));
    var designation = $(".team-about").attr("data-designation");
    if (designation != "")
            $('.display-team-designation').text('(' + designation + ')');
    });

</script>
@endsection