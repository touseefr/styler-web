@section('after-styles-end')
<style type="text/css">    
    .fb_dialog { 
        bottom: 67px !important;
        right: 6px !important;
    }
    .fb_dialog iframe {
        right:0px !important;
    }
</style>
@endsection
@section('after-scripts-end')
@if($records[0]['user']['UserBusiness']->facebook_page_id && $records[0]['user']['UserBusiness']->facebook_app_id)
<div class="fb-customerchat" attribution=setup_tool page_id="<?php echo $records[0]['user']['UserBusiness']->facebook_page_id; ?>" theme_color="#58bcb9"></div>
<script>
    window.fbAsyncInit = function () {
        FB.init({
            appId: '<?php echo $records[0]['user']['UserBusiness']->facebook_app_id; ?>',
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
</script>
@endif
@endsection

@extends('frontend.layouts.account') @section('content')
@foreach ($records as $index =>$item)

@include('frontend.listing.listingtop', array('index' => $index, 'item' => $item))
<div class="clear"></div>
<latest-reviews user='{{$item->user_id}}'  bind-to-window="true" ></latest-reviews>
<!--bg_gray-->
@endforeach
@if(!count($records))
<div style="text-align: center;padding: 30px;font-size: 18px;font-weight: bold;">No Record Found</div>
@endif
<!--home_review-->
@endsection('content')
