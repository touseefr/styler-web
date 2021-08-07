<style type="text/css">
    .se-pre-con2 {position: fixed;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 9999;background: url({{url("images/spinner.gif")}}) center no-repeat #fff;background-color: rgba(0,0,0,0.9);background-size: 240px;}
</style>
<div class="se-pre-con2" style="display: none;">
    <div class="show-text-booking-wait">
        <p>Please wait we are sending you deal details via email.</p>
    </div>    
</div>

@extends('frontend.layouts.account')
@section('content')
@section('after-styles-end')
<link rel="stylesheet" href="{{url('../new_assets/lightslider/lightslider.min.css')}}" />
@endsection


@foreach($record as $user)

<div class="booking-b1">
    <div class="container">
        <div class="row flex">
            <div class="col-md-4 col-xs-12 col-sm-12 jssor-slider-box-size">
                <!-- @if(isset($user->gallery) && count($user->gallery)>0)
                <div class="demo">
                    <ul id="lightSlider">
                        @foreach($user->gallery as $k =>$item)
                        <li data-fancybox="gallery"  href="{{$item['image_path']}}{{$item['image_org']}}" data-thumb="{{$item['image_path']}}{{$item['image_name']}}">
                            <img src="{{$item['image_path']}}{{$item['image_name']}}" />
                        </li>
                        @endforeach
                    </ul>
                </div>
                @endif --> 
                <div class="sliderHeightFix">
                    @if(isset($user->gallery) && count($user->gallery)>0)        
                    <div class="slickNormalAdaptive">
                        @foreach($user->gallery as $k =>$item)
                        <img data-fancybox="gallery" href="{{$item['image_path']}}{{$item['image_org']}}" data-thumb="{{$item['image_path']}}{{$item['image_name']}}" src="{{$item['image_path']}}{{$item['image_name']}}" />
                        @endforeach
                    </div>
                    @endif        
                </div>
            </div>
            <div class="col-md-6 pb-50">
                <div class="booking-r2-c1">   
                    <h1>{{($user->userBusiness)?$user->userBusiness-> business_name:''}}</h1>
                    @if($user->userBusiness)
                    <p><?php echo html_entity_decode($user->userBusiness->about) ?></p>
                    @endif
                    @if($user->userInfo)
                    <p><?php echo html_entity_decode($user->userInfo->about); ?></p>
                    @endif
                    <a data-toggle="modal" data-target="#UserDescription">Read more</a>
                    <!-- Modal -->
                    <div id="UserDescription" class="modal fade" role="dialog">
                        <div class="modal-dialog">

                            <!-- Modal content-->
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Detail</h4>
                                </div>
                                <div class="modal-body">
                                    @if($user->userBusiness)
                                    <p><?php echo html_entity_decode($user->userBusiness->about); ?></p>
                                    @endif
                                    @if($user->userInfo)
                                    <p> <?php echo html_entity_decode($user->userInfo->about); ?></p>
                                    @endif
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>                
            </div>
            <div class="col-md-2 map-container">
                <div class="booking-c3-r1">
                    <div class="profile-stars mt-10px-imp" ng-init="rate = {{$user -> rating}}">
                        <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating font-size-rating"></uib-rating>
                    </div>
                    @if(!Auth::id())
                    <div widget-rating userto="{{$user -> id}}" userfrom="0" businesstitle="{{$user -> userbusiness -> business_name}}"/></div>
                @endif             
                <span>{{ count($user -> ReviewTo)}}  Reviews</span>
            </div>
            <div class="booking-c3-r2">

            </div>
            <div class="booking-c3-r3">
                <p>{{$user -> UserBusiness -> business_address.' '.$user -> UserBusiness -> business_suburb.' '.$user -> UserBusiness -> state}}</p>                 
                <div style='clear:both;'></div>

                <div style='display: block;width: 100%;height: 173px;'>                    
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
                    <location-map location-info="{{$location}}"></location-map>
                    @endif
                </div>
            </div>

        </div>

    </div>
    <?php
                if (isset($user->UserBusiness->operating_hours)) {?>
    <div class="row">
        <div class="opening-hours-r1">
            <h1>OPENING HOURS</h1>
        </div>
        <div class="opening-hours-r2">
            <ul>
                <?php               
                    foreach ($user->UserBusiness->operating_hours as $key => $values) {
                        ?>
                        <li>
                            <div class="opening-hours-r2-text <?php echo ($key == strtolower(date('l'))) ? 'opening-hours-r2-text-active' : ''; ?>">
                                <a>{{strtoupper($key)}}</a>
                            </div>
                            <div class="opening-hours-r2-hours <?php echo ($key == strtolower(date('l'))) ? 'opening-hours-r2-hours-active' : ''; ?>">
                                @if(isset($values->holiday) && $values->holiday==1)
                                <a>
                                    <span id='openhours'><?php echo date('h:i A', strtotime('+5 hours', strtotime($values->open))); ?></span>-                                    
                                    <span id='openhours'><?php echo date('h:i A', strtotime('+5 hours', strtotime($values->close))); ?></span>
                                </a>
                                @else
                                <a>
                                    Close
                                </a>
                                @endif
                            </div>  
                        </li>
                        <?php
                    }                
                ?>
            </ul>
        </div>

    </div>  
        
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4 border-row"></div>
        <div class="col-md-4"></div>

    </div>
         <?php }
                ?>
    <div class="row">
        <div class="opening-hours-r1">
            <h1>POPULAR SERVICE</h1>
        </div>
        <div class="popular-service-r2 ">
            <div class="carousel_container"> 
                <!--  <div class="carousel_slides account_listing">
                      <slick  >-->

                <?php
                if (count($user['popularServices']) > 0) {
                    ?>
                    <ul id='responsive'>
                        <?php
                        foreach ($user['popularServices'] as $pop_ser) {
                            $pop_ser['desc'] = htmlspecialchars($pop_ser['desc'], ENT_QUOTES);
                            ?>
                            <li>
                                <div class="popular-service-r2-h1 text-truncate">
                                    <a>{{$pop_ser['title']}}</a>
                                </div>
                                <div class="popular-service-r2-time">
                                    <p><span><i class="far fa-clock"></i>&nbsp;</span> {{$pop_ser['duration']}} MIN</p>
                                    <p><span><i class="fas fa-dollar-sign"></i>&nbsp;</span>{{number_format((float)$pop_ser['price'], 2, '.', '')}}</p>
                                </div>  
                                <div class="popular-service-r2-button bookNowBtn">
                                    <button class="btn-booking btn-add-cart btn-block btn-green-1" service-id="{{$pop_ser['id']}}" data-service='<?php echo json_encode($pop_ser); ?>'>BOOK NOW</button>
                                    <button class="btn-default mt-0 btn-block btn-remove-item btn-green-3" service-id="{{$pop_ser['id']}}" data-service='<?php echo json_encode($pop_ser); ?>' where-from="1" style="display:none;">REMOVE</button>
                                </div>
                            </li>
                            <?php
                        }
                        ?>
                    </ul>
                    <?php
                } else {
                    ?>
                    <div class='well text-center'>No Popular Service Available</div>
                <?php } ?>


                <!--</slick>-->
            </div>            
            <!--</div>-->          
        </div>
    </div>
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4 border-row"></div>
        <div class="col-md-4"></div>                    
    </div>
    <div class="row" >
        <!--        <div class="opening-hours-r1">
                    <h1>POPULAR SERVICE 02</h1>
                </div>-->
        <div class="container pop-service-02">
            <?php
            if (count($user['business_services']) > 0) {
                foreach ($user['business_services'] as $pop_ser) {
                    $pop_ser['desc'] = htmlspecialchars($pop_ser['desc'], ENT_QUOTES);
                    ?>
                    <div class="d-flex">
                        <div class="headingArea">
                            <div class="pop-service-02-rows-c1"><h4>{{$pop_ser['title']}}</h4></div>
                            <div class="pop-service-02-rows-c2"><i class="far fa-clock"></i> {{$pop_ser['duration']}} min</div>
                            <div class="pop-service-02-rows-c3"><i class="fas fa-dollar-sign"></i> {{number_format((float)$pop_ser['price'], 2, '.', '')}}</div>
                        </div>
                        <div class="pop-service-02-rows-c5">
                            <button class="btn-booking btn-add-cart btn-green-1" service-id="{{$pop_ser['id']}}" data-service='<?php echo json_encode($pop_ser); ?>'>BOOK NOW</button>
                            <button class="btn-default btn-block  btn-remove-item btn-green-3" service-id="{{$pop_ser['id']}}" data-service='<?php echo json_encode($pop_ser); ?>' where-from="1" style="display:none;">REMOVE</button>
                        </div>
                    </div>                    
                    <?php
                }
            } else {
                ?>
                <div class='well text-center'>No Service Available</div>
            <?php } ?>          

        </div>
    </div>
</div>
</div>

@endforeach
@endsection
@section('after-scripts-end')
<script src='{{url('../new_assets/lightslider/lightslider.min.js')}}'></script>
<link rel="stylesheet" type="text/css" href="{{url('../new_assets/fancy/jquery.fancybox.min.css')}}">
<script src="{{url('../new_assets/fancy/jquery.fancybox.min.js')}}"></script>
<script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
<script type="text/javascript">
  $(document).ready(function () {
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
            prevArrow:"<button type='button' class='slick-prev pull-left'><img src='../../../../new_assets/images/images/pre.png' width='8' alt='Prev'/></button>",
            nextArrow:"<button type='button' class='slick-next pull-right'><img src='../../../../new_assets/images/images/next.png' width='8' alt='Next'/></button>"
            /* prevArrow:"<a href='javascript:;'><img src='../../../../new_assets/images/images/pre.png' alt='Prev'/></a>",
            nextArrow:"<a href='javascript:;'><img src='../../../../new_assets/images/images/next.png' alt='Next'/></a>" */
    });
  });
