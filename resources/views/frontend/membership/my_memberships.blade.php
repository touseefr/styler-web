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
			   <h2 class="title-bar">Subscription/Payment Methods </h2>
			   
			   <div class="add-new-team-member text-right">	
					<a href="/plans" class="btn btn-primary">Upgrade Subscription</a>  <a href="{{url('account')}}" class="btn btn-primary">Back</a>
				</div>
                  @if(Session::has('message'))
                  <div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
                  @endif
				  <div class="table-responsive">
					  <table class="table table-striped table-bordered table-hover">
						 <thead>
							<tr>
							  
							   <th>Membership Type</th>
							   <th>Duration</th>
							   <th>Pricing(USD)</th>
							   <th>Purchase Date</th>
							   <th>Expires On</th>
							   <th>Status</th>
							   <th>Auto Billing</th>
							   <th>Actions</th>
							</tr>
						 </thead>
						 <tbody>
		
						 <?php $i = 1;?>
						 @if(!empty(count($transactions)))
								@foreach($transactions as $transaction)
									<?php  
									
											$plan_info = unserialize($transaction->plan);
											$mem_status = App\Transaction::get_mem_status($transaction->id);
											$txn_auto_billing = App\Transaction::txn_auto_billing($transaction->id);
											
									?>
									
										 <tr>
													<td>{{ucwords($plan_info['name'])}}</td>
													<td>{{$plan_info['duration']}}</td>
													<td>{{$plan_info['price']}}</td>
													<td><?php echo date(getenv('DATE_FORMATE'), strtotime($plan_info['purchased_date']));?></td>
													<td><?php echo date(getenv('DATE_FORMATE'), strtotime($plan_info['expired_date']));?></td>
													<td>{{$mem_status}}</td>
													<td>{{$txn_auto_billing}}</td>
													<td class="actions">
													
													<a title="View Membership" target="_blank" href="transactions/view/<?php echo $transaction->transaction_id;?>" class="btn bg-orange btn-xs"><i class="fa fa-eye" aria-hidden="true"></i></a>
													
													@if($mem_status == 'Active' && $txn_auto_billing == 'On')
														<a onclick = "return confirm('Are you sure you want to stop next billing cycle.');" title="Stop Auto Billing" href="membership/billing/0" class="btn bg-red btn-xs"><i class="fa fa-times" aria-hidden="true"></i></a>
													@elseif($mem_status == 'Active' && $txn_auto_billing == 'Off')
														<a onclick = "return confirm('Are you sure you want to start next billing cycle.');" title="Start Auto Billing" href="membership/billing/1" class="btn bg-green btn-xs"><i class="fa fa-check" aria-hidden="true"></i></a>
													@endif
														
													
													
												
													
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
               </div>
               <!-- end col-sm-10 -->
            </div>
         </div>
      </div>
   </div>
</section>
@endsection