<?php

function get_time_ago($time) {
    $time_difference = time() - $time;

    if ($time_difference < 1) {
        return 'less than 1 second ago';
    }
    $condition = array(12 * 30 * 24 * 60 * 60 => 'year',
        30 * 24 * 60 * 60 => 'month',
        24 * 60 * 60 => 'day',
        60 * 60 => 'hour',
        60 => 'minute',
        1 => 'second'
    );

    foreach ($condition as $secs => $str) {
        $d = $time_difference / $secs;

        if ($d >= 1) {
            $t = round($d);
            return 'about ' . $t . ' ' . $str . ( $t > 1 ? 's' : '' ) . ' ago';
        }
    }
}
?>
<!------------START : Latest Reviews Popup Block------------>

<!------------END : Latest Reviews Popup Block------------>

<!-- Review Section New Style-->
<div class="latest_reviews_section">
    <div class="container">
        <div class="col-md-6">
            <h3>Reviews</h3>
            <?php
            if (isset($latestreviews) && count($latestreviews) > 0) {
                $count = 1;
                ?> @foreach($latestreviews as $index => $reviews)
                <div class="col-md-12 padd0">
                    <div class="block-head">
                        <div class="text-heading"><a href="{{ URL::to('/') }}/{{ 'profile?id='.base64_encode($reviews -> UserTo['id'])}}">
                                @if($reviews -> UserTo->roles[0]->name=='JobSeeker' || $reviews -> UserTo->roles[0]->name=='Individual')
                                {{$reviews -> UserTo -> name}}
                                @else
                                {{$reviews -> UserTo -> userBusiness -> business_name}}
                                @endif
                            </a></div>
                        <div class="location">{{$reviews -> UserTo -> userBusiness -> business_suburb}}{{(!empty($reviews -> UserTo -> userBusiness
                                        -> state) && !empty($reviews -> UserTo -> userBusiness -> business_suburb))?',':''}} {{$reviews
                                                    -> UserTo -> userBusiness -> state}}</div>
                    </div>
                    <div class="block-sub-head">
                        <div class="profile_star" ng-init="rating{{$index}} = {{ $reviews -> rating}}">
                            <uib-rating ng-model="rating{{$index}}" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating"
                                        class="rating"></uib-rating>
                        </div>
                        <!--                        <div class="time_ago">
                                                    {{get_time_ago(strtotime($reviews -> created_at))}}
                                                </div>-->
                    </div>
                    <div class="block-content">
                        <div class="media">
                            <div class="media-left">
                                @if($reviews->UserTo->profilepic)

                                <a href="{{ URL::to('/') }}/{{ 'profile?id='.base64_encode($reviews -> UserTo['id'])}}">
                                    @if(File::exists(public_path().$reviews->UserTo->profilepic['path'].'thumb_small_'.$reviews->UserTo->profilepic['name']))
                                    <img src="{{ URL::to('/') }}/{{$reviews -> UserTo -> profilepic['path'].'thumb_small_'.$reviews -> UserTo -> profilepic['name']}}"
                                         alt="" width="75" height="75" class="img-circle center-block"/>
                                    @else
                                    <img src="{{url('images/user_pic.jpg')}}" alt=""
                                         class="img-responsive img-circle center-block"/>
                                    @endif
                                </a> @else

                                <a href="{{ URL::to('/') }}/{{ 'profile?id='.base64_encode($reviews -> UserTo -> id)}}">
                                    <img src="images/user_pic.jpg" alt=""
                                         class="img-responsive img-circle center-block"/>
                                </a> @endif
                            </div>
                            <div class="media-body">
                                <p>
                                    @if(strlen($reviews->review_comment) > 180) {{substr($reviews -> review_comment, 0, 180)}}... @else {{$reviews -> review_comment}}
                                    @endif
                                </p>
                            </div>
                            <div class="review_by_name">


                                @if($reviews->anonymously) By: Anonymous User @else By: {{ $reviews -> UserFrom -> name}} @endif
                                <a class="review_detail_pop floatright" data-review-detail="{{$reviews -> review_comment}}" to-user-id="{{$reviews -> to_user_id}}"
                                   comment_id="{{$reviews -> id}}" from-user-id="{{$reviews -> from_user_id}}" data-reply-comment="{{$reviews -> reply_comments}}"
                                   href="#popup-1">Read Detail</a>
                            </div>
                        </div>
                    </div>
                    <?php
                    if ($count == 3) {
                        echo '</div>';
                        break;
                    } else {
                        $count++;
                        ?>
                        <hr>
    <?php } ?>
                </div>
                @endforeach
<?php }else{ ?>
                <div class="col-md-12 padd0">
                    <p style="color: #514c4b;height: 60px;margin: 0;font-size: 18px;display: flex;align-items: center;font-weight: 500;">No review added</p>
                </div>
<?php }?>
        </div>
        <div class="col-md-6">
            <h3>Top Rated Businesses</h3>
            <?php if (isset($latestreviews) && count($latestreviews) > 0) {
                $count = 1;
                ?> @foreach($business as $index => $data)
                <div class="col-md-12 padd0">
                    <div class="block-head">
                        <div class="text-heading">
                            <a href="{{ URL::to('/') }}/{{ 'profile?id='.base64_encode($data -> id)}}">
                                {{$data -> business_name}}
                                @if($reviews -> UserTo->roles[0]->name=='JobSeeker' || $reviews -> UserTo->roles[0]->name=='Individual')
                                {{$reviews -> UserTo -> name}}
                                @else
                                {{$reviews -> UserTo -> userBusiness -> business_name}}
                                @endif


                            </a></div>
                        <div class="location">{{$data -> business_suburb}}{{(!empty($data -> state) && !empty($data -> business_suburb))?',':''}}
                            {{ $data -> state}}</div>
                    </div>
                    <div class="block-sub-head">
                        <div class="profile_star" ng-init="ratings{{$index}} = {{ $data -> rating}}">
                            <uib-rating ng-model="ratings{{$index}}" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating"
                                        class="rating"></uib-rating>
                        </div>
                        <div class="time_ago">
                            based on {{$data -> total_reviews}} reviews
                        </div>
                    </div>
                    <div class="block-content">
                        <div class="media">
                            <div class="media-body">
                                <p>
                                    @if(strlen($data->about) > 180) {{substr(strip_tags($data -> about), 0, 180)}}... @else {{strip_tags($data -> about)}} @endif
                                </p>
                            </div>
                        </div>
                    </div>
                    <?php
                    if ($count == 3) {
                        echo '</div>';
                        break;
                    } else {
                        $count++;
                        ?>
                        <hr>
                <?php } ?>
                </div>
                @endforeach
<?php }else{ ?>
                <div class="col-md-12 padd0">
                    <p style="color: #514c4b;height: 60px;margin: 0;font-size: 18px;display: flex;align-items: center;font-weight: 500;">No review added, We will calculate this based on your reviews</p>
                </div>
<?php }?>
        </div>
    </div>
</div>

<!-- End : Review Section New Style -->
