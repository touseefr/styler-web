<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <link rel="icon" href="{{url('favicon.png')}}">
        <title>Stylerzone</title>
        <script type="text/javascript">
            var csrf_token = '{!! csrf_token() !!}';
            var main_url = "{{URL('/')}}";
            var stripe_publishable_key = "{{env('STRIPE_KEY')}}"
        </script>
        <?php
        //  Not include libraries on following pages            
        $notShowOn = array(
            "galleryall",
            "deals",
            "classifieds",
            "jobs",
            "business",
            'gallery/{id}'
        );
        ?>                        
        @if(View::hasSection('twitter'))

        @yield('twitter')

        @else
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Stylerzone" />
        <meta name="twitter:description" content="" />
        <meta name="twitter:image" content="{{url('new_assets/images/banner-bg.png')}}" />
        @endif
        @if(View::hasSection('facebook'))
        @yield('facebook')
        @else
        <meta property="og:url"                content="{{url('/')}}" />
        <meta property="og:type"               content="article" />
        <meta property="og:title"              content="Stylerzone" />
        <meta property="og:description"        content="" />
        <meta property="og:image"              content="{{url('new_assets/images/banner-bg.png')}}" />
        <meta property="fb:app_id"             content="<?php echo env('FACEBOOK_CLIENT_ID'); ?>"/   >
              @endif
              <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">

        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <!-- Bootstrap core CSS -->
        <link href="{{url('new_assets/css/bootstrap.min.css')}}" rel="stylesheet">        
        <link href="{{url('new_assets/css/fontawesome-all.css')}}" rel="stylesheet">

        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <link href="{{url('new_assets/css/ie10-viewport-bug-workaround.css')}}" rel="stylesheet">

        <!--angular default css-->
        @yield('meta')
        @yield('before-styles-end')
        {!! HTML::style(elixir('css/frontend-vendor.css') ) !!}

        @if(!in_array(\Route::getCurrentRoute()->getPath(), $notShowOn))
        <link href="{{url('new_assets/css/custom.css')}}" rel="stylesheet">
        <link href="{{url('new_assets/css/custom_old.css')}}" rel="stylesheet">
        <?php
        $header_name = "header";
        $footer_name = 'footer';
        ?>
        @else
        {!! HTML::style(elixir('css/application.css') ) !!}
        <?php
        $header_name = "header_old";
        $footer_name = 'footer_old';
        ?>

        @endif

        @if(\Route::getCurrentRoute()->getPath()=="search" || \Route::getCurrentRoute()->getPath()=="galleryall" || \Route::getCurrentRoute()->getPath()=="allclassified" )
        <style type="text/css">
            .content {
                background-size: 100%;
                width: 100%;
                position:absolute;
                top: 0; bottom: 0; left: 0; right: 0;
                overflow: auto;
                z-index: 9999;
            }
        </style>
        @else
        <style type="text/css">
            .content {
                background-size: 100%;
                width: 100%;
            }
        </style>
        @endif        
        @if(!in_array(\Route::getCurrentRoute()->getPath(), $notShowOn))
        <style type="text/css">
            /* Paste this css to your style sheet file or under head tag */
            /* This only works with JavaScript,
            if it's not present, don't show loader */
            .no-js #loader { display: none;  }
            .js #loader { display: block; position: absolute; left: 100px; top: 0; }
            .se-pre-con {
                position: fixed;
                left: 0px;
                top: 0px;
                width: 100%;
                height: 100%;
                z-index: 9999;
                background: url({{url("images/spinner.gif")}}) center no-repeat #fff;
            }
        </style>
        @endif        
        {!! HTML::style('new_assets/css/jquery.dataTables.min.css') !!}     
        {!! HTML::style('new_assets/css/buttons.dataTables.min.css' ) !!}        
        @yield('after-styles-end')

        {!! HTML::style('new_assets/css/trix.css' ) !!}        
<!--        <link rel="stylesheet" type="text/css" href="http://sachinchoolur.github.io/angular-trix/assets/styles/trix.css">-->

        <!--        <link href='https://cdn.jsdelivr.net/npm/froala-editor@2.9.1/css/froala_editor.min.css' rel='stylesheet' type='text/css' />
                <link href='https://cdn.jsdelivr.net/npm/froala-editor@2.9.1/css/froala_style.min.css' rel='stylesheet' type='text/css' />-->
    </head>

    <body class="mt-50">      
        <!--for the spinner loading at start of page-->
        @if(trim(\Route::getCurrentRoute()->getPath())!="account" && !in_array(\Route::getCurrentRoute()->getPath(), $notShowOn))
        <div class="se-pre-con"></div>
        @endif
        <!--Ends-->
        <div class="content">
            <a href="#" id="scroll" style="display: none;" class="margin_for_views"><span></span></a>
            <!------------START : Header Block------------>
            @include('frontend.includes.header-business')
            <!------------END : Header Block------------>
            <!--other content-->
            <main <?php echo (Auth::check() && Auth::user()->roles[0]->name != "JobSeeker" && isset(Auth::user()->UserActiveSubscription()->trial_status) && (Auth::user()->UserActiveSubscription()->trial_status == 1 || Auth::user()->UserActiveSubscription()->trial_status == 0)) ? 'class="pt-50"' : '' ?>>
                @yield('content')
            </main>
            <!--other content end-->
            <!--footer code start here-->
            @include('frontend.includes.'.$footer_name)
            <!--footer code end here-->
        </div>
        <!-- Bootstrap core JavaScript ================================================== -->
        <!-- Placed at the end of the document so the pages load faster -->        
        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <script src="{{url('new_assets/js/ie10-viewport-bug-workaround.js')}}"></script>

        <!--old layout script start here-->


        @yield('before-scripts-end')
        {!! HTML::script('new_assets/jquery-2.2.4.min.js') !!}        
        {!! HTML::script('new_assets/js/trix.js') !!}        
