
'use strict';
// Tested with Angular 1.3, 1.4.8
angular.module('BeautyCollective.Core')
        /**
         * @ngdoc directive
         * @name scrollToEnd:scrollToEnd
         * @scope
         * @restrict A
         *
         * @description
         * Supply a handler to be called when this element is scrolled all the way to any extreme.
         * The callback must have the following signature:
         * void function (direction:'top'|'bottom'|'left'|'right')
         * If the `bindToWindow` attribute is truthy, the callback will be issued for the window
         * instead of the element that the directive is on.
         *
         * Example usage:
         * `<div scroll-to-end="scrollToEndWindow" bind-to-window="true">`
         * This will call the controller's `scrollToEndWindow` function whenever the window reaches
         * the edges when scrolling. If the div itself is a scrollable element for which the
         * handler should be called instead, remove the bind-to-window attribute entirely.
         *
         * @param {function}	emScrollToEnd   Callback to be invoked
         * @param {boolean}		bindToWindow		Bind to the window instead of the element
         *
         */
        .directive('latestReviews', function ($window) {
            // Get the specified element's computed style (height, padding, etc.) in integer form
            function getStyleInt(elem, prop) {
                try {
                    return parseInt(window.getComputedStyle(elem, null).getPropertyValue(prop), 10);
                } catch (e) {
                    return parseInt(elem.currentStyle[prop], 10);
                }
            }
            // Get the 'innerHeight' equivalent for a non-window element, including padding
            function getElementDimension(elem, prop) {
                switch (prop) {
                    case 'width':
                        return getStyleInt(elem, 'width') +
                                getStyleInt(elem, 'padding-left') +
                                getStyleInt(elem, 'padding-right');
                    case 'height':
                        return getStyleInt(elem, 'height') +
                                getStyleInt(elem, 'padding-top') +
                                getStyleInt(elem, 'padding-bottom');
                        /*default:
                         return null;*/
                }
            }
            return {
                restrict: 'E',
                scope: {
                    user: "@user"
                },
                templateUrl: 'apps/modules/reviews/latest_reviews.html',
                controller: 'LatestReviewController',
                controllerAs: '_self',
                bindToController: true,
                link: function (scope, elem, attr, LatestReviewController) {
                    var callback = scope.callback || function () {};
                    var boundToWindow = attr.bindToWindow;
                    var body = document.body;
                    var html = document.documentElement;
                    var boundElement = boundToWindow ? angular.element($window) : elem;
                    var oldScrollX = 0;
                    var oldScrollY = 0;
                    var handleScroll = function () {
                        // Dimensions of the content, including everything scrollable
                        var contentWidth;
                        var contentHeight;
                        // The dimensions of the container with the scrolling, only the visible part
                        var viewportWidth;
                        var viewportHeight;
                        // The offset of how much the user has scrolled
                        var scrollX;
                        var scrollY;
                        if (boundToWindow) {
                            // Window binding case - Populate Dimensions
                            contentWidth = Math.max(
                                    body.scrollWidth,
                                    body.offsetWidth,
                                    html.clientWidth,
                                    html.scrollWidth,
                                    html.offsetWidth
                                    );
                            contentHeight = Math.max(
                                    body.scrollHeight,
                                    body.offsetHeight,
                                    html.clientHeight,
                                    html.scrollHeight,
                                    html.offsetHeight
                                    );
                            viewportWidth = window.innerWidth;
                            viewportHeight = window.innerHeight;
                            scrollX = (window.pageXOffset || html.scrollLeft) - (html.clientLeft || 0);
                            scrollY = (window.pageYOffset || html.scrollTop) - (html.clientTop || 0);
                        } else {
                            // DOM element case - Populate Dimensions
                            var domElement = boundElement[0];
                            contentWidth = domElement.scrollWidth;
                            contentHeight = domElement.scrollHeight;
                            viewportWidth = getElementDimension(domElement, 'width');
                            viewportHeight = getElementDimension(domElement, 'height');
                            scrollX = domElement.scrollLeft;
                            scrollY = domElement.scrollTop;
                        }
                        var scrollWasInXDirection = oldScrollX !== scrollX;
                        var scrollWasInYDirection = oldScrollY !== scrollY;
                        oldScrollX = scrollX;
                        oldScrollY = scrollY;
//                        if (scrollWasInYDirection && scrollY === 0) {
//                            callback('top');
//                        } else
                        if (scrollWasInYDirection && scrollY >= (contentHeight - viewportHeight - 300)) {
                            if (LatestReviewController.next_call_status === true) {
                                LatestReviewController.getlatestreviews();
                            }
                        }
//                        } else if (scrollWasInXDirection && scrollX === 0) {
//                            callback('left');
//                        } else if (scrollWasInXDirection && scrollX === contentWidth - viewportWidth) {
//                            callback('right');
//                        }
                    };
                    boundElement.bind('scroll', handleScroll);
                    // Unbind the event when scope is destroyed
                    scope.$on('$destroy', function () {
                        boundElement.unbind('scroll', handleScroll);
                    });
                }
            };
        })
        .controller('LatestReviewController', function ($scope, $http, moment, Spinner,) {
            var _self = this;
            _self.page_number = 0;
            _self.latest_reviews = [];
            _self.next_call_status = true;

            function init() {
                getlatestreviews();
            }
            function getlatestreviews() {
                _self.next_call_status = false;
                $http({
                    method: "GET",
                    url: "getlatestreviews",
                    params: {pre_pg: _self.page_number, user_id: _self.user}
                }).then(function mySuccess(response) {
                    angular.forEach(response.data.reviews, function (value, key) {
                        _self.latest_reviews.push(value);
                    });
                    if (response.data.index_status == 0) {
                        _self.next_call_status = false;
                    } else {
                        setTimeout(function () {
                            _self.next_call_status = true;
                        }, 2000);

                    }

                    Spinner.stop();
                    _self.page_number++;
                }, function myError(response) {
                    console.log(response.statusText);
                });
            }
            ;
            _self.getlatestreviews = function () {
                Spinner.start();
                _self.next_call_status = false;
                $http({
                    method: "GET",
                    url: "getlatestreviews",
                    params: {pre_pg: _self.page_number, user_id: _self.user}
                }).then(function mySuccess(response) {
                    angular.forEach(response.data.reviews, function (value, key) {
                        _self.latest_reviews.push(value);
                    });
                    if (response.data.index_status == 0) {
                        _self.next_call_status = false;
                    } else {
                        setTimeout(function () {
                            _self.next_call_status = true;
                        }, 2000);

                    }

                    Spinner.stop();
                    _self.page_number++;
                }, function myError(response) {
                    console.log(response.statusText);
                    Spinner.stop();
                });
            };
            _self.timeSince = function (date) {
                return moment(moment(moment.utc(moment.utc(date)).toDate()).format('YYYY-MM-DD HH:mm:ss')).fromNow();
            };
            init();

            _self.base64_encode = function (value) {
                return btoa(value);
            };
            _self.base64_decode = function (value) {
                return atob(value);
            };
        });



























