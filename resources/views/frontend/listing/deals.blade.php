@section('after-styles-end')
{!! HTML::style('css/magnific.css' ) !!}
{!! HTML::style('new_assets/css/toastr.min.css' ) !!}
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
{!! HTML::script('new_assets/js/js.cookie.min.js') !!} 
{!! HTML::script('new_assets/js/deal_booking.js') !!} 
{!! HTML::script('new_assets/js/booking/booking.js') !!} 
{!! HTML::script('new_assets/js/toastr.min.js') !!} 
<script type="text/javascript">
    var BusinessId = '{{$records[0]->user_id}}';
    /*
     * Global variable for handling cart items price
     * 
     */
    var itemsPrice = 0;
    /*
     * Global variable for handling Employee info
     * 
     */
       
    var employees = <?php echo GuzzleHttp\json_encode($employees[0]->employee); ?>;
    /*
     * Global variable for handling Employee data for week
     * 
     */
    var week_no = 0;
    /*
     * Global variable for handling Available slots
     * 
     */
    var employees_available_slots = 0;
    /*
     * Global variable for counting Dates
     * 
     */
    var dates_present = 0;
    /*
     * Global variable for counting Dates
     * 
     */
    var site_url = "{{URL('/')}}";
    
    /*
     *  Deal Information
     */
    var deal_info=JSON.parse('<?php echo GuzzleHttp\json_encode(array("id"=>$records[0]->id,"title"=>htmlspecialchars($records[0]->title,ENT_QUOTES),"desc"=> htmlspecialchars($records[0]->description,ENT_QUOTES),"price"=>$records[0]->price,"discount"=>$records[0]->discount)); ?>');
    var duration =<?php echo $records[0]->duration; ?>;
</script>

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
@section('after')
@if(!Auth::check())
<style type="text/css">
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>
<div id="booking" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header background-color-green">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Book Deatil</h4>
            </div>
            <form id="frm_book_deal" name="frm_book_deal" action="post" method="">
                <div class="modal-body">                    
                    <input type="hidden" name="listing_id" value="{{$records[0]->id}}"/>
                    <div class="row">
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <label for="fname">First Name:</label>
                                <input type="text" class="form-control" id="fname" name="fname" required="true" />

                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                            <div class="form-group">
                                <label for="lname">Last Name:</label>
                                <input type="text" class="form-control" id="lname" name="lname" required="" />

                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <label for="email">Email address:</label>
                                <input type="email" class="form-control" id="email" name="uemail" required="" />                           
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 col-md-12">
                            <div class="form-group">
                                <label for="contact_number">Contact:</label>
                                <input type="number" class="form-control" id="contact_number" name="contact_number" required="" />                           
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <a href="{{URL::to('auth/login')}}" style="float: left;line-height: 31px;margin-left:15px;color: #4abdac;text-decoration: underline !important;">Already have account.</a>
                    <input  type="submit" class="btn btn-default btn-green-1" id="save_deal_booking" value="Save Booking" />
                    <button type="button" class="btn    btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </form>
        </div>

    </div>
</div>
@endif
<div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog modal-lg">
        <!-- Modal content-->
        <div class="modal-content">

            <div class="col-xs-12 col-md-12">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <a href="javascript:;" class="close" data-dismiss="modal">×</a>
                        <h3 class="dottedBorder pb-20 mb-0">Your Booking</h3>
                        <div id="tbl-show-items">

                        </div>
                        <div class="well py-15" style="padding-top: 10px;padding-bottom: 0px;">
                            <div class="row">
                                <div class="col-xs-8 col-md-10">
                                    <h5 class="text-uppercase">Total</h5>
                                </div>
                                <div class="col-xs-4 col-md-2 h5" style="padding-top: 0px;margin-top: 0px;">$<span id="totalprice" style="font-weight: bolder;">00.00</span></div>
                            </div>
                        </div>
                        <div class="dropdown">
                            <div class="select">
                                <select id="year" class="custom_select"> 

                                </select>
                            </div>
                        </div>
                        <div class="calendarOptions">
                            <div class="row">
                                <div class="col-xs-2 text-center">
                                    <a href="javascript:;" class="arrows arrowLeft" onclick="prev()" id="prev_arrow">‹</a>
                                </div>
                                <div class="col-xs-8 text-center"><h5 ><span id="btn-prsent-month">September 2018</span></h5></div>
                                <div class="col-xs-2 text-center">
                                    <a href="javascript:;" class="arrows arrowRight" onclick="nxt()" id="nex_arrow">›</a>
                                </div>
                            </div>
                            <!--class="day current"-->
                            <div class="daysWrapper">
                                <div id="days">                                   
                                </div>
                            </div>
                            <div id="availableSlots" class="availableSlots"> 


                            </div>
                        </div>
                        <button class="btn btn-block btn-book btn-green-1" id="btn-book-now">Book Now</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection

@extends('frontend.layouts.account') @section('content')
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
<!--container-->
@foreach ($records as $index =>$item)

@include('frontend.listing.listingtop', array('index' => $index, 'item'=> $item))
<!--bg_gray-->

<div class="clear"></div>
<!--bg_gray-->
<div class="clear"></div>

<!--bg_gray-->
<div class="clear"></div>
@if(count($similardeals)>0)
<div class="">
    <section class="container text-center">
        <h1 class="similartext">Similar Deals</h1>
    </section>
</div>
<section>
    <div class="container">
        <div class="row">
            <div class="carousel_container">
                <!--<h2>Similar Deals</h2> -->
                <div class="carousel_slides deal_veiw_slider">
                    <slick dots="false" infinite="false" speed=300 slides-to-show=4 touch-move="false" slides-to-scroll=1 class="slider one-time" responsive="[{breakpoint: 990, settings: {slidesToShow: 3}}, {breakpoint: 768,settings: {slidesToShow: 2}}, {breakpoint: 480,settings: {slidesToShow: 1}}]">
                        
                        @foreach($similardeals->toArray() as $deal)                                                
                        
                        <div class="col-md-3 col-sm-3 col-md-3 col-xs-12">
                            <h6>
                                <i><img src="images/deal_icon.jpg" alt="" /></i>
                                <a href="{{ route('frontend.listing.getdeals', array('id' => base64_encode($deal['id']))) }}">{{$deal['title']}}</a>
                            </h6>
                            @if(count($deal['assets'])>0)
                            <figure>
                                <a href="{{ route('frontend.listing.getdeals', array('id' => base64_encode($deal['id']))) }}"><img src="{{$deal['assets'][0]['path']}}{{$deal['assets'][0]['name']}}" alt="Deal Image" /></a>
                            </figure>
                            @endif
                            <div class="date_time">
                                <span class="date">{{date('M d Y',strtotime($deal['created_at']))}}</span>
                                <span class="time show_review">Reviews {{$deal['views']}}</span>
                            </div>
                        </div>
                        @endforeach
                        
                    </slick>
                </div>
            </div>

        </div>
    </div>
</section>
@endif
<div class="clear"></div>
<latest-reviews user='{{$item->user_id}}'  bind-to-window="true" ></latest-reviews>
@endforeach
@if(count($records)==0)
<div style="text-align: center;padding: 30px;font-size: 18px;font-weight: bold;margin-top: 55px;min-height: 292px;">No Record Found</div>
@endif

<!--populer_search-->
@endsection('content')