<!--       <script src="//cdnjs.cloudflare.com/ajax/libs/trix/0.9.2/trix.js"></script>-->
        <!--<script type='text/javascript' src='https://cdn.jsdelivr.net/npm/froala-editor@2.9.1/js/froala_editor.min.js'></script>-->
        {!! HTML::script('build/js/angular.js') !!}
        {!! HTML::script('new_assets/js/angular-trix.min.js') !!}
<!--        <script type='text/javascript' src='http://localhost/test/angular-trix-master/dist/angular-trix.min.js'></script>-->
        <!--<script type='text/javascript' src='http://localhost/test/forala-angular/src/angular-froala.js'></script>-->

        {!! HTML::script('build/js/underscore-min.js') !!}
        {!! HTML::script('build/js/select.js') !!}
        {!! HTML::script('build/js/ui-bootstrape.js') !!} 

        {!! HTML::script('build/js/ng-flow.js') !!}
        {!! HTML::script('build/js/slick.js') !!}
        {!! HTML::script('build/js/moment.js') !!}
        {!! HTML::script('new_assets/datatable/angular-ui-utils.min.js') !!}
        {!! HTML::script('new_assets/datatable/jquery.dataTables.min.js') !!}        
        {!! HTML::script('new_assets/datatable/dataTables.bootstrap.min.js') !!}        
        {!! HTML::script('new_assets/datatable/dataTables.buttons.min.js') !!}        
        {!! HTML::script(elixir('js/frontend-vendor.js')) !!}
        @yield('after-angular-load')
        {!! HTML::script('new_assets/datatable/dataTables.buttons.min.js') !!}        
        <script src="https://js.stripe.com/v2/"></script>
        <script type="text/javascript">
            $(document).ready(function(){
            Stripe.setPublishableKey("{{env('STRIPE_KEY')}}");
            });
        </script>
        {!! HTML::script('new_assets/js/angular-payments.min.js') !!}
        {!! HTML::script(elixir('js/application.js')) !!}
        {!! HTML::script('apps/modules/jobs/jobsController.js') !!}   
        {!! HTML::script('apps/modules/users/chnage.password.js') !!} 
        {!! HTML::script('js/frontend/gallery/gallery.js') !!}
        {!! HTML::script('js/magnific.js') !!}              
        {!! HTML::script('js/bootstrap.min.js') !!}                      
        {!! HTML::script('apps/modules/reviews/reviewController.js') !!}   


        @yield('after-scripts-end')
        <script type="text/javascript">
            var lgin_user_id = '{{Auth::check() ? Auth::user()->id : "" }}';
            angular
                    .module('BeautyCollective.bLaravel')
                    .constant('Laravel', {
                    roles : '{!!Auth::check() ? json_encode(Auth::user()->roles->toArray()) : '' !!}',
                            permissions : '{!!Auth::check() ? json_encode(Auth::user()->permissions) : '' !!}'
                    });
            $.fn.stars = function() {
            return $(this).each(function() {

            var rating = $(this).data("rating");
            var numStars = $(this).data("numStars");
            var fullStar = new Array(Math.floor(rating + 1)).join('<i class="fa fa-star"></i>');
            var halfStar = ((rating % 1) !== 0) ? '<i class="fa fa-star-half-empty"></i>': '';
            var noStar = new Array(Math.floor(numStars + 1 - rating)).join('<i class="fa fa-star-o"></i>');
            $(this).html(fullStar + halfStar + noStar);
            });
            }
        </script>
        @yield('after')
        <script src="{{url('new_assets/js/account_scirpt.js')}}"></script>
        <div class="fade-in hide"></div>
    <toaster-container toaster-options="{'close-button': true}"></toaster-container>    
    <span us-spinner spinner-theme="global" spinner-key="global_spinner">
        <div class="spinner_overlay"></div>
    </span>
    <!-- old layout script start here-->
</body>

<!-- old layout script start here -->

<?php
if (!Auth::guest()):
    $user_role = App\User::get_role(@Auth::user()->id);
    $paid_roles = App\User::paid_roles();
    if (@Auth::check() && in_array($user_role, $paid_roles)) {
        //return $next($request);
    } else {
        ?>
        <style>
            .paid_roles{
                display:none !important;
            }
        </style>
        <?php
    } else :

endif
?>
@if(!in_array(\Route::getCurrentRoute()->getPath(), $notShowOn))
<script type="text/javascript">
            $(window).load(function() {
            // Animate loader off screen
            $(".se-pre-con").fadeIn("slow");
            $(".se-pre-con").hide();
            });
</script>
@endif

<!--* old layout script start here-->

</html>
