(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.SearchController
     * @module BeautyCollective.Widgets
     *
     * @description
     * SearchController is responsible for search listings
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('SearchController', SearchController);

    /* @ngInject */

    function SearchController($sanitize,$q, Logger, Spinner, SearchModel) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        self.selected = true;
		init();
       
        /**
         * [init description]
         * @return {void}
         */
        function init() {
           Logger.getInstance('SearchController').info('Search Controller has initialized');
           self.selected = true;
           self.lastFoundWord = null;
           self.currentIndex = null;
           self.justChanged = false;
           self.searchTimer = null;
           self.searching = false;
           self.pause = 500;
           self.minLength = 3;
        }

        self.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };

        self.searchRecord = function(q) {
             Spinner.start();
            var deffered =  $q.defer();
            if(!q && q.length <3){
                return;
            }
            return SearchModel.findAll({
                'q': self.q,
                'post': self.post,
                'state': self.state
            }).then(function(responce) {
                Spinner.stop();
                return responce.list;
            }, function(error) {
                 Spinner.stop();
                return [];
            });

        };
        self.handleSelection = function(item) {
            self.q = item;
            self.selected = true;
        };

		


        if (self.userPause) {
            self.pause = self.userPause;
        }

        self.processResults = function(responseData) {
            if (responseData && responseData.length > 0) {
                self.results = [];
                var titleFields = [];
                if (self.titleField && self.titleField != "") {
                    titleFields = self.titleField.split(",");
                }

                for (var i = 0; i < responseData.length; i++) {
                    // Get title variables
                    var titleCode = "";

                    for (var t = 0; t < titleFields.length; t++) {
                        if (t > 0) {
                            titleCode = titleCode +  " + ' ' + ";
                        }
                        titleCode = titleCode + "responseData[i]." + titleFields[t];
                    }

                    // Figure out description
                    var description = "";

                    if (self.descriptionField && self.descriptionField != "") {
                        eval("description = responseData[i]." + self.descriptionField);
                    }

                    // Figure out image
                    var image = "";

                    if (self.imageField && self.imageField != "") {
                        eval("image = responseData[i]." + self.imageField);
                    }

                    var resultRow = {
                        title: eval(titleCode),
                        description: description,
                        image: image,
                        originalObject: responseData[i]
                    }

                    self.results[self.results.length] = resultRow;
                }


            } else {
                self.results = [];
            }
			
			 Spinner.stop();
        }

        self.searchTimerComplete = function(str) {
            if (str.length >= self.minLength) {
                if (self.localData) {
                    var searchFields = self.searchFields.split(",");

                    var matches = [];

                    for (var i = 0; i < self.localData.length; i++) {
                        var match = false;

                        for (var s = 0; s < searchFields.length; s++) {
                            var evalStr = 'match = match || (self.localData[i].' + searchFields[s] + '.toLowerCase().indexOf("' + str.toLowerCase() + '") >= 0)';
                            eval(evalStr);
                        }

                        if (match) {
                            matches[matches.length] = self.localData[i];
                        }
                    }

                    self.searching = false;
                    self.processResults(matches);
                    self.$apply();


                } else {
Spinner.start();
                    SearchModel.findAll({'q':self.searchStr,
                         'post':self.post,
                         'state':self.state}).then(function(responce){
                             self.selected = false;
                             self.searching = false;
                             self.processResults(responce.list);
                         },function(error){
                             Spinner.stop();
                         });
                   
                }
            }

        }

        self.hoverRow = function(index) {
            self.currentIndex = index;
        }

        self.keyPressed = function(event) {
           
            if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                if (!self.searchStr || self.searchStr == "") {
                    self.showDropdown = false;
                } else {

                    if (self.searchStr.length >= self.minLength) {
                        self.showDropdown = true;
                        self.currentIndex = -1;
                        self.results = [];

                        if (self.searchTimer) {
                            clearTimeout(self.searchTimer);
                        }

                        self.searching = true;
                        self.searchTimer = setTimeout(function() {
                            self.searchTimerComplete(self.searchStr);
                        }, self.pause);
                    }


                }

            } else {
                event.preventDefault();
            }
        }

        self.selectResult = function(result) {
            self.searchStr = result.title;
            self.selectedObject = result;
            self.showDropdown = false;
            self.results = [];
            //self.$apply();
        }
    }
})();
