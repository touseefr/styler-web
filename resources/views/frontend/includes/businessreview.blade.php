<!------------START : Business Review Block------------>
<div class="business-review" ng-controller="SearchController">
    <h3>Share your experience</h3>
    <p></p>
    <div class="container">
        <div class="row" ng-style="{'display': showDropdownmenu ? 'block' : 'block' }" style="display: none;">
            <div class="col-sm-8 col-sm-offset-2 col-xs-12">
                <div class="search-box">
                    <div class="clearfix" >
                        <div class="col-md-10 col-sm-9 col-xs-8">
                            <input type="type" class="review_search" ng-model="bussinessStr" name="busq" placeholder="Business Name"  ng-keyup="businessSearch($event)" click-anywhere-but-here="showMenu=false">
                            <div id="" class="items search_dropdown bsearch_ddm"  >
                                <div class="title businessspinner" ng-show="showSearchmenu"><i class="fas fa-spinner fa-spin"></i></div>
                                <div class="angucomplete-searching" ng-show="!showSearchmenu && (!bsearchResults || bsearchResults.length == 0) && searchRessultFound">No results found</div>
                                <div class="item" ng-repeat="result in bsearchResults" ng-click="selectedResult(result)" ng-mouseover="self.hoverRow()">
                                    <p class="title"><% result.business_name %></p>                    
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 col-sm-3 col-xs-4">
                            @if(!Auth::id())
                            <widget-rating-home  userto="<% userto %>"  userfrom="0" businessname="<%bussinessStr%>"  ><i class="fa fa-search"></i> SEARCH</widget-rating-home>
                            @endif
                            @if(Auth::id())
                            <widget-rating-home  userto="<% userto %>"  userfrom="{{ Auth::id() }}" businessname="bussinessStr" ><i class="fa fa-search"></i> SEARCH</widget-rating-home>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
<!------------END : Business Review Block------------>