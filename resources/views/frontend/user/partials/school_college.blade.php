<section class="container-fluid border_top">
  <div class="row first_slider">
    <div class="col-md-12 business_sec shadow_del" style="padding: 20px 0 5px;">
        <div class="col-md-12 col-sm-12 col-xs-12">
            @if(count(Auth::user()->listing))
                <div class="col-md-8" style="float: left;">
                    <h6 style="color:#767676;font-size: 22px;font-weight: 300;" >Users Listings:</h6>
                </div>
            @endif
            <div style="float: right; padding-top: 10px;" class="col-md-4">                
                <div class="text-left" style="color: #6dc25a !important; padding-left: 20px;color: #767676 !important;">
                    <span style="padding: 0 10px 0;">{{ count(Auth::user()->ReviewTo) }} Reviews</span>
                    |
                    <span style="padding: 0 10px 0;">{{ count(Auth::user()->listing) }} Listings</span>
                    |
                    <span style="padding: 0 10px 0;">{{ Auth::user()->rating }} Stars</span>
                </div>
            </div>
        </div>
        <div class="clear"></div>

    </div>
    <!--business_sec-->
    <div class="clear"></div>
  </div>
  <div class="row" ui-view=""></div>
</section>
 