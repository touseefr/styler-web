
<nav class="navbar navbar-default navbar-fixed-top fixed-header <?php echo (Auth::check())?'loggedin':'';?>">
<div class="row hd-trial-container " style="background-color: #ffcb0e;">
        <div class="container text-center">
<!--            <div class="col-md-12 text-center hd-trial-content" style="padding: 9px 0px;">
                <span style="font-size: 18px;font-weight: bolder;color: #3e4c5b;text-transform: uppercase;">Beta Launch</span>
            </div>-->
            <?php
            if (Auth::check() && isset(Auth::user()->UserActiveSubscription()->trial_status)) {
                if ((Auth::user()->UserActiveSubscription()->trial_status == 1 || Auth::user()->UserActiveSubscription()->trial_status == 0) && Auth::user()->roles[0]->name != 'Individual' && Auth::user()->roles[0]->name != 'JobSeeker') {
                    $ending_date = Auth::user()->UserActiveSubscription()->ending_date;
                    $now = time(); // or your date as well
                    $your_date = strtotime($ending_date);
                    $datediff = $now - $your_date;
                    $days_left = round($datediff / (60 * 60 * 24)) * (-1);
                    ?>            
                    <!--            <div class="col-md-12 text-center hd-trial-content">
                                    @if($days_left>0)
                                    <span>This is trial and it will expire in {{$days_left}} days, <a href="account#/settings/subscription">Upgrade your plan now</span></a>
                                    @elseif($days_left==0)
                                    <span>This is trial and it will expire today, <a href="account#/settings/subscription">Upgrade your plan now</span></a>
                                    @elseif($days_left < 0)
                                    <span>Your free trial period has now ended, <a href="account#/settings/subscription">Please review your plan now.</span></a>
                                    @endif               
                                </div>-->
                    <?php
                }
            }
            ?>
        </div>
    </div>
    <div class="container" ng-controller="AuthController as authCtrl">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <i class="fa fa-bars" style="font-size: 150%;"></i>
            </button>
            <a class="logo adjust-logo" href="/" title="Beauty Collective">
                <!--<div class="sr-only">Beauty Collective</div>-->
                <img src="{{url('new_assets/images/bc_logo.svg')}}" alt="BC Logo" width="150" />
            </a>
        </div>



        <div id="navbar" class="navbar-collapse collapse">

            <ul class="nav navbar-nav navbar-right primary-menu" id="primaryMenu">
                @if (Auth::guest())
                <li>{!! link_to('auth/login', trans('navs.login')) !!}</li>
                <!--<li>{!! link_to('auth/register?id=2', trans('navs.register')) !!}</li>-->
                <li class="btn_free_padd"><a href="{{url('auth/register')}}" class="btn-yellow-4">Signup for Free </a></li>
                @else
                <li>
                    <div>
                        @if (!Auth::guest())
                        @if(Auth::user()->is_first_time)
                        Welcome {{ Auth::user()->name }}
                        @else
                        Welcome Back {{ Auth::user()->name }}
                        @endif
                        @endif
                    </div>
                </li>
                <li>|</li>
                <li> 
                    <span>
                    <span class="userAvatar"><i class="fa fa-home"></i></span>
                        <!-- <img src="/images/house_32.png"> -->
                        {!! link_to('account#/business_info/basic-info', trans('navs.dashboard')) !!}
                    </span>
                </li>
                <li>|</li>
                <li class="dropdown">
                    <span>
                        <a href="#" class="dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {{--{{ Auth::user()->name }}--}}
                            <!-- <img src="/images/setting_32.png"> -->
                            <span class="userAvatar"><i class="fa fa-user"></i></span>
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu pull-left" aria-labelledby="dropdownMenu1">
                            <li>{!! link_to('auth/password/change', trans('navs.change_password')) !!}</li>
                            <!-- <li>{!! link_to('account#/settings/notifications', trans('navs.notifications'), '(0)') !!}</li> -->
                            @permission('view-backend')
                            <li>{!! link_to_route('backend.dashboard', trans('navs.administration')) !!}</li>
                            @endauth
                            <li role="separator" class="divider"></li>
                            <li>{!! link_to('auth/logout', trans('navs.logout')) !!}</li>
                        </ul>
                    </span>
                </li>

                @endif
            </ul>
        </div>
        <!-- /.nav-collapse -->
        <!-- <widget-auth></widget-auth>-->
    </div>
</nav>
<div class="clear"></div>