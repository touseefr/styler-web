@extends('frontend.layouts.account') @section('content')
<section class="container animated fadeIn">
   @include('frontend.includes.sub_header')
</section>
<div class="clear"></div>
<section class="bg_gray border_top login_container">
   <div class="container">
      <div class="row" style="padding-top: 80px;padding-bottom: 80px;">
         <div class="col-md-12">
            <div class="row">
               <div class="col-sm-12">
			   <h2 class="title-bar">Transactions/Invoices</h2>
			   <div class="add-new-team-member text-right">	
					<a href="{{url('account')}}" class="btn btn-primary">Back</a>
				</div>
                  @if(Session::has('message'))
                  <div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
                  @endif
                  <table class="table table-striped table-bordered table-hover">
                     <thead>
                        <tr>
                           <th>S.No</th>
                           <th>Txn ID</th>
                           <th>Mode</th>
                           <th>Membership Type</th>
                           <th>Duration</th>
                           <th>Pricing(USD)</th>
                           <th>Purchase Date</th>
                           <th>Expires On</th>
                           <th>Status</th>
                           <th>Actions</th>
                        </tr>
                     </thead>
                     <tbody>
	
					 <?php $i = 1;?>
					 @if(!empty(count($transactions)))
							@foreach($transactions as $transaction)
								<?php  $plan_info = unserialize($transaction->plan);?>
									 <tr>
												<td>{{$i}}</td>
									
												<td>{{$transaction->transaction_id}}</td>
												<td>{{ucfirst($transaction->mode)}}</td>
												<td>{{ucwords($plan_info['name'])}}</td>
												<td>{{$plan_info['duration']}}</td>
												<td>{{$plan_info['price']}}</td>
												<td><?php echo date(getenv('DATE_FORMATE'), strtotime($plan_info['purchased_date']));?></td>
												<td><?php echo date(getenv('DATE_FORMATE'), strtotime($plan_info['expired_date']));?></td>
												<td>{{$transaction->state}}</td>
												<td class="actions">
												
												<a title="View Transaction" target="_blank" href="transactions/view/<?php echo $transaction->transaction_id;?>" class="btn bg-orange btn-xs"><i class="fa fa-eye" aria-hidden="true"></i></a>
												
												<a title="Print Invoice" target="_blank" href="invoice/print?txn_id=<?php echo $transaction->transaction_id;?>&print=true" class="btn bg-orange btn-xs"><i class="fa fa-print" aria-hidden="true"></i></a>
												
												<a title="Download Invoice" target="_blank" href="invoice/download?txn_id={{$transaction->transaction_id}}" class="btn bg-orange btn-xs"><i class="fa fa-download" aria-hidden="true"></i></a>
												
												</td>
										</tr>
							<?php $i++;?>
						 @endforeach
					 @else
						<td colspan="10" style="text-align:center;">No data found!</td>
					 @endif
					 
                       
                     </tbody>
                  </table>
               </div>
               <!-- end col-sm-10 -->
            </div>
         </div>
      </div>
   </div>
</section>
@endsection