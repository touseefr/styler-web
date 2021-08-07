<section class="border_top">
  <div class="container-fluid bg-white">
    <div class="row first_slider">
      <div class="col-md-12 business_sec shadow_del">
        <div class="col-md-12 col-sm-12 col-xs-12">
          @if(count(Auth::user()->listing))
          <div class="pull-left">
            {{-- <h6 class="list_title">Users Listings:</h6> --}}
          </div>
          @endif
          <div class="pull-right pt-25">
            <span style="padding: 0 10px 0;">{{ count(Auth::user()->ReviewTo) }} Reviews</span>
            |
            <span style="padding: 0 10px 0;">{{ count(Auth::user()->listing) }} Listings</span>
          </div>
          <div class="clear"></div>
        </div>        
      </div>
      <!--business_sec-->
      @if(count(Auth::user()->listing))            
        <!--business_sec-->
        {{--@include('frontend.user.partials.listing_carousel', array('profile' => true)) --}}
      @endif
      <div class="clear"></div>
    </div>
    <div class="row"  ui-view=""></div>
  </div>
</section>
