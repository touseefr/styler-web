@section('after-styles-end')
{!! HTML::style('css\magnific.css' ) !!}
@endsection

<section class="bg_gray border_top" style="padding-bottom: 35px;padding-top: 50px;">

    <div class="image-gallary-wrap ">

        @if($item->assets && count($item->assets))
        <div class="parent-container">
            @foreach($item->assets as $k => $asset)
            @if(File::exists(public_path().$item->assets[$k]['path'].$item->assets[$k]['name']))
            <?php
            if ($k == 0) {
                $style = 'style="display: block"';
            } else {
                $style = 'style="display: none"';
            }
            ?>
            <div class="bannerUpload">
                <div class="uploadIcon">
                    <a class="image-gallery-popup1 bgallerysize1" onclick="openGallaySlider()" href="{{$item -> assets[$k]['path']}}{{$item -> assets[$k]['name']}}">
                        <img id="myImage{{$k}}" <?php echo $style; ?> src="{{$item -> assets[$k]['path']}}{{$item -> assets[$k]['name']}}" alt="Gallery Image" />
                    </a>
                </div>
            </div>
            <!--            <a class="image-gallery-popup bgallerysize" onclick="openGallaySlider()" href="{{$item -> assets[$k]['path']}}{{$item -> assets[$k]['name']}}">
                            <img class="" id="myImage{{$k}}" <?php echo $style; ?> src="{{$item -> assets[$k]['path']}}{{$item -> assets[$k]['name']}}" alt="" width="100%" height="350" />
                        </a>-->
            @endif
            @endforeach
        </div>
        @else
        <div class="parent-container">
            <div class="bannerUpload mt-0f">
                <div class="uploadIcon">
                    <img src="images/listing-pg-banner.png" alt="" class="center-block" />
                </div>
            </div>
        </div>
        @endif
        @if($item->status == 0)
        <div class="sold_out">Sold Out</div>
        @endif


        <div class="toolbar-wrap">
            <ul class="gallery-toolbar">
                <li class="parent-container-icon" style="display:none;">


                    @foreach($item->assets as $k => $asset)
                    @if(File::exists(public_path().$item->assets[$k]['path'].$item->assets[$k]['name']))
                    <?php
                    if ($k == 0) {
                        $style = 'style="display: block"';
                    } else {
                        $style = 'style="display: none"';
                    }
                    ?>
                    <a class="f-icon" onclick="openGallaySliderIcon()" href="{{$item -> assets[$k]['path']}}{{$item -> assets[$k]['name']}}">
                        <img id="myImage{{$k}}" <?php echo $style; ?> src="images/camera-32.png" alt="Contact" title="click to watch images">
                        <span class="copy">{{count($item -> assets)}}</span></a>
                    @endif
                    @endforeach

                </li>
                <li>
                <addto-watch class="f-icon" id="{{$item -> id}}" type="Business"></addto-watch>
                </li>

                <li class="parent-container-icon">
                    @if(!empty($item->listing_video))
                    <a class="f-icon video" onclick="openGallaySliderIcon()" href="{{$item -> listing_video}}">
                        <img src="images/movie-camera.png" alt="Contact" title="Video">
                    </a>
                    @endif

                </li>
                <li>

                </li>

            </ul>
        </div>
    </div>



    <div class="container">

        <div class="row">
            <div class="col-md-8">

                <div class="listing-features-wrap">
                    <div class="row">
                        <div class="col-xs-12 col-sm-6">
                            <h4 class="title_h4">{{ $item -> title}}</h4>
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
                        {{-- <span>{{ \Carbon\Carbon::createFromTimeStamp(strtotime($item->created_at))->diffForHumans() }}</span>
                                @if(isset($item->locations[0]))
                        <span>{{ $item -> locations[0] -> name}},{{ $item -> locations[0] -> state}}</span>
                        @endif --}}

                    </div>
                    <div class="col-xs-12 col-sm-6 listing-features">
                        <span class="listing-feature-icon">
                            <img src="images/money-bag-24.png" alt="Price" title="Price">
                            <span class="amount">
                                @if(!empty($item->price))
                                ${{ $item -> price}}
                                @else
                                POA
                                @endif
                            </span>
                            <span class="copy">
                                Price
                            </span>
                        </span>

                        <span class="listing-feature-icon">
                            <img src="images/price-24.png" alt="per week Turnover" title="per week Turnover">
                            <span class="amount">
                                @if(!empty($item->turnover))
                                {{ $item -> turnover}}
                                @else
                                POA
                                @endif
                            </span>
                            <span class="copy">
                                pw Turnover
                            </span>
                        </span>

                        <span class="listing-feature-icon">
                            <img src="images/wallet.png" alt="per week Rent" title="per week Rent">
                            <span class="amount">
                                @if(!empty($item->rent))
                                ${{ $item -> rent}}
                                @else
                                POA
                                @endif
                            </span>
                            <span class="copy">
                                pw rent
                            </span>
                        </span>

                        <span class="listing-feature-icon">
                            <img src="images/area.png" alt="Area" title="Area">
                            <span class="amount">
                                {{ $item -> area}}
                            </span>
                        </span>

                        <span class="listing-feature-icon">
                            <div class="below_image_bar_small_text" >
                                Views:{{count($item -> listingViews)}}<br>
                                Watchlist: {{count($item -> listingWatch)}}
                            </div>
                        </span>

                    </div>
                </div>
            </div>

            <div class="disc-block-wrap">
                <div class="pt-15 mb-20">
                    <div class="disc-block trix-content">
                        <h4 class="paragraph-padding mt-15">Description</h4>
                        <hr class="mt-5 mb-5 hr-color">
                        <p class="paragraph-padding"><?php echo htmlspecialchars_decode($item->description); ?></p>
                    </div>
                    @if($item->business_feature_stock)
                    <?php
                    $business_feature_stock = json_decode($item->business_feature_stock);
                    $business_stock = array();
                    $business_feature = array();
                    if (count($business_feature_stock->business_feature) > 0) {
                        foreach ($business_feature_stock->business_feature as $value) {
                            if (!empty($value->name)) {
                                $business_feature[] = $value;
                            }
                        }
                    }
                    if (count($business_feature_stock->business_stock) > 0) {
                        foreach ($business_feature_stock->business_stock as $value) {
                            if (!empty($value->name)) {
                                $business_stock[] = $value;
                            }
                        }
                    }
                    ?>
                    @if(count($business_feature)>0)
                    <div class="feature_stock_listing">
                        <h4 class="paragraph-padding mt-15">Business Features</h4>
                        <hr class="mt-5 mb-5 hr-color">


                        <ul class="paragraph-padding">
                            @foreach($business_feature as $feature)
                            <li><span><i class="fas fa-arrow-right"></i></span>{{$feature -> name}}</li>
                            @endforeach
                        </ul>

                    </div>
                    @endif
                    @if(count($business_stock)>0)
                    <div class="feature_stock_listing">
                        <h4 class="paragraph-padding mt-15">Business Stock</h4>
                        <hr class="mt-5 mb-5 hr-color">
                        <ul class="paragraph-padding feature_stock_listing">
                            @foreach($business_stock as $stock)
                            <li><span><i class="fas fa-arrow-right"></i></span>{{$stock -> name}}</li>
                            @endforeach
                        </ul>

                    </div>
                    @endif


                    @endif




                </div>
            </div>
            <div>
            </div>




        </div>



        <div class="col-md-4">

            <div class="profile-info-box">
                <div class="avatar-round">

                    @if($item->user->profilepic)


                    @if(File::exists(public_path().$item->user->profilepic['path'].'thumb_small_'.$item->user->profilepic['name']))
                    <img src="{{$item -> user -> profilepic['path'].'thumb_small_'.$item -> user -> profilepic['name']}}"/>
                    @else
                    <img src="images/user_pic.jpg"/>
                    @endif
                    @else
                    <img src="images/user_pic.jpg">
                    @endif
                </div>

                <div class="inner-wrap text-center">
                    <a href="profile?id={{base64_encode($item -> user -> id)}}" class="service listing_business_area" style="margin-bottom:0px;">{{ isset($item -> user -> UserBusiness -> business_name)?$item -> user -> UserBusiness -> business_name:''}}</a>
                    <div class="profile-stars mt-10px-imp" ng-init="rate = {{$item -> user -> rating}}" style="margin-top:0px !important;">
                        <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating font-size-rating"></uib-rating>
                    </div>
                    @if($item->is_show_phone)
                    <div class="btn-contact-call" style='border-radius: 4px;'>
                        <img src="images/contact-20.png" alt="Contact" title="Contact">
                        {{ $item -> contact}}
                    </div>
                    @endif
                    <div ><?php echo isset($item->user->UserBusiness->about) ? substr(($item->user->UserBusiness->about), 0, 180) : ''; ?></div>
                    <!--<div>{{ isset($item -> user -> UserBusiness -> about)?substr(strip_tags($item -> user -> UserBusiness -> about), 0, 180):''}}</div>-->
                    @if(isset($item->user->UserBusiness->business_email))
                    <div class="btn btn-contact-email">
                        <a href="#" onclick="showModelBusiness()" title="Eamil"><img src="images/email-24.png">Contact</a>
                    </div>
                    @endif

                    @if(Auth::check())

                    <div class="btn btn-contact-email" ng-controller="BusinessNewController">
                        <a href="javascript:void(0)" ng-click="ReportBusiness('Business', '<?php echo $item->title ?>', '<?php echo $item->id ?>')" title="Eamil">
                            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                            Report Business</a>
                    </div>

                    @endif


                </div>
            </div>
            <div class="googleMap">
                <div class="profile-google-map">
                     <script src="http://maps.google.com/maps/api/js?key=AIzaSyBgUoek8OLWNtu9y2IB0GRSZDcK4OCi4R4" type="text/javascript"></script>

                     <div id="map" style="width: 100%; height: 245px;"></div>
        <script type="text/javascript">
        window.onload = function () {

        var map = new google.maps.Map(document.getElementById('map'), {
                maxZoom: 18,
                center: new google.maps.LatLng( - 33.92, 151.25),
                mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var bounds = new google.maps.LatLngBounds();
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        var geocoder = new google.maps.Geocoder();
        var address = '<?php echo  $item->user->userBusiness->business_address.", ".$item->user->userBusiness->business_suburb.", ".$item->user->userBusiness->state ?>';
        console.log(address);
        geocoder.geocode({
        'address': address
        }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            marker = new google.maps.Marker({
            position:  results[0].geometry.location,
                    map: map
            });
            bounds.extend(marker.position);
            map.fitBounds(bounds);
        }

        }
        );


        };</script>
                </div>
            </div>
        </div>
    </div>





