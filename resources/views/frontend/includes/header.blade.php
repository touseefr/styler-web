<!------------START : Header Block-23423424----------->
<nav class="navbar navbar-default navbar-fixed-top" style="border-bottom: none;">

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
    <div class="col-md-12 ipad-fixing" style="{{(Auth::check() && !empty(Auth::user()->UserActiveSubscription()) && isset(Auth::user()->UserActiveSubscription()->plan_type) && Auth::user()->UserActiveSubscription()->plan_type>=1 && Request::path()!='search')?"padding: 0;":''}}">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <div class="navbar-brand" >
                <a href="/">
                    <img src="{{url('new_assets/images/bc_logo.svg')}}" alt="BC Logo" width="150" />
                </a>
            </div>
        </div>         

        <div id="navbar" class="navbar-collapse collapse secondary-dropdown <?php echo (Auth::check()) ? 'loggedin' : '' ?>" style="{{(Request::path()!='search'?:'margin-right: 0px;')}}">
            <ul class="nav navbar-nav navbar-right main-navigation" style="margin-right: 0;{{(Auth::check() && !empty(Auth::user()->UserActiveSubscription()) && isset(Auth::user()->UserActiveSubscription()->plan_type) && Auth::user()->UserActiveSubscription()->plan_type>=1)?"padding: 0;":''}}">
                @if (Auth::guest())
                <li>{!! link_to('auth/login', trans('navs.login')) !!}</li>
<!--                <li>{!! link_to('auth/register', trans('navs.register')) !!}</li>-->
                <li class="btn_free_padd"><a href="{{url('auth/register')}}" class="btn-yellow-4">Signup for Free </a></li>

                <a href="#main-menu-toggle" class="backdrop" hidden></a>
                @else
                <li>
                    <div>                                               
                        @if (!Auth::guest())
                        @if(Auth::user()->is_first_time)
                        <strong>Welcome</strong> {{ (Auth::user()->roles[0]->id ==5 || Auth::user()->roles[0]->id ==6 || Auth::user()->roles[0]->id ==7)?(isset(Auth::user()->UserBusiness->business_name))?Auth::user()->UserBusiness->business_name:Auth::user()->name:Auth::user()->name }}
                        @else
                        <strong>Welcome</strong> Back {{ (Auth::user()->roles &&Auth::user()->roles[0]->id ==5 || Auth::user()->roles[0]->id ==6 || Auth::user()->roles[0]->id ==7)?(isset(Auth::user()->UserBusiness->business_name))?Auth::user()->UserBusiness->business_name:Auth::user()->name:Auth::user()->name }}
                        @endif
                        @endif
                    </div>
                </li >
                <li>|</li>
                <li>
                    <span class="header_menu_account_link">
                      <!-- <img src="/images/house_32.png" alt="Home" width="24"> -->
                        <span class="userAvatar"><i class="fa fa-home"></i></span>
                        <!-- {!! link_to('account', trans('navs.dashboard')) !!} -->
                        <a onclick="javascript: window.open('{{url('/account')}}', '_self')">{{trans('navs.dashboard')}}</a>
                    </span>
                </li>
                <li>|</li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="userAvatar"><i class="fa fa-user"></i></span>
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                        <li>{!! link_to('auth/password/change', trans('navs.change_password')) !!}</li>
                        <!-- <li>{!! link_to('account#/settings/notifications', trans('navs.notifications'), '(0)') !!}</li> -->
                        @permission('view-backend')
                        <li>{!! link_to_route('backend.dashboard', trans('navs.administration')) !!}</li>
                        @endauth
                        <li><a onclick="window.open('{{ Url('/account#/business_info/change/card') }}', '_self')">Update Payment Details</a></li>
                        <li role="separator" class="divider"></li>
                        <li>{!! link_to('/logout', trans('navs.logout')) !!}</li>
                    </ul>
                </li>    
                @if(!empty(Auth::user()->UserActiveSubscription()) && isset(Auth::user()->UserActiveSubscription()->plan_type) && Auth::user()->UserActiveSubscription()->plan_type>=1)
                    <li ><a href="{{env('StylerBook_Url')}}" target="_blank" style='color: #4abdac;font-size: 16px;font-weight: bolder;'>Switch To Booking</a></li>
                @endif
                @endif

            </ul>
        </div><!--/.nav-collapse -->       
    </div>

</nav>
<!------------END : Header Block------------>
