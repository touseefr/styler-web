@extends ('backend.layouts.master')

@section ('title', 'Transaction & Invoice Management')

@section('page-header')
<h1>
    Transaction & Invoice Management
</h1>
<a id="newbtn" class='btn btn-primary btn-sm searchFilter' data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Search Filter</a>
@endsection


@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">Transaction & Invoice Management</li>
@stop


@section('content')
@if(Session::has('message'))
<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
@endif

<div clas='clear'></div>
<div class='row collapse' id="collapseExample">
    <div class="col-md-12 admin-user-search-panel" style="margin-bottom: 15px;">
        <form class="form-inline" id='frm-admin-search-user' name="frm-admin-search-user" method="POST">
            <div class="row">
                <div class="col-12 col-sm-6 col-md-4 d-flex">
                    <label for="exampleInputEmail1" class="mr-2 col-3 px-0 justify-content-end">User Type</label>        
                    <select class="form-control flex-grow-1" id="business_type" name="business_type">
                        <option value=""></option>
                        <option value="ServiceProvider">Service Provider</option>
                        <option value="Distributor">Distributor</option>            
                        <option value="SchoolCollege">School Colleges</option>            
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-4 d-flex">
                    <label for="exampleInputEmail1" class="mr-2 col-3 px-0 justify-content-end">Plan Type</label>        
                    <select  class="form-control flex-grow-1" id="plan_type" name="plan_type">
                        <option value=""></option>
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>            
                    </select>
                </div>
                <div class="col-12 col-sm-6 col-md-4 d-flex"> <button type="button" class="btn btn-primary" id='admin-search-invoice'>Submit</button>
                    <!--                    <label  for="exampleInputEmail1" class="mr-2 col-3 px-0 justify-content-end">Plan</label>        
                                        <select  class="form-control flex-grow-1" id="plan" name="plan">
                                            <option value=""></option>
                    <?php foreach ($plan_name as $key => $value) { ?>
                                                    <option value="<?php echo $key; ?>"><?php echo $value; ?></option>            
                    <?php } ?>
                                        </select>-->
                </div>
                <div class="col-12 col-sm-6 col-md-4 d-flex mt-3">
                    <label for="fromDate" class="mr-2 col-3 px-0 justify-content-end">From</label>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control flex-grow-1" style="width: 206px;" id="fromDate" name="from_date" placeholder="mm/dd/YY" aria-label="Username" aria-describedby="basic-addon1" />
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary border" type="button" id="btn-date-from"><i class="fa fa-calendar"></i></button>
                        </div>
                    </div>                                       

                </div>
                <div id="" class="col-12 col-sm-6 col-md-4 d-flex mt-3">
                    <label for="toDate" class="mr-2 col-3 px-0 justify-content-end">To</label>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control flex-grow-1" style="width: 206px;" id="toDate" name="to_date" placeholder="mm/dd/YY" aria-label="Username" aria-describedby="basic-addon1" />
                        <div class="input-group-append ">
                            <button class="btn btn-outline-secondary border" type="button" id="btn-date-to"><i class="fa fa-calendar"></i></button>
                        </div>
                    </div>                                          
                </div>
                <div class="col-12 col-sm-6 col-md-4 mt-3 text-right">

                </div>

            </div>            
        </form>
    </div>    
    <div class="col-md-12" >
        <div class="show-search-data box-body admin-user-search-panel box">
            <table class="table table-striped table-bordered table-hover" id="searchtable">
                <thead>
                    <tr>
<!--                            <th style="display:none;">S.No</th>-->
                        <th>Name</th>                         
                        <th>mode</th>
                        <th>Plan</th>
                        <th>Duration</th>
                        <th>Pricing(USD)</th>
                        <th>Purchase Date</th>
                        <th>Expires On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>    
    </div>
</div>
<div clas='clear'></div>


<div class="row collapse show" id='user-tables'>
    <div class="col-xs-12">
        <div class="box">

            <!-- /.box-header -->
            <div class="box-body">
                <table id="example1" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th style="display:none;">S.No</th>
                            <th>Name</th>                         
                            <th>mode</th>
                            <th>Plan</th>
                            <th>Duration</th>
                            <th>Pricing(AUD)</th>
                            <th>Purchase Date</th>
                            <th>Expires On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        @foreach($transactions as $transaction)    
                        <?php if (array_key_exists($transaction->plan_title, $plan_name)) { ?>
                            <tr>
                                <td style="display:none;"><?php echo $transaction->id; ?></td>
                                <td><?php echo ucwords($transaction->userDetail->name); ?></td>
                                <td><?php echo ucfirst($mode[$transaction->type]); ?></td>
                                <td><?php echo $plan_name[$transaction->plan_title]; ?></td>
                                <td><?php echo $transaction->interval; ?></td>
                                <td><?php echo $transaction->amount; ?></td>
                                <td><?php echo $transaction->start_from; ?></td>
                                <td><?php echo $transaction->end_at; ?></td>                
                                <?php
                                $invoice_link = "";
                                if ($transaction->stripe_string_payment_succeeded && !empty($transaction->stripe_string_payment_succeeded)) {
                                    $invoices = unserialize($transaction->stripe_string_payment_succeeded);
                                    $invoice_link = $invoices['hosted_invoice_url'];
                                }
                                ?>

                                <td class="actions">
                                    <a class="btn btn-xs btn-success mb-2" href="<?php echo $invoice_link; ?>">
                                        <i class="fa fa-th-list" aria-hidden="true"></i>
                                    </a>
                                </td>
                            </tr>
                        <?php } ?>


                        @endforeach


                    </tbody></table>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
    <!-- /.col -->
</div>



<div class="clearfix"></div>
@stop