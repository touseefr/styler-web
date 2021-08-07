@section('after')
<script src="{{url('js/jquery.bxslider.min-4.12.js')}}"></script>
<script type="text/javascript">
var slid;
$(document).ready(function () {
//----- OPEN
    $('.dealsslider').bxSlider({
        infiniteLoop: true,
        maxSlides: 1,
        adaptiveHeight: true,
        slideMargin: 20,
        auto: true,
    });

    if ($(window).width() < 600) {
        slid = $('.bxslider').bxSlider({
            infiniteLoop: true,
            maxSlides: 1,
            adaptiveHeight: true,
            slideMargin: 20,
            auto: true,
        });
    }
    $(window).resize(function () {
        if ($(window).width() < 600) {
            if (typeof slid === "undefined") {
                slid = $('.bxslider').bxSlider({
                    infiniteLoop: true,
                    maxSlides: 1,
                    adaptiveHeight: true,
                    slideMargin: 20,
                    auto: true,
                });
            } else {
                slid.reloadSlider();
            }
        }
    });
});
</script>
@endsection
@section('after-scripts-end')
<div class="fb-customerchat" attribution=setup_tool page_id="<?php echo env('FACEBOOK_page_id') ?>" theme_color="#58bcb9"></div>
<script>
    window.fbAsyncInit = function () {
        FB.init({
            appId: '<?php echo env('FACEBOOK_application_id') ?>',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v5.0'
        });
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    var locations =<?php echo json_encode($allbusiness) ?>;
</script>
<script src="http://maps.google.com/maps/api/js?key=AIzaSyBgUoek8OLWNtu9y2IB0GRSZDcK4OCi4R4" type="text/javascript"></script>

<script type="text/javascript">
window.onload = function () {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(-33.92, 151.25),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    var locations = <?php echo json_encode($allbusiness) ?>;    
    for (i = 0; i < locations.length; i++) {        
        marker = new google.maps.Marker({            
            position: new google.maps.LatLng((locations[i]['latitude']), locations[i]['longitude']+i),
            map: map
        });
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                var content = '<a href="/profile?id=' + btoa(locations[i].user_id) + '" class="serivce_provider_name">' + locations[i].business_name + '</a>';
                var rating = parseFloat(locations[i].rating);
                var numStars = 5;
                var fullStar = new Array(Math.floor(rating + 1)).join('<i class="glyphicon glyphicon-star"></i>');
                var halfStar = '';
                if ((rating % 1) >= 0.5) {
                    halfStar = '<i class="glyphicon  glyphicon-star"></i>';
                } else if ((rating % 1) != 0) {
                    halfStar = '<i class="glyphicon glyphicon-star-empty"></i>';
                }
                var noStar = new Array(Math.floor(numStars + 1 - rating)).join('<i class=" glyphicon glyphicon-star-empty"></i>');
                content += '<div class="stars"><div class="text">Rating : </div> ' + fullStar + halfStar + noStar + '</div>';
                content += '<div class="text-left"><a class="btn btn-orange-1 text-uppercase" href="/booking/' + btoa(locations[i].user_id) + '" >Book Now</a></div>';
                infowindow.setContent(content);
                infowindow.open(map, marker);
            }
        })(marker, i));
        bounds.extend(marker.position);
    }

    map.fitBounds(bounds);
};</script>
<!------------START : Map Block------------>
@endsection
@section('after-styles-end')
<link href="{{URL('/new_assets/images/banner-bg.jpg')}}" rel="preload" as="image">
<style type="text/css">
    .fb_dialog {
        right: 5pt !important;
        bottom: 52pt !important;
        background: transparent !important;
    }
    .fb_dialog iframe {
        bottom: 70px !important;
        right: -5px !important;
    }
</style>
@endsection
@extends('frontend.layouts.account') 
@section('content')
@include('frontend.includes.main_header')
@include('frontend.includes.customerandbusiness')
@if(!Auth::check())
@include('frontend.includes.register_categories')
@endif
@include('frontend.includes.listingslider')
@include('frontend.includes.gallery_mobile')
@include('frontend.includes.gallery')
@include('frontend.includes.homemap')
@include('frontend.includes.latestreviews')
@include('frontend.includes.businessreview')
@include('frontend.includes.sponcerslider')
@endsection()

