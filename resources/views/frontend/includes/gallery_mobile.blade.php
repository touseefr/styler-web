<div class="clear"></div>
<!------------START : Latest Reviews Block------------>

<div class="gallery gallery_mobile" ng-controller="GalleryController">

    <h3>Have a sneak peek</h3>

    <div class="container"  >
        <section class="container" >
            <div class="pt-15 mb-20 home-listing" id="home-reviews">
                <div class="tab-content bxslider">
                    <?php
                    $count = 1;
                    ?>
                    @foreach($gallery['images'] as $key => $item)
                    <?php
                    if ($count == 1) {
                        echo '<div class="slider-mobile slider_view_set col-md-4 col-sm-5"  data-check="1">';
                    }
                    ?>

                   @if ($key <15)
                    <div class="col-md-12 col-sm-12 col-padding-adjustment">
                        <div class="gallery-block">
                            <div class="clearfix">
                                <div class="gallery-content">
                                    <a class="pop-gallery" onclick="openGallaySlider()"
                                       href="{{$item['image_path']}}{{$item['image_org']}}">   <img class="img-responsive  center-block"
                                                                                                 style="width: 100%"
                                                                                                 src="{{$item['image_path']}}{{$item['image_name']}}">
                                    </a>
                                    @if (Auth::check())
                                            @if($user_id = Auth::User()->id)
                                    <a href="javascript:void(0)" style="height:18px;" id="like-{{$key}}"
                                                       ng-click="likeGallery(<?php echo $user_id; ?>, <?php echo $item['asset_id']; ?>, '<?php echo 'like-' . $key; ?>')"
                                                       class="heart-btn heart-btn-counter like-{{$key}}"
                                                       data-count="{{$item['likes_count']}}"
                                                       aria-hidden="true" style="height:20px">
                                                        <i class="fas fa-thumbs-up heart-center"
                                                           aria-hidden="true"></i>
                                                    </a>    
                                                    @endif
                                                    @endif               
                                </div>
                                <div class="gallery-block-footer">
                                    <div class="gallery-footer-text" onclick="window.open('profile?id={{base64_encode($item['user_id'])}}', '_self')">

                                        @if(strlen($item['business']['business_name'])>20)
                                        {{ substr($item['business']['business_name'], 0, 20).'...'}}
                                        @else
                                        {{ $item['business']['business_name']}}
                                        @endif

                                    </div>
                                    <div class="gallery-footer-icon">
                                        <a style="margin-left:20px" href="#"
                                           socialshare
                                           socialshare-provider="facebook"
                                           socialshare-text="{{ $item['business']['business_name']}}"
                                           socialshare-via="229619774120606"
                                           socialshare-description="{{ $item['business']['business_name']}}"
                                           socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                           socialshare-type="feed"
                                           socialshare-media="{{$item['image_path']}}{{$item['image_name']}}"
                                           >
                                            <i class="fa fa-facebook" aria-hidden="true"></i>
                                        </a>                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endif
                    <?php
                    if ($count == 2) {
                        echo '</div>';

                        $count = 1;
                    } else {
                        $count++;
                    }
                    ?>
                    @endforeach


                </div>

            </div>
        </section>
    </div>


</div>
<!------------END : Latest Reviews Block------------>
<div class="clear"></div>