</script>
<script type="text/javascript">
    var BusinessId = '<?php echo $userid; ?>';
    /*
     * Global variable for handling cart items price
     * 
     */
    var itemsPrice = 0;
    /*
     * Global variable for handling Employee info
     * 
     */
    var employees = <?php echo GuzzleHttp\json_encode($record[0]->employee); ?>;
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
    console.log(site_url);</script>
<script src="{{url('new_assets/js/booking/booking.js')}}"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
<div class="cart-bottom">    
    <div class="box">
        <div class="info-box">
            <p><span class="numberofitems">0</span> service $<span class="totalprice">45.00</span></p>
            <p>you can add more or continue</p>
        </div>
        <div class="button">
            <button class="btn btn-outline-secondary btn-cart" type="button">CHOOSE TIME</button>
        </div>
    </div>
    <!--    <div class="cart-bottom-c1 col-md-9">
            <p><span class="numberofitems">0</span> service $<span class="totalprice">45.00</span></p>
            <p class="mb-0">you can add more or continue</p>
        </div>
        <div class="cart-bottom-c3 col-md-3 text-right">
            <button type="button" class="btn-cart btn-primary btn-lg">CHOOSE THEME</button>        
        </div>    -->
</div>
<div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog modal-lg">
        <!-- Modal content-->
        <div class="modal-content">

            <div class="col-xs-12 col-md-12">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <a href="javascript:;" class="close bookingclose" data-dismiss="modal">×</a>
                        <h3 class="dottedBorder pb-20 mb-0">Your Booking</h3>
                        <div id="tbl-show-items">
                        </div>
                        <div class="well py-15">
                            <div class="row">
                                <div class="col-xs-8 col-md-10">
                                    <h5 class="text-uppercase">Total</h5>
                                </div>
                                <div class="col-xs-4 col-md-2 h5">$<span id="totalprice">00.00</span></div>
                            </div>
                        </div>
                        <div class="addService">
                            <a href="javascript:;" class="add-service" data-dismiss="modal">+ Add another service</a>
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
                        <div class="col-md-12" style="margin-top: 15px;">
                            <p style="text-align: center;">Services and prices are subject to change without notice. Please contact the
                                merchant to confirm.</p>
                        </div>
                        <button class="btn btn-block btn-book btn-green-1" id="btn-book-now">Book Now</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
<div id="booking" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header bg-green">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Booking Detail</h4>
            </div>
            <form id="frm_book_deal" name="frm_book_deal"  >
                <div class="modal-body">                                        
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
                    <input  type="submit" class="btn btn-default btn-green-1" id="save_service_booking" value="Save Booking" />
                    <button type="button" class="btn    btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </form>
        </div>

    </div>
</div>
@endsection