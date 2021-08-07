<!-- Left side column. contains the logo and sidebar -->
<aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel">
            <div class="pull-left image">
                <img src="{!! access()->user()->picture !!}" class="img-circle" alt="User Image" />
            </div>
            <div class="pull-left info">
                <p>{{ access()->user()->name }}</p>
                <!-- Status -->
                <a href="#">
                    <i class="fa fa-circle text-success"></i> Online</a>
            </div>
        </div>
        <!-- Sidebar Menu -->
        <ul class="sidebar-menu">
            <!-- Optionally, you can add icons to the links -->

            <li class="">
                <a href="{!!route('backend.dashboard')!!}">
                    <i class="fa fa-tachometer"></i>
                    <span>{{ trans('menus.dashboard') }}</span>
                </a>
            </li>
            @permission('view-access-management')
            <li class="">
                <a href="{!!url('admin/access/users')!!}">
                    <i class="fa fa-barcode"></i>
                    <span>{{ trans('menus.access_management') }}</span>
                </a>
            </li>
            @endauth
            <!--<li class=" treeview">
                <a href="javascript:void(0);">Membership Management</a>
                <ul class="treeview-menu " style="display:none;">

                    <li class=""><a href="{!!url('admin/membership')!!}">Plans</a></li>

                    <li class=""><a href="{!!url('admin/membership/add')!!}">Add New</a></li>

                    </ul>
                </li>

            <li class="">
              <a href="{{url('admin/gateway')}}">Payment Gateway Management</a>
            </li>
            <li class="">
                <a href="{{url('admin/transactions')}}">Transaction Management</a>
            </li>
            <li class="">
                <a href="{{url('admin/video')}}">Video Management</a>
            </li>-->

            <li class="">
                <a href="javascript:void(0);">
                    <i class="fa fa-eye"></i>
                    <span>Review Management</span>
                </a>
                <ul class="treeview-menu " style="display:none;">
                    <li ><a href="{!!url('admin/reviews')!!}" >Review Management</a></li>
                    <li ><a href="{!!url('admin/bad/words')!!}" >Management Bad Words</a></li>
                    <li class=""><a href="{!!url('admin/bad/reviews')!!}">Bad Review Management</a></li>
                    <li class=""><a href="{!!url('admin/reviewreport')!!}">Review Report Management</a></li>
                </ul>
            </li>
            <li class="treeview ">
                <a href="#"><i class="fa fa-comments-o"></i> <span>Blog Management</span></a>
                <ul class="treeview-menu " style="display:none">
                    <li class=""><a href="{!!url('admin/blog')!!}">Posts</a></li>
                    <li class=""><a href="{!!url('admin/blog/post/create')!!}">Add New</a></li>
                    <li class=""><a href="{!!url('admin/blog/category')!!}">Category</a></li>
                </ul>
            </li>
            <li class="treeview ">
                <a href="#"><i class="fa fa-comments-o"></i> <span>Price Control Management</span></a>
                <ul class="treeview-menu " style="display:none">
                    <li class=""><a href="{!!url('admin/subscription/plans/type')!!}">Plans</a></li>
                    {{-- <li class=""><a href="{!!url('admin/subscription/packages/all')!!}">Packages</a></li>
                    <li class=""><a href="{!!url('admin/subscription/packages/create')!!}">Create Plan</a></li>                     --}}
                </ul>
            </li>
            <li class="treeview ">
                <a href="#"><i class="fa fa-credit-card"></i> <span>Coupon Management</span></a>
                <ul class="treeview-menu " style="display:none">
                    <li class=""><a href="{!!url('admin/coupon')!!}">Coupon</a></li>
                    <li class=""><a href="{!!url('admin/coupon/new')!!}">Add Coupon</a></li>
                </ul>
            </li>

            <li class="">
                <a href="{!! url('admin/categories') !!}">
                    <i class="fa fa-th-large"></i>
                    <span>{{ trans('menus.categories.main') }}</span>
                </a>
            </li>
            <li class="treeview ">
                <a href="#"><i class="fa fa-credit-card"></i> <span>Packages Management</span></a>
                <ul class="treeview-menu " style="display:none">
                    <li class=""><a href="{!!url('admin/SmsPackage')!!}">SMS Packages</a></li>
                    <li class=""><a href="{!!url('admin/SmsPackage/New')!!}">Add SMS Package</a></li>             
                    <li class=""><a href="{!!url('admin/ListingPackage')!!}">Listing Packages</a></li>             
                    <li class=""><a href="{!!url('admin/ListingPackage/New')!!}">Add Listing Package</a></li>             
                    <li class=""><a href="{!!url('admin/list/user/packages')!!}">User Package</a></li>             
                </ul>
            </li>
            <li class="treeview ">
                <a href="#"><i class="fa fa-credit-card"></i> <span>SMS Sub Account</span></a>
                <ul class="treeview-menu " style="display:none">
                    <li class=""><a href="{!!url('admin/list/subaccounts/keys/Requests')!!}">Requests</a></li>                                    
                    <li class=""><a href="{!!url('admin/list/smsglobal/subaccounts')!!}">Sub Account Manager</a></li>            
                </ul>
            </li>
        </ul>
        <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
</aside>
