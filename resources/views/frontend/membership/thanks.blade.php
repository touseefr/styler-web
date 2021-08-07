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
				<h3 class="text-center">Thanks for purchasing plan. You may see your transaction details at My Orders to view details of this transaction in your dashboard.</h3><br/>
					<h3 class="text-center"><?php 
							echo '<b>You\'ll be redirected to dashboard in <span id="counter">5</span> secs. If not, click <a href="account">here</a>.</b>';
					?></h3>
					<script type="text/javascript">
					function countdown() {
						var i = document.getElementById('counter');
						if (parseInt(i.innerHTML) === 0) {
							location.href = 'account';
						}
						var ct = parseInt(i.innerHTML)-1;
						if(ct >= 0){
							i.innerHTML = ct;
						}
						
					}
					setInterval(function(){ countdown(); },1000);
					</script>
					</div> <!-- end col-sm-10 -->
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
