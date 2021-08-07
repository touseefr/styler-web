<?php //echo "<pre>"; print_r($invoices->data);exit;?>
@extends ('backend.layouts.master') 
@section ('title', 'Review Management') 
@section('page-header')
<h1>
    Bad Review Management
</h1>
@endsection
 
@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active"><a href="">Subscriptions Management</a></li>

@stop 
@section('content')
<?php 
$packages=array(
    "plan_E0VKE9WT1Y2WE3"=> "Monthly Add on booking system - Medium",
    "plan_E0VKFf9gXOswGu"=> "Annually Add on booking system - Medium",
    "plan_E1en4B0RGC0472"=> "Monthly Glamours - Premium",
    "plan_E1eoYxQNFld1yM"=> "Annually Glamours - Premium",
    "plan_E0a93bgwoQUa6k"=> "Monthly Glamours - Premium",
    "plan_E1eldC6p1p9Cao"=> "Annually Glamours - Premium",
    "plan_E1emJ7wxlmrwF4"=> "Monthly Glamours - Premium",
    "plan_E1emMYpcUKiZwr"=> "Annually Glamours - Premium",
   );




?> @if(Session::has('message'))
<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
@endif

<div class="row">
    <div class="col-xs-12">
        <div class="box">

            <!-- /.box-header -->
            <div class="box-body">

                <table class="table">
                    <thead>
                        <tr>

                            <th style="display:none">S.no#</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Plan</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <?php foreach (array_reverse($invoices->data,true) as $key=>$invoice) {                                    
                                ?>
                        <tr>
                            <td style="display:none"><?php echo $key+1;?></td>
                            <td >
                                <?php echo date("Y-m-d", $invoice->lines->data[0]->period->start); ?>
                            </td>
                            <td>
                                <?php echo date("Y-m-d", $invoice->lines->data[0]->period->end); ?>
                            </td>
                            <td>
                                <?php echo $packages[$invoice->lines->data[0]->plan->id]; ?>
                            </td>
                            <td>
                                <a class="btn btn-xs btn-success" href="<?php echo $invoice->hosted_invoice_url;?>" target="_blank">
                                            <i class="fa fa-file-word-o" aria-hidden="true"></i>                                                                                
                                        </a>
                            </td>
                        </tr>
                        <?php }?>
                    </tbody>
                </table>              
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
    <!-- /.col -->
</div>


@stop