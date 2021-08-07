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
<div class="container">
  <div class="text-center carousel_container">
    <div class="listing_slides">
      @foreach($businessforsale_array as $key=>$list)
      @if(strtotime(date('Y-m-d', strtotime($list->expiry. ' + 30 days'))) > strtotime( date('Y-m-d')))
      <?php $background_image = "images/no-image.png"; ?>
      @if(isset($list->assets[0]))
      @if(File::exists(public_path().$list->assets[0]['path'].'thumb_small_'.$list->assets[0]['name']))
      <?php $background_image = $list->assets[0]['path'] . 'thumb_small_' . $list->assets[0]['name'];
      ?>  

      @endif
      @endif
      <div class="equalH px-5">
        <div class="card deal-card text-center">
          <div class="card-header">
            <a href="/business?id={{base64_encode($list -> id)}}">
              <img src="<?php echo $background_image; ?>" alt="title" class="img-responsive">    
              @if(Auth::check())
              <addto-watch class="f-icon" id="{{$list -> id}}" type="Business"></addto-watch>
              @endif 
            </a>
          </div>
          </a>
          <div class="card-body">
            <a href="/business?id={{ base64_encode($list -> id) }}">
              <h2 class="card-title text-uppercase mb-0 mt-10"><?php echo substr($list->title, 0, 20); ?></h2>
            </a>
            <div class="col-xs-12"><hr></div>
            <div class="mt-10">
              <p class="card-text mb-0 text-uppercase" style="font-weight: bolder;"><a href="/profile?id={{ base64_encode($list->user->id) }}" style="color: #444;"><?php echo substr($list->user->UserBusiness->business_name, 0, 20); ?></a></p>
              <address class="address mb-0">
                <span class="fa fa-map-marker"></span>
                <span class="text-uppercase"><?php echo $list->suburb . ',' . $list->state . ' ' . $list->postcode; ?></span>
              </address>
              <div class="profile-stars mt-10px-imp" ng-init="business_rating{{$key}}= '<?php echo $list->user->rating; ?>'">
                <uib-rating ng-model="business_rating{{$key}}" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating font-size-rating"></uib-rating>
                <div class="ratingreview textblackcolor">({{count($list -> user -> ReviewTo)}})</div>
              </div>
            </div>
              <div class="col-xs-12"><hr></div>
              <p class="card-text textblackcolor">Body Massage, Thai Massage, Remedial Massage, Neck Massage <a href="javascript:;" class="textblackcolor">See More...</a></p>
          </div>
          <div class="card-footer">
            <a class="btn btn-orange-1 text-uppercase" href="/business?id={{ base64_encode($list -> id)}}" >View Detail</a>
          </div>
        </div>
      </div>
      @endif
      @endforeach
    </div>
  </div>
</div>

@else

<div class="container">
  <div class="text-center carousel_container">
    <span> No listing exists.</span>
  </div>
</div>

@endif  