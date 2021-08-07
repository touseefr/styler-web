@extends('frontend.layouts.account')
@section('content')


<div class="sr_header">
    <div widget-search-old  categories="{{$service_categories}}"   id="ex2"  placeholder="Search Listing" ishome="true" pause="300" selectedobject="" datafield="results" titlefield="title" descriptionfield="title" class="searchBar"></div>
</div>
<div class="search_pg_tabs padd0">
  <div class="container padd0 " style="width:100%;">
    <span class="spinnerInner" us-spinner spinner-theme="inline" spinner-key="global_spinner_sab">
      <div class="spinner_overlay" style="background-color: #fff;">
        <img src="images/spinner.gif" alt="Loading" class="" width="124" class="img-show-spinner"/>
      </div>
    </span>
  </div>
</div>
<div class="search_pg_tabs padd0">
   <div class="container padd0 " style="width:100%;">
       <div class="show-spinner">
           <img src="images/spinner.gif" alt="Loading" class="" width="124" />
       </div>
       <div resize-search widget-search-result  servicecats="{{$service_categories}}" id="ex5" query="{{Request::getQueryString()}}" plan="{{(Auth::check() && isset(Auth::user()->UserSubscription[0]))?Auth::user()->UserSubscription[0]->plan_type:0}}" class="pg-listing-search-tabs " >
       </div>
       <span class="spinnerInner" us-spinner spinner-theme="inline" spinner-key="global_spinner_ab">
           <div class="loaderWrap">
               <img src="images/spinner.gif" alt="Loading" class="" width="124" />
           </div>
       </span>
   </div>
</div>

@include('frontend.includes.latestreviews')

@include('frontend.includes.businessreview')

<!--@include('frontend.includes.sponcerslider')-->

@endsection('content')
@section('after-scripts-end')
{!! HTML::script('js/profile.js') !!}
<div class="fb-customerchat" attribution=setup_tool page_id="<?php echo env('FACEBOOK_page_id')  ?>" theme_color="#58bcb9"></div>
<script>
    window.fbAsyncInit = function() {
    FB.init({
    appId            : '<?php echo env('FACEBOOK_application_id')  ?>',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v5.0'
    });
    };
    (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
</script>
@endsection
@section('after-styles-end')
<style type="text/css">
    #scroll {
        right: 26px !important;
    }
    .fb_dialog {
    /*        right: 5pt !important;*/
            bottom: 52pt !important;
            background: transparent !important;
        }
    .fb_dialog iframe {
        bottom: 70px !important;
    }
</style>
@endsection
