@extends('frontend.layouts.account') 
@section('content')
<div class="search_header classified-all-banner" >
    <div class="container" style="width:100%;">
        <div class="row">
            <!-- use sub_header as class -->
            <div class="main-header" >
                <div class="col-md-12 col-sm-12 col-xs-12" style="padding:0px;">
                    <div class="row pg-search-listing-banner">
                        <!-- slider class ="myclass" -->
                        <div  class="row col-md-12 col-sm-12 col-xs-12 padd0">
                            <div><img class="img-responsive responsive" src="images/listing-pg-banner.png" style="width: 100%"></div>
                        </div>                
                    </div>

                </div>

            </div>
        </div>
    </div>
</div>

<div class="deals" ng-controller="ClassifiedController">

    <div class="container">
        <div class="row">
            <div class="deals-header">
                <div class="clearfix">
                    <div class="col-md-6 col-sm-3 col-xs-9">
                        <h3>Classifieds</h3>
                    </div>

                </div>
            </div>
        </div>
        <style> .ng-cloak { display: none !important; } </style>
        <div class="row ng-cloak" ng-show="showrecords == 1"   infinite-scroll='loadMore()' infinite-scroll-distance='2' infinite-scroll-disabled='busy' infinite-scroll-immediate-check="false" infinite-scroll-container='".content"' infinite-scroll-parent="true">
            <div  class="col-md-4 col-sm-6" ng-repeat="result in records">
                                    <div class="listing_item card clearfix mb-15">
                                        <div class="media">
                                            <div class="media-left">
                                                    <a  href="classifieds?id=<%base64Convertion(result.id)%>">
                                                    <figure class="square120" >                                                                                                                
                                                       <img ng-if="result.assets[0].path" src="<% result.assets[0].path+ result.assets[0].name %>" alt="deals-icon-1" >
                                                       <img ng-if="!result.assets[0].path.length" src="/images/user_pic.jpg" alt="deals-icon-1" fallback-src="">
                                                    </figure>
                                                </a>
                                                <div class="px-10 pt-5">                                                     
                                                    <span class="review_rating rr" ng-init="rate = result.user.rating" style="font-size: 6px;margin: 0;padding: 0;">
                                                        <uib-rating ng-model="rate" max="5" readonly="true" titles="['one','two','three','four','five']"
                                                                    aria-labelledby="default-rating" class="rating"></uib-rating>
                                                    </span>
                                                    <div class="clear"></div>
                                                    <span style="font-size: 12px;"  class="ng-binding ng-scope">
                                                        Reviews (<%result.user.review_to.length%>)
                                                    </span>
                                                </div>
                                            </div>                                              
                                            <div class="media-body pr-15">
                                                <div class="text-left">
                                                    <h4  class="truncate cardTitle ng-scope" title="Gone free 03">                                                        
                                                        <a href="classifieds?id=<%base64Convertion(result.id)%>">
                                                            <span  class="ng-binding ng-scope" ng-bind-html="result.title">                                                               
                                                            </span>
                                                        </a>
                                                    </h4>

                                                    <a class="cardInfo overflow-hidden ng-scope" >
                                                        <p ng-bind-html="htmlToPlaintext(result.description) | limitTo : 200" class="ng-binding"></p>
                                                    </a>                                                                                                        
                                                </div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                        <div class="px-10">
                                            <ul class="social_icon listing_social_links card-footer" style="list-style-type:  none; padding-left: 5px;">
                                                  <li class="search_pg_white_color" style="float: left;">                                                    
                                                    <span class="location-allclassifeid" >
                                                        <i class="fa fa-map-marker"></i>
                                                        <% result.suburb | limitTo : 15 %>,
                                                        <% result.state | limitTo : 5 %>
                                                    </span>                                                    
                                                </li>
                                                <li >
                                                     <a href="profile?id=<%base64Convertion(result.user_id)%>"><% result.user.name %></a>
                                                </li>
                                            </ul>
                                        </div>
                                        <ul class="left_area">
                                            <!-- ngIf: data.type == 'job11' -->
                                        </ul>
                                    </div>
                                </div>
                
                
                
                
                
            </div>
        </div>
    </div>



@section('after-scripts-end')
{!! HTML::script('apps/widgets/listing/classifiedall.js') !!}
@endsection

@include('frontend.includes.latestreviews')
@include('frontend.includes.businessreview')
@include('frontend.includes.sponcerslider')
@endsection
