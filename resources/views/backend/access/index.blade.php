@extends ('backend.layouts.master')
@section ('title', trans('menus.user_management'))
@section('page-header')
<h1>
    {{ trans('menus.user_management') }}
</h1>
@endsection

@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
@stop
@section('content')
<div class="row border-bottom">
    <div class="col-xs-12 col-md-6">
        <ul class="nav nav-pills">
            <li class="nav-item">
                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#business" role="tab" aria-controls="business" aria-selected="true">Businesses Registration</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#users" id="profile-tab" data-toggle="tab" role="tab" aria-controls="users" aria-selected="false">Customer Registration</a>
            </li>
        </ul>
    </div>
    <div class="col-xs-12 col-md-6 text-right">
        <a id="newbtn" class='btn btn-primary btn-md px-25 mr-10' data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Search</a>
        @include('backend.access.includes.partials.header-buttons')
    </div>
</div>
<div clas='clear'></div>
<br />
<div class='row collapse' id="collapseExample">
    <div class="col-md-12 admin-user-search-panel" style="margin-bottom: 20px;">
        <form class="form-inline formFlex" id='frm-admin-search-user' name="frm-admin-search-user" method="POST">
            <div class="form-group mr-15">
                <label for="exampleInputEmail1">User By Name</label>
                <input type="text" class="form-control" name="userName" id="exampleInputEmail1"  aria-describedby="emailHelp" placeholder="User Name">
            </div>
            <div class="form-group mr-15">
                <label for="fromDate">From</label>
                <input type="text" class="form-control" id="fromDate" name="fromDate" />
            </div>
            <div class="form-group mr-15">
                <label for="toDate">To</label>
                <input type="text" class="form-control" id="toDate" name="toDate" />
            </div>
            <button type="button" class="btn btn-primary px-25" id='admin-search-user'>Submit</button>
        </form>
    </div>
    <div class="col-md-12 admin-user-search-panel">
        <div class="show-search-data">
            <table class="table table-striped table-bordered table-hover"  id="searchtable" >
                <thead>
                    <tr>
                        <th>{{ trans('crud.users.id') }}</th>
                        <th>{{ trans('crud.users.name') }}</th>
                        <th>{{ trans('crud.users.email') }}</th>
                        <th>{{ trans('crud.users.confirmed') }}</th>
                        <th>{{ trans('crud.users.roles') }}</th>
                        <th>{{ trans('crud.users.table_subscription') }}</th>
                        <th class="visible-lg">{{ trans('crud.users.created') }}</th>
                        <th class="visible-lg">{{ trans('crud.users.last_updated') }}</th>
                        <th>{{ trans('crud.actions') }}</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
<div clas='clear'></div>

<?php
$active = array(
    "<br /><label class='btn btn-xs btn-warning' style='margin-bottom:0px;'>Deactive</label>",
    "<br /><label class='btn btn-xs btn-primary' style='margin-bottom:0px;'>Active</label>",
    "<br /><label class='btn btn-xs btn-danger' style='margin-bottom:0px;'>Banned</label>"
);
?>
<div class="tab-content collapse show" id='user-tables'>
    <div class="tab-pane active" id="business" role="tabpanel" aria-labelledby="home-tab">
        <table class="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th style="width:20px">{{ trans('crud.users.id') }}</th>
                    <th>{{ trans('crud.users.name') }}</th>
                    <th>{{ trans('crud.users.email') }}</th>
                    <!-- <th>{{ trans('crud.users.confirmed') }}</th> -->
                    <th>{{ trans('crud.users.roles') }}</th>
                    <th>{{ trans('crud.users.table_subscription') }}</th>
                    <th style="width:60px" class="visible-lg">{{ trans('crud.users.created') }}</th>
                    <th style="width:85px" class="visible-lg">{{ trans('crud.users.last_updated') }}</th>
                    <th class="not-export-col">{{ trans('crud.actions') }}</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $packages = array("Trendy - Basic", "Artistic - Medium", "Glamours - Premium");
                ?>
                @foreach ($users['business_user'] as $user)
                <?php 
