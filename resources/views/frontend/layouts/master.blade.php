<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/png"  href="{{url('favicon.png')}}" />
        <meta name="_token" content="{{ csrf_token() }}" />
        <title>@yield('title', app_name())</title>
        <meta name="description" content="@yield('meta_description', 'Default Description')">        
        @yield('meta')
        @yield('before-styles-end')
        {!! HTML::style(elixir('css/frontend-vendor.css') ) !!}
        {!! HTML::style('css/application.css') !!}
        @yield('after-styles-end')		
        <!-- Fonts -->
        <link href='//fonts.googleapis.com/css?family=Roboto:400,300' rel='stylesheet' type='text/css'>
        <!-- Place favicon.ico in the root directory -->
        {!! HTML::script("js/vendor/modernizr-2.8.3.min.js") !!}
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        @include('frontend.includes.nav')

        <div class="container-fluid">
            @include('includes.partials.messages')
            @yield('content')
        </div>
        <!-- container -->

        @yield('before-scripts-end')
        {!! HTML::script(elixir('js/frontend-vendor.js')) !!}
        @yield('after-scripts-end')
		{!! HTML::script('js/frontend/gallery/gallery.js') !!} @yield('after-scripts-end')
        @include('includes.partials.ga')
         <span us-spinner spinner-theme="global" spinner-key="global_spinner" loadingImage="/path/to/loading.gif"></span>
         <script type="text/javascript">
    angular
    .module('BeautyCollective.bLaravel')
    .constant('Laravel', {
        roles : '{!!Auth::check() ? json_encode(Auth::user()->roles) : '' !!}'
    });
    </script>
    </body>
</html>
