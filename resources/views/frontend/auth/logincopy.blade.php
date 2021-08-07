@extends('frontend.layouts.account') @section('content')
<!--<section class="container animated fadeIn">-->
     @include('frontend.includes.hearderportion')
<!--</section>-->
<link href="{{ captcha_layout_stylesheet_url() }}" type="text/css" rel="stylesheet">
<div class="clear"></div>
<section class="bg_gray border_top login_container">
    <div class="container">
        <div class="row" style="padding-top: 80px;padding-bottom: 80px;">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-4">
                    <div class="login_info">
                        <h1>Login</h1>
                        <h2 style="margin-bottom: 20px;" class="visible-md-block visible-lg-block">Its quick and easy..</h2>
                        </div>
                    </div>
                    <div class="col-md-4 vertical-seprator">
                    <div class="login_form">
                        <!-- /login form -->
					
                        {!! Form::open(['url' => 'auth/login', 'class' => 'form-horizontal', 'role' => 'form', 'id' => 'login-frm']) !!} @include('includes.partials.messages')
                        <div class="form-group">
                            {!! Form::label('email', trans('validation.attributes.email'), ['class' => 'control-label sr-only']) !!}
                            <div class="col-md-12">
                                {!! Form::input('email', 'email', old('email'), ['class' => 'form-control box-shadow--4dp', 'placeholder'=>'Username']) !!}
                            </div>
                        </div>
                        <div class="form-group">
                            {!! Form::label('password', trans('validation.attributes.password'), ['class' => 'control-label sr-only']) !!}
                            <div class="col-md-12">
                                {!! Form::input('password', 'password', null, ['class' => 'form-control box-shadow--4dp', 'placeholder'=>'Password','id'=>'password', 'autocomplete'=>'off']) !!}
							</div>
                        </div>

                        <?php
                        if (session()->has('loginretries'))
                        {
                            $loginretries = session('loginretries');
                        }
                        ?>
                        <input type="hidden" name="loginretries" id="loginretries" value="{{$loginretries}}">
                        @if($loginretries >= 2)
                            <div class="g-recaptcha" data-sitekey="{{env('GOOGLE_RECAPTCHA_KEY')}}">
                            </div>
                        {{--<div class="form-group">--}}
                            {{--<div class="col-md-12">--}}
                                {{--{!! captcha_image_html('LoginCaptcha') !!}--}}
                                {{--<div id="tapa" style="background-color: #ffffd9;height: 10px;width: 150px;position: relative;top: -10px;"></div>--}}
                                {{--<input type="text" id="CaptchaCode" name="CaptchaCode">--}}
                            {{--</div>--}}
                        {{--</div>--}}
                        @endif
                        <div class="form-group">
                            <div class="col-md-12">
                                <div class="checkbox">
                                    <label>
                                        {!! Form::checkbox('remember',null,null,['id'=>'rememberMe']) !!} Show password
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="col-md-12">
                                {!! Form::submit(trans('labels.login_button'), ['class' => 'btn btn-primary box-shadow--4dp']) !!}
                            </div>
                        </div>
                        
                        {!! Form::close() !!}
                        <!-- ./login form -->
                        </div>
                    </div>
                    <div class="col-md-4 login_links">
                        <div class="form-group">
                            <div class="col-md-12 btn-login">
                                <a href="/auth/login/facebook" title="login with facebook" class="btn-link facebook-login"> Login Via <span>Facebook</span></a>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-12 btn-login">
                                {!! link_to('password/email', 'Forgotten Password?', ['class' => 'btn-link forgot-password']) !!}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
