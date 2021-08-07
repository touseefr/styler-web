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
        <style>
            .unsubscribe-portion {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                padding:0% 31%;
            }
            .unsubscribe-content{
                background-color: #fff;
                box-shadow: 0 0 20px rgba(255,255,255,0.4);
                z-index: 5;         
                padding: 25px 0px;
            }
            .unsubscribe-content img {
                height: 40px;
                width: 40px;
            }

            @media (max-width: 767px){
                .unsubscribe-portion {               
                    padding:7%
                }

            }


            .loginPage {
                height: 100vh;
                background-color: #f5f3f5;
                background: none;
            }
            .login_section .header-section {
                background-color: transparent;
            }
            .return-to-home-page {
                background-color: #4abdac;
                color: #fff !important;
                padding: 17px;
                border-radius: 5px;
            }
        </style>
    </head>
    <body class=" loginPage">
        <div class="unsubscribe-portion" style="">
            <div class="unsubscribe-content">                
                <div class="header-section">
                    <div class="logo_img text-center"><img src="../STZ_LogoMaster_Green_web.svg"></div>
                    <div class="text-center title_text" style="font-size: 20px;padding-bottom: 22px;">UNSUBSCRIBE REQUEST</div>
                </div>
                <div class="body-section" style="padding: 0px 48px 24px;font-size: 13px;text-align: center;">
                    <p>
                        You have successfully unsubscribed from Stylerzone basket reminder emails.If you wish to unsubscribe from all marketing emails,please <a href="{{url('auth/login')}}">login</a> to your
                        account and manage your preferences.
                    </p>                            
                    <br />
                    <p style="text-align: center;">
                        <a class="return-to-home-page" href="{{url('/')}}" style="text-decoration: none;">RETURN TO SITE</a>
                    </p>
                </div>                
            </div>
            <!--            <div class="section">
                            <div class="login_form">
                                <div class="header-section">
                                    <div class="logo_img text-center"><img src="../STZ_LogoMaster_Green_web.svg"></div>
                                    <div class="text-center title_text">UNSUBSCRIBE REQUEST</div>
                                </div>
                                <div class="body-section" style="padding: 0px 48px 24px;font-size: 13px;text-align: center;">
                                        <p>
                                            You have successfully unsubscribed from Stylerzone basket reminder emails.If you wish to unsubscribe from all marketing emails,please <a href="{{url('auth/login')}}">login</a> to your.
                                            account and manage your preferences.
                                        </p>                            
                                        <br />
                                        <p style="text-align: center;">
                                        <a class="return-to-home-page" href="{{url('/')}}">RETURN TO SITE</a>
                                        </p>
                                </div>
                            </div>
                        </div>-->
        </div>
        <div class="login_overlay"></div>
    </body>
</html>
