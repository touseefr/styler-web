@extends('frontend.layouts.account') @section('content')

    @include('frontend.includes.hearderportion')

<div class="clear"></div>
<section class="bg_gray border_top">
	<div class="container gallery-container">					
		<div class="clear"></div>
		<div class="row create_list_inner pt-15 mb-20">
			<div class="row">
				<div class="col-md-12">
					<h1 class="h2-title" style="color:#4abdac;">Gallery</h1>
				</div>
			</div>
			<div class="col-md-12" id="pinBoot" style="display: none;margin-bottom: 30px;">
                            
                             @foreach($records as $item)
                            <div class="white-panel listing_item ">
								<div class="item_detail">
									<div class="gallery-image">                                                                        
                                                                            <figure><img src="{{$item['path']}}{{$item['name']}}" class="img-responsive " title="{{ $item['name']}}" ></figure>                                                                      
                                                                        </div>
                                                                        </div>
                                                                </div>
                                   @endforeach

					</div>
					
					</div>
				
        </div>
			</section><!--bg_gray-->	
			
			
@endsection('content')
@section('after')
<div class="clear"></div>
			<script type="text/javascript">
				$(document).ready(function(){
    $("#pinBoot").show();
});
			</script>
@endsection
