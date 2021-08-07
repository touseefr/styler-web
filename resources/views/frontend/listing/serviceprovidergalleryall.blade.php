@extends('frontend.layouts.account') @section('content')
<!-- header start here -->
<!------------START : Banner Guide Block------------>
@include('frontend.includes.hearderportion')
<!-- header end here -->
<div class="clear"></div>
<section class="bg_gray border_top">
    <span id="show-before-spinner">
      <div class="text-center">
        <img src="images/spinner.gif" alt="Loading" class="" width="124" />
      </div>
    </span>
    <div class="container gallery-container" ng-controller="GalleryController as ctrlgallery" style="display: none;max-width: 100%;" id="gallery-container">
      <div class="clear"></div>
      <div class="row create_list_inner pt-15" infinite-scroll='ctrlgallery.nextPage()' infinite-scroll-disabled='ctrlgallery.busy' infinite-scroll-distance='2'  infinite-scroll-immediate-check="false" infinite-scroll-container='".content"' infinite-scroll-parent="true" >
        <div class="row">
          <div class="col-md-12">
            <h1 class="deal_more_h3 h2-title ">Gallery</h1>
          </div>
        </div>
        <div class="col-md-12" id="pinBootnew" ng-cloak>
          <div ng-repeat="item in records track by $index" class="white-panel listing_item">              
              <div  class="item_detail">
                  <div class="gallery-image">
                      <figure>
                          <a  class="me" href="/profile?id=<%base64_encode(item.user_id)%>">
                              <img ng-src="<%item.image_path%><%item.image_name%>"
                                    class="img-responsive  center-block" style="width: 100%;" 
                                    @if (Auth::check())
                                    title="<%item.image_title%>"
                                    @endif
                                    >

                          </a>                        
                          <ul class="social_links socail_galleryall">
                            <li>
                              <a href="/profile?id=<% base64_encode(item.user_id)%>">
                                  <strong class="h5" ng-if="item.business.business_name.length <= 18" >
                                      <% item.business.business_name  | limitTo : 18 %></strong>
                                      <strong class="h5" ng-if="item.business.business_name.length > 18">
                                          <% item.business.business_name  | limitTo : 18 %>..</strong>                                  
                              </a>
                            </li>
                              <!-- <li class="" style="margin-left: 15px;">
                                  <a href="#"
                                      socialshare
                                      socialshare-provider="facebook"
                                      socialshare-text="<%item.business.business_name%>"
                                      socialshare-description="<%item.business.business_name%>"
                                      socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                      socialshare-type="feed"
                                      socialshare-via="229619774120606"
                                      socialshare-media="{{ url('/')}}<%item.image_path%><%item.image_name%>">
                                      <i class="fa fa-facebook" aria-hidden="true"></i>
                                  </a>
                              </li> -->
                              @if (Auth::check())
                              @if($user_id = Auth::User()->id)
                              <li class="">
                                  <div class="fbLikes">
                                    <a href="#"
                                        socialshare
                                        socialshare-provider="facebook"
                                        socialshare-text="<%item.business.business_name%>"
                                        socialshare-description="<%item.business.business_name%>"
                                        socialshare-url="{{  url('/').Request::getPathInfo().(Request::getQueryString() ? ('?'.Request::getQueryString()) : '')}}"
                                        socialshare-type="feed"
                                        socialshare-via="229619774120606"
                                        socialshare-media="{{ url('/')}}<%item.image_path%><%item.image_name%>">
                                        <i class="fa fa-facebook" aria-hidden="true"></i>
                                    </a>
                                    <a href="javascript:void(0)" id="like-<%$index%>"
                                        ng-click="likeGallery(item.user_id, item.asset_id, 'like-' + $index)"
                                        class="heart-btn heart-btn-counter fbLike">
                                        <i class="fas fa-thumbs-up red heart-center" aria-hidden="true"></i>
                                      <span class="likeCounter like-<%$index%>" data-count="<%item.likes_count%>" aria-hidden="true"><%item.likes_count%></span>  
                                    </a>
                                  </div>
                              </li>
                              @endif
                              @endif                              
                          </ul>
                      </figure>

                  </div>
                  <!-- <div class="image-title text-uppercase">
                      <a href="/profile?id=<% base64_encode(item.user_id)%>">
                          <%item.business.business_name%>
                      </a>
                      <br clear="all">
                  </div> -->

              </div>

          </div>
        </div>
      </div>
      <span class="spinnerInner" us-spinner spinner-theme="inline" spinner-key="global_spinner_ab">
      <div class="loaderWrap text-center">
        <img src="images/spinner.gif" alt="Loading" class="" width="124" />
      </div>
    </span>
  </div>
  <div class="clearfix"></div>
</section><!--bg_gray-->

<div class="clear"></div>
@endsection('content')
@section('after')
<script type="text/javascript">
  $(document).ready(function(){
    $('#pinBootnew').pinterest_grid({
      no_columns: 5,
      padding_x: 2,
      padding_y: 5,
      margin_bottom: 100,
      single_column_breakpoint: 767
    });
    });
  $(window).on("load", function() {
    $("#gallery-container").css('display', 'block');
    $("#show-before-spinner").hide();
  });
</script>
@endsection