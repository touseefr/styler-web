(function() {
  'use strict';
 /**
   * @ngdoc overview
   * @name PasswordStrength
   * @module PasswordStrength
   *
   * @description
   * This is an independed module. This module supplly password strength checker
   * set field validatity 'strength'
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */

  angular
    .module('PasswordStrength', []);

  /**
   * @ngdoc Factory
   * @name PasswordStrength.Factory.StrongPass
   * @module PasswordStrength
   *
   * @description
   * Helper factory for password strength directive 
   *
   * Usage :
   * <input type="password" password-strength />
   * 
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('PasswordStrength')
    .factory('StrongPass', StrongPassFactory);

  /** @ngInject */
  function StrongPassFactory() {

    var StrongPass = {
      options: {

        minChar: 6, // too short while less than this

        passIndex: 2, // Weak

        // output verdicts, colours and bar %
        label: 'Password strength: ',

        verdicts: [
          'Too Short',
          'Very weak',
          'Weak',
          'Good',
          'Strong',
          'Very strong'
        ],

        colors: [
          '#ccc',
          '#500',
          '#800',
          '#f60',
          '#050',
          '#0f0'
        ],

        width: [
          '0%',
          '10%',
          '30%',
          '60%',
          '80%',
          '100%'
        ],

        // tweak scores here
        scores: [
          10,
          15,
          25,
          45
        ],

        // when in banned list, verdict is:
        bannedPass: 'Not allowed',

        // styles
        passStrengthZen: 'div.pass-container',

        passbarClassZen: 'div.pass-bar', // css controls

        passbarHintZen: 'div.pass-hint',

        // output
        render: true, // it can just report for your own implementation

        injectTarget: null,

        injectPlacement: 'after',
        barWidth: '200px'
      },

      bannedPasswords: [
        '123456',
        '12345',
        '123456789',
        'password',
        'iloveyou',
        'princess',
        'rockyou',
        '1234567',
        '12345678',
        'abc123',
        'nicole',
        'daniel',
        'babygirl',
        'monkey',
        'jessica',
        'lovely',
        'michael',
        'ashley',
        '654321',
        'qwerty',
        'password1',
        'welcome',
        'welcome1',
        'password2',
        'password01',
        'password3',
        'p@ssw0rd',
        'passw0rd',
        'password4',
        'password123',
        'summer09',
        'password6',
        'password7',
        'password9',
        'password8',
        'welcome2',
        'welcome01',
        'winter12',
        'spring2012',
        'summer12',
        'summer2012'
      ],

      /**
       * @constructor
       * @param {DOMElement} element Base element to attach to
       * @param {Object} options* Options to merge in / attach events from
       * @fires StrongPass#ready
       * @returns SrongPass
       */
      initialize: function(element, options) {
        this.setOptions(options);
        this.element = element;
        this.options.render && this.createBox();
        this.attachEvents();
      },
      setOptions: function(options) {
        angular.extend(this.options, options);
      },
      /**
       * @description Attaches events and saves a reference
       * @returns {StrongPass}
       */
      attachEvents: function() {
        // only attach events once so freshen
        this.element.on('keyup', function(event) {
          this.runPassword()
        }.bind(this));

        return this;
      },

      /**
       * @description Attaches pass elements.
       * @returns {StrongPass}
       */
      createBox: function() {
        //todo: should be templated
        var o = this.options;

        var template = '<div class="pass-container" style="width: ' + o.barWidth + ';"><div class="pass-bar"></div><div class="pass-hint"></div></div>';

        this.element.after(template);
        this.pass_container = this.element.next();
        //hide container by default
        this.pass_container.hide();
        this.txtbox = this.pass_container.find(o.passbarHintZen);
        this.stdbar = this.pass_container.find(o.passbarClassZen);

        return this;
      },

      /**
       * @description Runs a password check on the keyup event
       * @param {Object} event*
       * @param {String} password* Optionally pass a string or go to element getter
       * @fires StrongPass#fail StrongPass#pass
       * @returns {StrongPass}
       */
      runPassword: function(event, password) {
        password = password || this.element.val();

        var score = this.checkPassword(password),
          index = 0,
          o = this.options,
          s = angular.copy(o.scores),
          verdict;
        this.displayContianer(password);
        if (this.bannedPasswords.indexOf(password.toLowerCase()) !== -1) {
          verdict = o.bannedPass;
        } else {
          if (score < 0 && score > -199) {
            index = 0;
          } else {
            s.push(score);
            s.sort(function(a, b) {
              return a - b;
            });
            index = s.indexOf(score) + 1;
          }

          verdict = o.verdicts[index] || o.verdicts.getLast();
        }

        if (o.render) {
          this.txtbox.text([o.label, verdict].join(''));

          this.stdbar.css({
            width: o.width[index] || o.width.getLast(),
            background: o.colors[index] || o.colors.getLast()
          });
        }

        /**
         * @event StrongPass#fail,StrongPass#pass
         */
        this.passed = (o.verdicts.indexOf(verdict) >= o.passIndex);

        if (this.passed && o.onPass) {
          o.onPass(index, verdict);
        } else if (!this.passed && o.onFail) {
          o.onFail(index, verdict)
        }

      },

      displayContianer: function(password) {
        if (password) {
          this.pass_container.show();
          return;
        }
        this.pass_container.hide();
      },

      /**
       * @type {Array}
       * @description The collection of regex checks and how much they affect the scoring
       */
      checks: [
        /* alphaLower */
        {
          re: /[a-z]/,
          score: 1
        },
        /* alphaUpper */
        {
          re: /[A-Z]/,
          score: 5
        },
        /* mixture of upper and lowercase */
        {
          re: /([a-z].*[A-Z])|([A-Z].*[a-z])/,
          score: 2
        },
        /* threeNumbers */
        {
          re: /(.*[0-9].*[0-9].*[0-9])/,
          score: 7
        },
        /* special chars */
        {
          re: /.[!@#$%^&*?_~]/,
          score: 5
        },
        /* multiple special chars */
        {
          re: /(.*[!@#$%^&*?_~].*[!@#$%^&*?_~])/,
          score: 7
        },
        /* all together now, does it look nice? */
        {
          re: /([a-zA-Z0-9].*[!@#$%^&*?_~])|([!@#$%^&*?_~].*[a-zA-Z0-9])/,
          score: 3
        },
        /* password of a single char sucks */
        {
          re: /(.)\1+$/,
          score: 2
        }
      ],

      checkPassword: function(pass) {
        var score = 0,
          minChar = this.options.minChar,
          len = pass.length,
          diff = len - minChar;

        (diff < 0 && (score -= 100)) || (diff >= 5 && (score += 18)) || (diff >= 3 && (score += 12)) || (diff === 2 && (score += 6));

        angular.forEach(this.checks, function(check) {
          pass.match(check.re) && (score += check.score);
        });

        // bonus for length per char
        score && (score += len);
        return score;
      }
    };

    return StrongPass;
  }



  /**
   * @ngdoc Directive
   * @name PasswordStrength.Directive.passwordStrength
   * @module PasswordStrength
   *
   * @description
   * Determine the strength of password
   *
   * Usage :
   * <input type="password" password-strength />
   * 
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('PasswordStrength')
    .directive('passwordStrength', passwordStrengthDirective);

  /* @ngInject */
  function passwordStrengthDirective(StrongPass) {
    return {
      restrict: 'A',
       require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {
        StrongPass.initialize(element, {
          barWidth: '100%',
          render: true,
          onPass: function(score, verdict) {
            ngModel.$setValidity('strong', true);
          },
          onFail: function(score, verdict) {
            ngModel.$setValidity('strong', false);
          }
        });
      }
    };
  }
}());
