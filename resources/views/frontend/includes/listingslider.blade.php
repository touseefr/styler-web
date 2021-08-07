<!------------START : Deals Block------------>

<div class="deals">
  <h3 class="text-center deal-heading">Stylerzone Marketplace</h3>
  <div class="container">        
    <div class="row">
      <div class="deals-header">
        <div class="clearfix">
          <div class="col-md-6 col-sm-3 col-xs-9">
            <h3 class="tab-title">Deals</h3>
          </div>
          <div class="col-md-6 col-sm-9">
            <div class="row">
              <div class="navbar-deals">
                <span class="navbar-toggle collapsed" data-toggle="collapse" data-target="#dealsNavbar" aria-expanded="false" aria-controls="dealsNavbar">
                  <span class="sr-only">Toggle deals navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                </span>
                <div id="dealsNavbar" class="navbar-collapse collapse">
                  <div class="nav nav-menu-2 nav-tabs">
                    <div class="col-sm-4 col-padding-adjustment" style="display: none;" >
                      <a data-toggle="tab" href="#deals" title="Deals" onclick="changeHomeTab('Deals', this)" class="btn-teal-3 tabBtn deals_btn">Deals</a>
                    </div>
                    <div  class="col-sm-4 col-padding-adjustment">
                      <a data-toggle="tab" href="#classifieds" title="Classifieds" onclick="changeHomeTab('Marketplace', this)" class="btn-orange-1 tabBtn classifieds_btn">Marketplace</a>
                    </div>
                    <div class="col-sm-4 col-padding-adjustment">
                      <a data-toggle="tab"  href="#jobs" title="Jobs" onclick="changeHomeTab('Jobs', this)" class="btn-yellow-4 tabBtn jobs_btn">
                          Jobs
                      </a>
                    </div>
                    <div data-toggle="tab" class="col-sm-4 col-padding-adjustment" onclick="changeHomeTab('Business for sale', this)">
                      <a data-toggle="tab"  href="#BusinessForSale" title="Jobs" onclick="changeHomeTab('Jobs', this)" class="btn-red-1 tabBtn business_btn">Business for Sale</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row tab-content deals-listing">           
      <div id="deals" class="tab-pane fade in active" >
        @widget('Listing', ['count' => 30, 'type'=>'deals','user_id'=>isset($user_id)?$user_id:''], 'date', 'asc')                
        <div class="deals-footer">
          <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
            <button onclick="window.open('/listingbycat?page=1&type=deal<?php echo (Route::currentRouteName()=='profile')?"&p_id=".$user_id:"" ?>','_self')" class="btn-yellow-1">View more</button>
          </div>
        </div>
      </div>
      <div id="classifieds" class="tab-pane fade">
        @widget('Listing', ['count' => 30, 'type'=>'classifieds','user_id'=>isset($user_id)?$user_id:''], 'date', 'asc')                
        <div class="deals-footer">
          <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
            <button onclick="window.open('/marketplace')" class="btn-yellow-1">View more</button>
          </div>
        </div>
      </div>
      <div id="jobs" class="tab-pane fade">
        @widget('Listing', ['count' => 30, 'type'=>'jobs','user_id'=>isset($user_id)?$user_id:''], 'date', 'asc')               
        <div class="deals-footer">
          <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
            <button onclick="window.open('/listingbycat?page=1&type=job<?php echo (Route::currentRouteName()=='profile')?"&p_id=".$user_id:"" ?>','_self')" class="btn-yellow-1">View more</button>
          </div>
        </div>
      </div>
      <div id="BusinessForSale" class="tab-pane fade">
        @widget('Listing', ['count' => 30, 'type'=>'businessforsale' ,'user_id'=>isset($user_id)?$user_id:''], 'date', 'asc')                
        <div class="deals-footer">
          <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
            <button onclick="window.open('/listingbycat?page=1&type=businessforsale<?php echo (Route::currentRouteName()=='profile')?"&p_id=".$user_id:"" ?>','_self')" class="btn-yellow-1">View more</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!------------END : Deals Block------------>
@section('after')
<script type="text/javascript">
    $(document).ready(function () {
    $('.business_btn').click(function (ev) {
        $(".tab-title").css('color','#F54C4E');
    });
    $('.classifieds_btn').click(function (ev) {
        $(".tab-title").css('color','#FD9427');
    });
    $('.jobs_btn').click(function (ev) {
        $(".tab-title").css('color','#FFCB0D');
    });
    $('.deals_btn').click(function (ev) {
        $(".tab-title").css('color','#4ABDAC');
    });
});
</script>
@endsection