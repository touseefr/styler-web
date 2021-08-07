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
                     <div class="col-sm-10 col-sm-offset-1">
					 <?php 
							 /* if (Auth::user()->confirmed == 0) {
								$user_id = Auth::user()->id;
								$message = "Your account is not confirmed. Please click the confirmation link in your e-mail";
								Session::put('message', $message);
								Session::put('type', 'success');
							}  */
						?>
					 @if(Session::has('message'))
						<!--<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">			       <?php 
												/* echo Session::get('message');
												Session::forget('message');
												Session::forget('type'); */
										?>
						</div>-->
					  @endif
					 <?php $i=1;?> 
				@foreach($plans as $plan)	
				@if($plan->id != 4)
					
				<div class="col-md-4 col-sm-6">
				 <div class="card-container">
					<div class="card">
						<div class="front">
							<div class="cover p<?php echo $i;?>">
								{{$plan->name}}
							  
							</div>
							<div class="user up<?php echo $i;?>">
							<?php 
									if(empty($plan->price)){
										echo 'Free';
									}
									else{
										echo '$'.$plan->price;
									}
							?>
							
								  <span>For {{$plan->duration}}</span>
							</div>
							<div class="content">
								<div class="main">
								
									<p class="text-center">
													<?php $features = @unserialize($plan->features);?>
													@foreach($features as $key => $val)
													
													testdemo123
													<?php echo '<br/><br/>';?>
													@endforeach
													Discount Options<span class="blue">({{$plan->discount}})</span></p>
								</div>
								<div class="footer">
									<div class="plans-select-btn back-<?php echo $i;?>">
											<?php 
													$current_plan = App\Transaction::get_current_plan(Auth::user()->id);
													if($current_plan['status'] == 'true' && $current_plan['plan']['id'] == $plan->id){
														$hash = '#';
													}
													elseif($plan->id == 1){
														$hash = '/checkout?p=MQ==';
													}
													else{
														$hash = '#';
													}
											?>
										 <a href="<?php echo $hash;?>">Select</a>
									</div>
								</div>
							</div>
						</div> <!-- end front panel -->
						 <!-- end back panel -->
					</div> <!-- end card -->
				</div> <!-- end card-container -->
			</div>
							<?php $i++;?>
							@endif
				@endforeach
       
        </div> <!-- end col-sm-10 -->
                </div>
            </div>
        </div>
    </div>
</section>

@endsection