////
//var app = angular.module('BeautyCollective.Core');
//app.controller("controller", function ($scope) {
//    $scope.test = function () {
//        alert("hello!");
//    }
//}).directive('onScrollToBottom', function ($document) {
//    //This function will fire an event when the container/document is scrolled to the bottom of the page
//    return {
//        restrict: 'A',
//        link: function (scope, element, attrs) {
//
//            var doc = angular.element($document)[0].body;
//
//            $document.bind("scroll", function () {
//
//                //console.log('in scroll');
//                //console.log("scrollTop + offsetHeight:" + (doc.scrollTop + doc.offsetHeight));
//                //console.log("scrollHeight: " + doc.scrollHeight);
//
//                if (doc.scrollTop + doc.offsetHeight >= doc.scrollHeight) {
//                    //run the event that was passed through
//                    scope.$apply(attrs.onScrollToBottom);
//                }
//            });
//        }
//    };
//});








//
//
////var myApp = angular.module('BeautyCollective.Core');
//
//
//
//myApp.controller('DemoController', function($scope, Reddit) {
//  $scope.reddit = new Reddit();
//});
//
//// Reddit constructor function to encapsulate HTTP and pagination logic
//myApp.factory('Reddit', function($http) {
//  var Reddit = function() {
//    this.items = [];
//    this.busy = false;
//    this.after = '';
//  };
//
//  Reddit.prototype.nextPage = function() {
//    if (this.busy) return;
//    this.busy = true;
//
//    var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
//    $http.jsonp(url).success(function(data) {
//      var items = data.data.children;
//      for (var i = 0; i < items.length; i++) {
//        this.items.push(items[i].data);
//      }
//      this.after = "t3_" + this.items[this.items.length - 1].id;
//      this.busy = false;
//    }.bind(this));
//  };
//
//  return Reddit;
//});
////var myApp = angular.module('BeautyCollective.Core');
//
//myApp.controller('reviewController', function($scope, Reddit) {
//  $scope.reddit = new Reddit();
//});
//
//// Reddit constructor function to encapsulate HTTP and pagination logic
//myApp.factory('Reddit', function($http) {
//  var Reddit = function() {
//    this.items = [];
//    this.busy = false;
//    this.after = '';
//  };
//
//  Reddit.prototype.nextPage = function() {
//    if (this.busy) return;
//    this.busy = true;
//
//    var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
//    $http.jsonp(url).success(function(data) {
//      var items = data.data.children;
//      for (var i = 0; i < items.length; i++) {
//        this.items.push(items[i].data);
//      }
//      this.after = "t3_" + this.items[this.items.length - 1].id;
//      this.busy = false;
//    }.bind(this));
//  };
//
//  return Reddit;
//});

//myApp.directive('latestReviews', function() {
//  return {
//    restrict: 'E',
//    templateUrl: main_url+'/apps/modules/reviews/latest_reviews.html'
//  };
//});