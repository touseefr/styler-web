<?php
$count = 1;
$odd_count = 1;
$businessforsale_array = array();
foreach ($businessforsale as $key => $list) {
    if (strtotime(date('Y-m-d', strtotime($list->expiry . ' + 30 days'))) > strtotime(date('Y-m-d'))) {
        $businessforsale_array[] = $list;
    }
}
?>
@if(!empty($businessforsale_array))
<div class="create_list_inner home-listing list_padding">
    <div class="tab-content dealsslider">
        @foreach($businessforsale_array as $key=>$list)
        @if(strtotime(date('Y-m-d', strtotime($list->expiry. ' + 30 days'))) > strtotime( date('Y-m-d')))
        <?php
        if ($count == 1) {
            echo '<div class="setwidth">';
        }
        ?>
        <div class="user_latest_reviews">
            <div class="listing_item">
                <?php $background_image = "images/no-image.png"; ?>
                @if(isset($list->assets[0]))
                @if(File::exists(public_path().$list->assets[0]['path'].'thumb_small_'.$list->assets[0]['name']))
                <?php $background_image = $list->assets[0]['path'] . 'thumb_small_' . $list->assets[0]['name']; ?>			    						
                @endif
                @endif                 
                <div class="item_detail white-box curser_change"   >     
                    <div class="main_block">
                        <div class="item_image">
                            @if($list->user->profilepic)
                            <a  href="{{ URL::to('/') }}/{{ 'profile?id='.$list->user['id']}}">
                                @if(File::exists(public_path().$list->user->profilepic['path'].'thumb_small_'.$list->user->profilepic['name']))
                                <img src="{{$list -> user -> profilepic['path'].'thumb_small_'.$list -> user -> profilepic['name']}}" alt="" width="75" height="75" class="img-circle center-block"/>
                                @else
                                <img src="images/user_pic.jpg" alt="" class="img-responsive img-circle center-block"/>
                                @endif
                            </a>

                            @else

                            <a  href="{{ URL::to('/') }}/{{ 'profile?id='.$list->user['id']}}">
                                <img src="images/user_pic.jpg" alt=""
                                     class="img-responsive img-circle center-block"/>
                            </a>

                            @endif

                        </div>
                        <div class="content-block" onclick="javascript:window.open('/business?id={{ $list->id }}', '_self')">
                            <div class="title_rating">
                                <span class="title" title="{{ $list ->user->name}}">
                                    <a >@if(strlen($list->title) > 12)
                                        {!! substr($list->title,0,12).'...'  !!}
                                        @else
                                        {!! $list->title  !!}
                                        @endif</a>
                                </span>                                                                                               
                            </div>
                            <p>@if(strlen($list->description) > 100) {{substr($list -> description, 0, 100).'...'}} 
                                @else {{$list -> description}} @endif

                            </p>                        
                        </div>
                    </div>
                    <div class="white-panel">
                        <a  href="{{ URL::to('/') }}/{{ 'profile?id='.$list->user['id']}}"><?php echo $list->user->UserBusiness['business_name']; ?></a>
                    </div>
                </div>

            </div>
        </div>
        <?php
        if ($count == 2) {
            echo '</div>';
            $count = 1;
        } else {
            if (count($businessforsale_array) == $odd_count) {
                echo "</div>";
            }
            $count++;
        }
        $odd_count++;
        ?>

        @endif
        @endforeach
    </div>
</div>
@endif  



<!--new one is down here-->

<?php
$count = 1;
$odd_count = 1;
$businessforsale_array = array();
foreach ($businessforsale as $key => $list) {
    if (strtotime(date('Y-m-d', strtotime($list->expiry . ' + 30 days'))) > strtotime(date('Y-m-d'))) {
        $businessforsale_array[] = $list;
    }
}
?>
@if(!empty($businessforsale_array))
<div class="row dealsslider">     
        @foreach($businessforsale_array as $key=>$list)
        @if(strtotime(date('Y-m-d', strtotime($list->expiry. ' + 30 days'))) > strtotime( date('Y-m-d')))
        <?php
        if ($count == 1) {
            echo '<div >';
        }
        ?>
        <div class="col-md-4 col-sm-6 col-padding-adjustment">
            <div class="deals-block">
                <div class="deals-content">
                    @if($list->user->profilepic)
                    <a href="{{ URL::to('/') }}/{{ 'profile?id='.$list -> user -> id}}">
                        @if(File::exists(public_path().$list->user->profilepic['path'].'thumb_small_'.$list->user->profilepic['name']))
                        <img src="{{$list -> user -> profilepic['path'].'thumb_small_'.$list -> user -> profilepic['name']}}" alt="deals-icon-1" />
                        @else
                        <img src="images/user_pic.jpg" alt=""  class="img-responsive img-circle center-block"/>
                        @endif
                    </a>
                    @else
                    <a href="{{ URL::to('/') }}/{{ 'profile?id='.$list -> user -> id}}">
                        <img src="images/user_pic.jpg" alt="" class="img-responsive img-circle center-block"/>
                    </a>
                    @endif
                    <div class="deals-content-inner">
                        <h4>@if(strlen($list->title) > 12)
                            {!! substr($list->title,0,12).'...'  !!}
                            @else
                            {!! $list->title  !!}
                            @endif</h4>
                        <p>
                            @if(strlen($list->description) > 100) {{substr($list -> description, 0, 100).'...'}} 
                            @else {{$list -> description}} @endif
                        </p>
                    </div>
                </div>
                <div class="deals-block-footer">
                    <a href="{{ URL::to('/') }}/{{ 'profile?id='.$list -> user -> id}}"><?php echo $list->user->UserBusiness['business_name']; ?></a>
                </div>
            </div>
        </div>
        <?php
        if ($count == 2) {
            echo '</div>';
            $count = 1;
        } else {
            if (count($businessforsale_array) == $odd_count) {
                echo "</div>";
            }
            $count++;
        }
        $odd_count++;
        ?>

        @endif
        @endforeach
    </div>
@endif  



