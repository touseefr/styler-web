<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <link rel="icon" href="../favicon.png">
        <title>Stylerzone</title>
        <link href="{{url('new_assets/css/bootstrap.min.css')}}" rel="stylesheet">
        <link href="{{url('new_assets/css/custom.css')}}" rel="stylesheet">
        <link href="{{url('new_assets/css/fontawesome-all.css')}}" rel="stylesheet">
        <link href="{{ captcha_layout_stylesheet_url() }}" type="text/css" rel="stylesheet">
        <script src="{{url('new_assets/jquery-2.2.4.min.js')}}"></script>
        <style type="text/css">
        </style>
        <script src='https://www.google.com/recaptcha/api.js'></script>
        
    </head>
    <body class="loginPage">
        <!--        <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #ffcb0e !important;border-color: #ffcb0e !important;min-height: unset;">
                    <div class="row hd-trial-container " style="background-color: #ffcb0e;">
                        <div class="container text-center">
                            <div class="col-md-12 text-center hd-trial-content" style="padding: 9px 0px;">
                                <span style="font-size: 18px;font-weight: bolder;color: #3e4c5b;text-transform: uppercase;">Beta Launch</span>
                            </div>
                        </div>
                    </div>
                </nav>-->
        <div class="login_section">
            <div class="section">
                <div class="login_form">
                    <div class="header-section">
                        <div class="logo_img text-center"><img src="../STZ_LogoMaster_Green_web.svg"></div>
                        <div class="text-center title_text">Stylerzone Log In</div>
                    </div>
                    <div class="body-section">
                        <div class="col-xs-12 "><a href="/auth/login/facebook" title="login with facebook" class="attrflex" style="width: 100%;"><div class="facebook"><i class="fab fa-facebook-f"></i></div><div class="facebook-text">LOG IN WITH FACEBOOK</div></a>
                        </div>
                        <div class="col-xs-12"><div class="or_space text-center">or</div></div>
                        {!! Form::open(['url' => 'auth/login', 'class' => 'form-horizontal', 'role' => 'form', 'id' => 'login-frm']) !!}
                          <input type="hidden"  id="previous_url" name="previous_url" value="<?php echo session()->get('previous_url');?>"/>
                        <div class="col-xs-12" style="min-height: 0">
                            @include('includes.partials.messages')
                        </div>
                        <div class="clearfix">
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <i class="far fa-user"></i>
                                        </div>
                                        {!! Form::input('email', 'email', old('email'), ['class' => 'form-control box-shadow--4dp', 'placeholder'=>'Email Address']) !!}
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12">
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <i class="fas fa-lock"></i>
                                        </div>
                                        {!! Form::input('password', 'password', null, ['class' => 'form-control box-shadow--4dp', 'placeholder'=>'Password','id'=>'password', 'autocomplete'=>'off']) !!}  <span class="fa fa-fw fa-eye field-icon toggle-password"></span>
                                    </div>
                                </div>
                            </div>
                            <?php
                            if (session()->has('loginretries')) {
                                $loginretries = session('loginretries');
                            }
                            ?>
                            <input type="hidden" name="loginretries" id="loginretries" value="{{$loginretries}}">
                            @if($loginretries > 2)
                            <div class="col-xs-12">
                                <div class="g-recaptcha" data-sitekey="{{env('GOOGLE_RECAPTCHA_KEY')}}">
                                </div>
                            </div>
                            @endif
                            <div class="col-xs-12 text-center forget-password">
                                {!! link_to('password/email','Reset Password', ['class' => 'forgot-password']) !!}
                            </div>
                            <div class="col-xs-12">
                                <div class="form-group">
                                   <!--  {!! Form::submit(trans('labels.login_button'), ['class' => 'form-control login_btn btn']) !!}<i class="fas fa-chevron-right"></i> -->
                                    <button type="submit" class="form-control login_btn btn btn-green-1" >LOG IN <i class="fas fa-chevron-right"></i></button>

                                </div>
                            </div>
                            <div class="col-xs-12 text-center forget-password">
                                <div class="col-xs-6 text-left padd0">
                                    <a href="{{url('/')}}">Return To Home</a>
                                </div>
                                <div class="col-xs-6 text-right padd0">
                                    <a href="{{url('auth/register')}}">Sign Up</a>
                                </div>
                            </div>
                        </div>
                        {!! Form::close() !!}
                        <div class="footer-section">

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="login_overlay"></div>
        <script type="text/javascript">            
            var urlHash = window.location.hash;            
            var inputHash=document.getElementById('previous_url').value;           
            if(inputHash.length==0){
                document.getElementById('previous_url').value=urlHash;
            }
        </script>
    </body>
</html>
<script type="text/javascript">
    $(".toggle-password").click(function () {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var type = $("#password").attr("type");
        if (type == "text") {
            $("#password").prop('type', 'password');
        } else {
            $("#password").prop('type', 'text');
        }
    });
</script>