</div>

<div>
    <div class="modal-dialog" id="businessemail-popup" style="display: none;margin-top: 7%;" ng-controller="BusinessNewController">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Contact Owner</h4>
            </div>
            <div class="modal-body">
                <input type="hidden" name="email_to" id="email_to" value="{{$item -> email}}">
                <div>Your email: <input type="text" class="form-control" name="from_email_business" id="from_email_business"></div>
                <div>Message: <textarea class="form-control width580" name="email_message_business" id="email_message_business"></textarea> </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn bg-teal" ng-click="sendEmail()">Submit</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>

    </div>
</div>
</section>

<script>
    var total_images = '<?php echo count($item->assets); ?>';
    function setImageSrc(obj) {

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = obj.src;
    captionText.innerHTML = '';
    }

</script>
                <script>
                    function openGallaySlider() {
                    $('.parent-container').each(function() { // the containers for all your galleries
                    $(this).magnificPopup({
                    delegate: 'a', // the selector for gallery item
                            type: 'image',
                            gallery: {
                            enabled:true
                            }
                    });
                    });
                    }

                    function openGallaySliderIcon() {
                    $('.parent-container-icon').each(function() { // the containers for all your galleries
                    $(this).magnificPopup({
                    delegate: 'a', // the selector for gallery item
                            type: 'image',
                            callbacks: {
                            elementParse: function(item) {
                            // Function will fire for each target element
                            // "item.el" is a target DOM element (if present)
                            // "item.src" is a source that you may modify
                            // console.log(item.el.context.className);
                            if (item.el.context.className.indexOf('video') !== - 1) {
                            item.type = 'iframe',
                                    item.iframe = {
                                    patterns: {
                                    youtube: {
                                    index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                                            id: 'v=', // String that splits URL in a two parts, second part should be %id%
                                            // Or null - full URL will be returned
                                            // Or a function that should return %id%, for example:
                                            // id: function(url) { return 'parsed id'; }

                                            src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                                    }
                                    }
                                    }
                            }
                            else {
                            item.type = 'image'
                            }
                            }
                            },
                            gallery: {
                            enabled:true
                            }
                    });
                    });
                    }

                    function showModelBusiness() {
                    $("#businessemail-popup").modal("show");
                    }

</script>
