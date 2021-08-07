(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name FancyDropDown
   * @module FancyDropDown
   *
   * @description
   * Has custom implementation of dropdowns built by angular UI Team
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */

  angular
    .module('FancyDropDown', []);

  /**
   * @ngdoc Directive
   * @name FancyDropDown.Directive.fancyDropdown
   * @module FancyDropDown
   *
   * @description
   * Adjust dropdown up/down by determining the window offsets
   * 
   * Example
   *  <div dropdown="" keyboard-nav="" fancy-dropdown close-on-select="false">
        <a href="" id="choiceDropdown" name="choiceDropdown" dropdown-toggle="dropdown">
          Click me for a dropdown, yo!  {{ self.selection1.Text }}
        </a>
        <div class="panel panel-default dropdown-menu fancy-dropdown" role="menu" aria-labelledby="simple-btn-keyboard-nav">
          <div class="panel-heading dropdown-heading">
            <span>Select team member</span>
          </div>
          <div class="panel-heading dropdown-filter">
            <input type="text" class="form-control" placeholder="Text input" ng-model="query" />
          </div>
          <div class="panel-body dropdown-body">
            <ul class="list-group">
              <li class="list-group-item" ng-repeat="choice in self.choices | filter:query" role="menuitem" ng-class="{ 'selected-dropdown-item' : choice.ID == self.selection1.ID }">
                <a href="#" ng-click="self.setChoice(choice.ID)">{{ choice.Text }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div> 
   * self is your controller alias instead of using scope in controller 
   *  
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('FancyDropDown')
    .directive('fancyDropdown', fancyDropdownDirective);

  /* @ngInject */
  function fancyDropdownDirective() {
    return {
      restrict: 'A',
      scope: {

      },
      link: function(scope, element, attrs) {
        var isDropUp = false,
          closeOnSelect = attrs.closeOnSelect || true;

        element.bind('click', ToggleDropUp)

        function ToggleDropUp($event) {
          var dropdownContainer = $event.currentTarget,
            position = dropdownContainer.getBoundingClientRect().top,
            buttonHeight = dropdownContainer.getBoundingClientRect().height,
            dropdownMenu = angular.element(dropdownContainer).find('.dropdown-menu'),
            menuHeight = dropdownMenu.outerHeight(),
            $win = $(window);

          if (position > menuHeight && $win.height() - position < buttonHeight + menuHeight) {
            isDropUp = true;
          } else {
            isDropUp = false;
          }
          isDropUp ? element.addClass('dropup') : (element.hasClass('dropup') ? element.removeClass('dropup') : '');

          if (closeOnSelect) {
            $event.stopPropagation();
          }

        }
      }
    };
  }
}());
