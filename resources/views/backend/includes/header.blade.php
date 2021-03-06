<!-- Main Header -->
<header class="main-header">
    <!-- Logo -->
    <a href="{!!url('home')!!}" class="logo">
        <!-- {{ HTML::image('images/bc_logo.png') }} -->
        <img src="{{url('new_assets/images/bc_logo.png')}}" alt="Stylerzone" class="" />      
    </a>
    <!-- Header Navbar -->
    <nav class="navbarCustom navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">{{ trans('labels.toggle_navigation') }}</span>
        </a>
        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav" style="display: inline-block;">
                <!-- <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{{ trans('menus.language-picker.language') }}
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" role="menu">
                        <li>{!! link_to('lang/en', trans('menus.language-picker.langs.en')) !!}</li>
                        <li>{!! link_to('lang/es', trans('menus.language-picker.langs.es')) !!}</li>
                        <li>{!! link_to('lang/fr-FR', trans('menus.language-picker.langs.fr-FR')) !!}</li>
                        <li>{!! link_to('lang/it', trans('menus.language-picker.langs.it')) !!}</li>
                        <li>{!! link_to('lang/pt-BR', trans('menus.language-picker.langs.pt-BR')) !!}</li>
                        <li>{!! link_to('lang/ru', trans('menus.language-picker.langs.ru')) !!}</li>
                        <li>{!! link_to('lang/sv', trans('menus.language-picker.langs.sv')) !!}</li>
                    </ul>
                </li> -->

                <!-- Tasks Menu -->
                <li class="dropdown tasks-menu">
                    <!-- Menu Toggle Button -->
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="fa fa-flag-o"></i>
                        <span class="label label-danger">1</span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="header">{{ trans_choice('strings.you_have.tasks', 1) }}</li>
                        <li>
                            <!-- Inner menu: contains the tasks -->
                            <ul class="menu">
                                <li>
                                    <!-- Task item -->
                                    <a href="#">
                                        <!-- Task title and progress text -->
                                        <h3>
                                            Design some buttons
                                            <small class="pull-right">20%</small>
                                        </h3>
                                        <!-- The progress bar -->
                                        <div class="progress xs">
                                            <!-- Change the css width attribute to simulate progress -->
                                            <div class="progress-bar progress-bar-aqua" style="width: 20%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                <span class="sr-only">20% Complete</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <!-- end task item -->
                            </ul>
                        </li>
                        <li class="footer">
                            <a href="#">{{ trans('strings.see_all.tasks') }}</a>
                        </li>
                    </ul>
                </li>
                <!-- User Account Menu -->
                <li class="dropdown user user-menu">
                    <!-- Menu Toggle Button -->
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <!-- The user image in the navbar-->
                        <img src="{!! access()->user()->picture !!}" class="user-image" alt="User Image" />
                        <!-- hidden-xs hides the username on small devices so only the image appears. -->
                        <span class="hidden-xs">{{ access()->user()->name }}</span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- The user image in the menu -->
                        <li class="user-header">                           
                            <img src="{!! access()->user()->picture !!}" class="img-circle" alt="User Image" />
                            <p>
                                {{ access()->user()->name }} - {{ trans('roles.web_developer') }}
<!--                                <small>{{ trans('strings.member_since') }} XX/XX/XXXX</small>-->
                            </p>
                        </li>
                        <!-- Menu Body -->
                        <!--                        <li class="user-body">
                                                    <div class="col-xs-4 text-center">
                                                        <a href="#">Link</a>
                                                    </div>
                                                    <div class="col-xs-4 text-center">
                                                        <a href="#">Link</a>
                                                    </div>
                                                    <div class="col-xs-4 text-center">
                                                        <a href="#">Link</a>
                                                    </div>
                                                </li>-->
                        <!-- Menu Footer-->
                        <li class="user-footer">
                            <!--                            <div class="pull-left">
                                                            <a href="#" class="btn btn-default btn-flat">{{ trans('navs.button') }}</a>
                                                        </div>-->
                            <div class="pull-right">
                                <a href="{!!url('admin/logout')!!}" class="btn btn-default btn-flat">{{ trans('navs.logout') }}</a>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</header>
