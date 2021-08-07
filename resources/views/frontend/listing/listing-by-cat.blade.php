@extends('frontend.layouts.account') @section('content')
@include('frontend.includes.hearderportion')
<?php
if ($type == 'businessforsale') {
    $type_link = 'business';
    $type='Business for Sale';
            
} else {
    $type_link = $type . 's';
}
?>
<section class="container  animated fadeIn">
  <div ng-controller="ListingByCatController" class="row">
    <div class="col-md-12" ui-view="create_listing_view">
        <div class="pt-15 mb-20" infinite-scroll='self.nextPage()' infinite-scroll-disabled='self.busy'>
            <h3 class="text-capitalize deal_more_h3">Listing {{$type}}</h3>
            <div class="row flex">

                <div class="col-xs-12 col-sm-6 col-md-3 flex mb-15" ng-if="listing.length" ng-repeat="list in listing">
                    <div class="card deal-card text-center">

                        <div class="card-header socilIcons">
                            <a href="<% listingCtrl.host %>/{{$type_link}}?id=<%base64_encode(list.id)%>">
                                <img ng-src="<%list.assets[0].path+list.assets[0].name || 'images/no-image.png'%>"  fallback-src="images/no-image.png" class="img-responsive" title="<%list.title%>" /></a>

                            <span class="off-price" ng-if="list.type == 'deal' && list.discount != 0">$ <% list.discount %> OFF</span>
                            @if(Auth::check())
                            <addto-watch class="f-icon" id="<% list.id%>" type="Business"></addto-watch>
                            @endif
                            <ul class="social_links listing_social_links account_social_links">

                                <li>
                                    <a href="javascript:;" socialshare socialshare-provider="facebook" socialshare-text="<%list.title%>" socialshare-description="<%list.description%>" socialshare-url="{{ url('/')}}/<%list.type%>?id=<%list.id%>" socialshare-type="feed" socialshare-media="{{ url('/')}}<%list.assets[0].path%><%list.assets[0].name%>" socialshare-via="229619774120606"><i class="fa fa-facebook"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:;" socialshare socialshare-provider="twitter" socialshare-text="<%list.title%>" socialshare-hashtags="<%list.title%>" socialshare-url="{{ url('/')}}/<%list.type%>?id=<%list.id%>"><i class="fa fa-twitter"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:;" socialshare socialshare-provider="linkedin" socialshare-text="<%list.title%>" socialshare-description="<%list.description%>" socialshare-url="{{ url('/')}}/<%list.type%>?id=<%list.id%>"><i class="fa fa-linkedin"></i>

                                    </a>
                                </li>

                            </ul>

                        </div>

                        <div class="card-body">

                            <a href="<% listingCtrl.host %>/{{$type_link}}?id=<%base64_encode(list.id)%>">
                                <h2 class="card-title text-uppercase mb-0 mt-10"><%list.title | limitTo : 15%></h2>
                            </a>
                            <div class="col-xs-12"><hr></div>
                            <div class="mt-10 textblackcolor">
                                <p class="card-text mb-0 text-uppercase"><%list.user.user_business.business_name | limitTo : 15%></p>
                                <p class="card-text mb-0">
                                    <span class="fa fa-map-marker"></span>
                                    <span class="text-uppercase"><% list.suburb %>,<% list.state %> <% list.postcode %></span>
                                </p>

                                <div class="profile-stars" ng-init="rate = list.user.rating">
                                    <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']" aria-labelledby="default-rating" class="rating font-size-rating"></uib-rating>
                                    <div class="ratingreview textblackcolor">(<% list.user.review_to.length %>)</div>
                                </div>

                            </div>
                            <div class="col-xs-12"><hr></div>
                            <p class="card-text " ng-if="list.type != 'job' && list.type != 'businessforsale'"  title="<%list.price%>">
                                <b ng-hide="list.discount>0"><span style="font-size:16px;">$<% list.price %></span></b>
                                <b ng-if="list.discount>0"><span style="text-decoration: line-through;font-size:15px;" class="text-muted">$<% list.price %></span></b>
                                &nbsp; &nbsp;<b ng-if="list.discount>0" style="font-size: 16px;">$<%(list.price - list.discount)%></b>
                              
                                
                                
                            </p>
                            <p class="card-text textblackcolor" ng-if="list.type == 'job'" >
                                Body Massage, Thai Massage, Remedial Massage, Neck Massage <a class="textblackcolor" href="<% listingCtrl.host %>/jobs?id=<%list.user.id%>" >See More...</a>
                            </p>
                            <p class="card-text textblackcolor" ng-if="list.type == 'businessforsale'" >
                                Body Massage, Thai Massage, Remedial Massage, Neck Massage See More...
                            </p>

                        </div>
                        <div class="card-footer">
                            <a href="<% listingCtrl.host %>/{{$type_link}}?id=<%base64_encode(list.id)%>" ng-if="list.type == 'deal'">
                                <button type="button" class="btn btn-orange-1 text-uppercase">Redeem</button>
                            </a>                               
                            <a href="<% listingCtrl.host %>/{{$type_link}}?id=<%base64_encode(list.id)%>" ng-if="list.type == 'classified' || list.type == 'businessforsale' ">
                                <button type="button" class="btn btn-orange-1 text-uppercase">View Detail</button>
                            </a>                               

                            @if(Auth::check())
                            <a href="<% listingCtrl.host %>/jobs?id=<%base64_encode(list.user.id)%>" '_self')" ng-if="list.type == 'job'">
                                <button type="button" class="btn btn-orange-1 text-uppercase">Apply Now</button></a>
                            @else
                            <a href="<% listingCtrl.host %>/auth/login/" '_self')" ng-if="list.type == 'job'">
                                <button type="button" class="btn btn-orange-1 text-uppercase">Apply Now</button></a>
                            @endif    
                        </div>

                    </div>
                </div>


            </div>
        </div>
    </div>
  </div>
</section>
@endsection('content')