@section('after-styles-end') {!! HTML::style('css\magnific.css' ) !!}
@endsection
 @if($item->assets && count($item->assets))
<div class="parent-container">
    @foreach($item->assets as $k => $asset) @if(File::exists(public_path().$item->assets[$k]['path'].$item->assets[$k]['name']))
    <?php
    if ($k == 0) {
        $style = 'style="display: block"';
    } else {
        $style = 'style="display: none"';
    }
    ?>
    <div class="bannerUpload">
        <div class="uploadIcon">
            <a class="image-gallery-popup1 bgallerysize1" onclick="openGallaySlider()" href="{{$item->assets[$k]['path']}}{{$item->assets[$k]['name']}}">
                <img id="myImage{{$k}}" <?php echo $style; ?> src="{{$item->assets[$k]['path']}}{{$item->assets[$k]['name']}}" alt="Gallery Image" />
            </a> @endif @endforeach
        </div>
    </div>
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

<div class="toolbar-wrap">
    <ul class="gallery-toolbar">
        <li class="parent-container-icon" style="display: none;">            
            @if(isset($item->assets) &&  count($item->assets)>0)             
            @foreach($item->assets as $k => $asset)
             @if(File::exists(public_path().$item->assets[$k]['path'].$item->assets[$k]['name']))

            <?php
                    if ($k == 0) {
                        $style = 'style="display: block"';
                    } else {
                        $style = 'style="display: none"';
                    }                   
                ?>
                <a class="f-icon" onclick="openGallaySliderIcon()" href="{{$item->assets[$k]['path']}}{{$item->assets[$k]['name']}}">
                <img id="myImage{{$k}}" <?php echo $style; ?> src="images/camera-32.png" alt="Contact" title="click to watch images">
                <span class="copy">{{count($item->assets)}}</span></a> @endif @endforeach @endif
        </li>

        <li>

            <addto-watch class="f-icon" id="{{$item->id}}" type="Business"></addto-watch>
        </li>

        <li class="parent-container-icon">
            @if(!empty($item->listing_video))
            <a class="f-icon video" onclick="openGallaySliderIcon()" href="{{$item->listing_video}}">
                        <img src="images/movie-camera.png" alt="Contact" title="Videos">
            </a> @endif
        </li>

    </ul>
</div>
<script type="text/javascript">
    function openGallaySlider() {
                $('.parent-container').each(function () { // the containers for all your galleries
                    $(this).magnificPopup({
                        delegate: 'a', // the selector for gallery item
                        type: 'image',
                        gallery: {
                            enabled: true
                        }
                    });
                });
            }

            function openGallaySliderIcon() {
                $('.parent-container-icon').each(function () { // the containers for all your galleries
                    $(this).magnificPopup({
                        delegate: 'a', // the selector for gallery item
                        type: 'image',
                        callbacks: {
                            elementParse: function (item) {
                                // Function will fire for each target element
                                // "item.el" is a target DOM element (if present)
                                // "item.src" is a source that you may modify
                                // console.log(item.el.context.className);
//                        if(item.el.context.className == 'video') {
                                if (item.el.context.className.indexOf('video') !== -1) {
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
                                } else {
                                    item.type = 'image'
                                }
                            }
                        },
                        gallery: {
                            enabled: true
                        }
                    });
                });
            }

            function showModelBusiness() {
                $("#businessemail-popup").modal("show");
            }

</script>