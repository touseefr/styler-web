<section class="container-fluid border_top">
  <div class="shadow_del">
    <div class="first_slider">
      <div class="col-md-6 business_sec shadow_del no_border" style="display: none">
        {{--<label>{{date('M d Y',strtotime(Auth::user()->created_at))}}</label>--}}
        <div class="post_label">
          <span>{{ count(Auth::user()->ReviewFrom) }} Reviews</span>                      
        </div>	
      </div><!--business_sec-->
		 <div class="row" ui-view="user-top-section"></div>
	</div>
    <div class="row" ui-view=""></div>
  </div>
</section>
