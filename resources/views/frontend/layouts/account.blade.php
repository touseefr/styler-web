<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- Google Tag Manager -->
        <script>(function(w, d, s, l, i){w[l] = w[l] || []; w[l].push({'gtm.start':
                    new Date().getTime(), event:'gtm.js'}); var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer'?'&l=' + l:''; j.async = true; j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-NNJPZL6');</script>
        <!-- End Google Tag Manager -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="-1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>Stylerzone</title>
        <link rel="icon" type="image/png" href="{{url('favicon.png')}}" />
        <script type="text/javascript">
            var csrf_token = '{!! csrf_token() !!}';
            var main_url = "{{URL('/')}}";
            var publishable_key = "<?php echo base64_encode(env('STRIPE_KEY')); ?>";
            var booking_url = "{{env('StylerBook_Url')}}";
        </script>
        <?php
        //  Not include libraries on following pages
        $notShowOn = array(
            "galleryall",
            "deals",
            "classifieds",
            "jobs",
            "business",
            'gallery'
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
        <meta property="fb:app_id"             content="<?php echo env('FACEBOOK_CLIENT_ID'); ?>"/>
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
        {!!  HTML::style(elixir('css/frontend-vendor.css') ) !!}
        <?php
        $pathis = explode('/', Request::path())[0];
        ?>
        @if(!in_array($pathis, $notShowOn))
        {!! HTML::style('new_assets/css/trix.css' ) !!}
        <link href="{{url('new_assets/css/custom.css')}}" rel="stylesheet">
        <link href="{{url('new_assets/css/custom_old.css')}}" rel="stylesheet">
        <link href="https://rawgit.com/GMaxera/angularjs-slider/master/dist/rzslider.css" rel="stylesheet">

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

        {{-- @if(Request::path()=="search" || Request::path()=="galleryall" || Request::path()=="allclassified" ) --}}
        @if(Request::path()=="search" || Request::path()=="galleryall" || Request::path()=="allclassified" )
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
        @if(!in_array(Request::path(), $notShowOn))
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
            background-size:240px;

            }
        </style>
        @endif
        {!! HTML::style('new_assets/css/jquery.dataTables.min.css') !!}
        {!! HTML::style('new_assets/css/buttons.dataTables.min.css' ) !!}


        @yield('after-styles-end')

        <!-- Facebook Pixel Code -->
        <script>
            !function(f, b, e, v, n, t, s)
            {if (f.fbq)return; n = f.fbq = function(){n.callMethod?
                    n.callMethod.apply(n, arguments):n.queue.push(arguments)};
            if (!f._fbq)f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)}(window, document, 'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1124445164574918');
            fbq('track', 'PageView');</script>
    <noscript><img height="1" width="1" style="display:none"
                   src="https://www.facebook.com/tr?id=1124445164574918&ev=PageView&noscript=1"
                   /></noscript>
    <!-- End Facebook Pixel Code -->
    <style type="text/css">
        .fb_dialog {
            /* right: 18pt !important; */
            bottom: 52pt !important;
            background: transparent !important;
        }
        .fb_dialog iframe {
            bottom: 70px !important;

        }
        /* .navbar-fixed-bottom, .navbar-fixed-top {
           z-index: 3147483647 !important;
        }
        #fb-root iframe{
            z-index: 2147483637 !important;
        } */
        /* #emailconfirm-popup + .emailOverlay{
            z-index:3147483650 !important;
        }*/

        input[type="text"].input-search-pgs::placeholder {  

            /* Firefox, Chrome, Opera */ 
            text-align: center; 
        } 

        /*        #emailconfirm-popup {
                    z-index: 3147483655 !important;
                } */

    </style>
</head>

<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NNJPZL6"
                      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <!--for the spinner loading at start of page-->
    @if(trim(Request::path())!="account" && trim(Request::path())!="search"  && trim(Request::path())!="galleryall" && !in_array(Request::path(), $notShowOn))
    <div class="se-pre-con"></div>
    @endif
    <!--Ends-->
    <div class="content">
        <a href="#" id="scroll" style="display: none;" class="margin_for_views"><span></span></a>
        <!------------START : Header Block------------>
        @include('frontend.includes.'.$header_name)
        <!------------END : Header Block------------>
        <!--other content-->

        <main <?php echo (Auth::check() && isset(Auth::user()->roles[0]) && Auth::user()->roles[0]->name != "JobSeeker" && isset(Auth::user()->UserActiveSubscription()->trial_status) && (Auth::user()->UserActiveSubscription()->trial_status == 1 || Auth::user()->UserActiveSubscription()->trial_status == 0)) ? 'class="pt-50"' : '' ?>>
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
    {!! HTML::script('build/js/angular.js') !!}
    <script src="https://rawgit.com/angular-slider/angularjs-slider/master/dist/rzslider.js"></script>
    {!! HTML::script('new_assets/js/angular-trix.min.js') !!}
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

    {!! HTML::script(elixir('js/application.js')) !!}
    {!! HTML::script('new_assets/js/angular-payments.min.js') !!}
    {!! HTML::script('apps/modules/jobs/jobsController.js') !!}
    {!! HTML::script('apps/modules/marketplace/marketplaceController.js') !!}
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
                user: '{!!Auth::check() ? json_encode(array("pc_user_status"=>Auth::user()->pc_user_status,"promo_code"=>Auth::user()->promo_code)) : '' !!}',
                        roles : '{!!Auth::check() ? json_encode(Auth::user()->roles->toArray()) : '' !!}',
                        user_subscription:'{!!Auth::check() ? json_encode(Auth::user()->UserSubscription->toArray()) : '' !!}',
                        permissions : '{!!Auth::check() ? json_encode(Auth::user()->permissions) : '' !!}',
                        booking_url: "<?php echo env('StylerBook_Url'); ?>"
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


@if(Request::path()!='search' && Request::path()!='galleryall')
<style type="text/css">
    .spinner_overlay.displayme {
        display: block;
    }
    .img-show-spinner{
        display: block;
        position: relative;
        left: 50%;
        top: 50%;
        margin-left:-110px;
        margin-top:-68px;
        width:240px;
    }
</style>

<span us-spinner spinner-theme="global" spinner-key="global_spinner">
    <div class="spinner_overlay">
        <img src="{{Url('')}}/images/spinner.gif"  class="img-show-spinner"/>
    </div>
</span>
@endif
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
@if(!in_array(Request::path(), $notShowOn))
<script type="text/javascript">
        $(window).load(function() {
        // Animate loader off screen
        $(".se-pre-con").fadeIn("slow");
        $(".se-pre-con").hide();
        });</script>
@endif
<script type="text/javascript">
    $(document).ready(function(){

    $(".navbar-deals .nav-tabs a").click(function(){
    var vtarget = $(this).attr('href');
    var othertabs = ['#deals', '#classifieds', '#jobs', '#BusinessForSale']
            $.each(othertabs, function(index, value){
            if (vtarget != value){
            $(value).hide();
            }
            });
    $(vtarget).fadeIn('slow');
//        setTimeout(function(){
////       s $(vtarget).show();
//        },200)


    });
    });
</script>
<!--* old layout script start here-->

</html>
