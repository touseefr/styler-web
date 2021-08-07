<link rel="stylesheet" href="{{url('css/magnific.css')}}">

<!------------START : Gallery Block------------>
<div class="gallery gallery_web" ng-controller="GalleryController">
    <h3>Gallery</h3>

    <div class="container">

        <div class="row">

<!-- onclick="openGallaySlider()" -->

            @foreach($gallery['images'] as $key => $item)
            @if ($key <10)
            <div class="col-md-3 col-sm-4 col-padding-adjustment" style="width: 20%;">
                <div class="gallery-block">
                    <div class="clearfix">
                        <div class="gallery-content">
                            <a class="pop-gallery" 
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
                            <div class="gallery-footer-text" onclick="window.open('profile?id={{base64_encode($item['user_id'])}}','_blank')">
                               
                                    @if(strlen($item['business']['business_name'])>20)
                                    {{ substr($item['business']['business_name'], 0, 20).'...'}}
                                    @else
                                    {{ $item['business']['business_name']}}
                                    @endif
                              
                            </div>
                           
                            
                               
                            
<!--                            <div class="gallery-footer-icon">
                                <a style="margin-left:20px" href="#"
                                   socialshare
                                   socialshare-provider="insta"
                                   socialshare-text="{{ $item['business']['business_name']}}"
                                   socialshare-via="229619774120606"
                                   socialshare-description="{{ $item['business']['business_name']}}"
                                   socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                   socialshare-type="feed"
                                   socialshare-media="{{$item['image_path']}}{{$item['image_name']}}"
                                   >
                                    <i class="fab fa-instagram" aria-hidden="true"></i>

                                </a>
                                 <a href="#"
                                   socialshare
                                   socialshare-provider="twitter"
                                   socialshare-text="{{ $item['business']['business_name']}}"
                                   socialshare-hashtags="{{ $item['business']['business_name']}}"
                                   socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                   >
                                    <i class="fa fa-tumblr" aria-hidden="true"></i>
                                </a> 
                            </div>-->
                        </div>
                    </div>
                </div>
            </div>

            @endif
            @endforeach
        </div>

        <div class="gallery-footer">
            <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
                <button class="btn-yellow-1"  onclick="window.open('/galleryall', '_self')">View Gallery</button>
            </div>
        </div>

    </div>

</div>
<!------------END : Gallery Block------------>
@section('after')
<script type="text/javascript">
$(document).ready(function(){
// $('.pop-gallery').each(function () { // the containers for all your galleries
$('.pop-gallery').magnificPopup({
        // delegate: '.pop-gallery', // the selector for gallery item
        type: 'image',
        gallery: {
        enabled: true
        }
});
// });
});
</script>
@endsection