//                    echo "<pre>";
//                    print_r($user);
//                    exit;
                    ?>
                <tr>
                    <td>{!! $user['id'] !!}</td>
                    <td><?php echo $user['name'];?> <div style="display:flex;"><?php echo $active[$user['status']];?>&nbsp;<?php echo $user->confirmed_label;?>&nbsp; <a href="<?php echo Url('/admin/importfile/'.$user['id']);?>" class="btn btn-xs btn-primary" style="margin-bottom: 0px;">Import Data</a></div> </td>
                    <td>{!! link_to("mailto:".$user['email'], $user['email']) !!}</td>
                    <!-- <td>{!! $user->confirmed_label !!}</td> -->
                    <td>{!! $user['roles'][0]['name'] !!}</td>
                    <td>
                        <?php echo (isset($user['user_subscription']) && count($user['user_subscription']) > 0) ? $packages[$user['user_subscription'][0]['plan_id']] : $packages[0]; ?>
                    </td>
                    <td class="visible-lg">{!! date('Y-m-d',strtotime($user['created_at'])) !!}</td>
                    <td class="visible-lg">{!! date('Y-m-d', strtotime($user['updated_at'])) !!}</td>
                    <td>{!!$user->action_buttons!!} @if(isset($user->UserSubscription) && count($user->UserSubscription)>0)
                        <a class="btn btn-xs btn-success mb-2" data-toggle="modal"  data-target="#showsubscription-{!! $user['id'] !!}">
                            <i class="fa fa-th-list " data-toggle="tooltip" title="Invoice" aria-hidden="true"></i>
                        </a>
                        <div class="modal showsubscription" id="showsubscription-{!! $user['id'] !!}">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <!-- Modal Header -->
                                    <div class="modal-header bg-teal">
                                        <h4 class="modal-title">User Subscription</h4>
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <!-- Modal body -->
                                    <div class="modal-body">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Plan</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <?php echo date('Y-m-d', strtotime($user->UserSubscription[0]->starting_date)); ?>
                                                    </td>
                                                    <td>
                                                        <?php echo date('Y-m-d', strtotime($user->UserSubscription[0]->ending_date)); ?>
                                                    </td>
                                                    <td>
                                                        <?php echo isset($packages[$user->UserSubscription[0]->plan_id]) ? $packages[$user->UserSubscription[0]->plan_id] : ''; ?>
                                                    </td>
                                                    <td>
                                                        <?php
                                                        if (!empty($user->UserSubscription[0]->stripe_invoiceId)) {
                                                            $show = 'href="' . url('/admin/show/receipt/' . $user->UserSubscription[0]->id) . '" target="_blank" ';
                                                        } else {
                                                            $show = '';
                                                        }
                                                        ?>
                                                        <a class="btn btn-xs btn-success" <?php echo $show; ?>>
                                                            <i class="fa fa-external-link" aria-hidden="true"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- Modal footer -->
                                    <div class="modal-footer">
                                        <form id="frm-previous-invoices" name="frm-previous-invoices" method="POST" action="<?php echo url('/admin/previous/receipt'); ?>">
                                            <input type="hidden" id="customer_id" name="customer_id" value="cus_FaIX2MgO1CyXI3"/>
                                            <button type="submit" class="btn btn-primary btn-md" >Previous Invoices</button>
                                        </form>
                                        <button type="button" class="btn btn-danger btn-md" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                                @endif
                                </td>
                                </tr>
                                @endforeach
                                </tbody>
                                </table>
                            </div>
                            <div id="users" style="display: none;">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>{{ trans('crud.users.id') }}</th>
                                            <th>{{ trans('crud.users.name') }}</th>
                                            <th>{{ trans('crud.users.email') }}</th>
                                            <!-- <th>{{ trans('crud.users.confirmed') }}</th> -->
                                            <th>{{ trans('crud.users.roles') }}</th>

                                            <th class="visible-lg">{{ trans('crud.users.created') }}</th>
                                            <th class="visible-lg">{{ trans('crud.users.last_updated') }}</th>
                                            <th class="not-export-col">{{ trans('crud.actions') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        @foreach ($users['other_users'] as $user)
                                        <tr>
                                            <td>{!! $user['id'] !!}</td>
                                            <td>{!! $user['name']." ".$active[$user['status']] !!}&nbsp;{!! $user->confirmed_label !!}</td>
                                            <td>{!! link_to("mailto:".$user['email'], $user['email']) !!}</td>
                                            <!-- <td>{!! $user->confirmed_label !!}</td> -->
                                            <td>{!! $user['roles'][0]['name'] !!}</td>
                                            <td class="visible-lg">{!! date('Y-m-d',strtotime($user['created_at'])) !!}</td>
                                            <td class="visible-lg">{!! date('Y-m-d',strtotime($user['updated_at'])) !!}</td>
                                            <td>{!! $user->action_buttons !!}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="clearfix"></div>                   
            @stop      
