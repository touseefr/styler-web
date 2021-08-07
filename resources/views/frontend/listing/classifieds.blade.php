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
<div class="fb-customerchat" attribution=setup_tool page_id="<?php echo $records[0]['user']['UserBusiness']->facebook_page_id;?>" theme_color="#58bcb9"></div>
<script>
    window.fbAsyncInit = function() {
    FB.init({
    appId            : '<?php echo $records[0]['user']['UserBusiness']->facebook_app_id; ?>',
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
@endif
@endsection
@extends('frontend.layouts.account') @section('content')
<?php function get_time_ago( $time )
{
    $time_difference = time() - $time;

    if( $time_difference < 1 ) { return 'less than 1 second ago'; }
    $condition = array( 12 * 30 * 24 * 60 * 60 =>  'year',
                30 * 24 * 60 * 60       =>  'month',
                24 * 60 * 60            =>  'day',
                60 * 60                 =>  'hour',
                60                      =>  'minute',
                1                       =>  'second'
    );

    foreach( $condition as $secs => $str )
    {
        $d = $time_difference / $secs;

        if( $d >= 1 )
        {
            $t = round( $d );
            return 'about ' . $t . ' ' . $str . ( $t > 1 ? 's' : '' ) . ' ago';
        }
    }
}?>

<!--container-->

<?php //print_r($records);?>
@foreach ($records as $index =>$item)

@include('frontend.listing.listingtop', array('index' => $index, 'item' => $item))



<div class="clear"></div>

<!--bg_gray-->
<div class="clear"></div>
<latest-reviews user='{{$item->user_id}}'  bind-to-window="true" ></latest-reviews>
<!--home_review-->
@endforeach
@if(!count($records))
<div style="text-align: center;padding: 30px;font-size: 18px;font-weight: bold;">No Record Found</div>
@endif

@endsection('content')
