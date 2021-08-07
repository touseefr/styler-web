@extends('frontend.layouts.account') @section('content')
     @include('frontend.includes.hearderportion')
<div class="clear"></div>
<section class="faq_container">
    <div class="container">
        <div class="row" style="padding-bottom: 30px;">
            <div class="col-md-12">
                <div class="row">
                     <div class="col-sm-10 col-sm-offset-1">
					  
		 	 
    <div class="panel-group" id="faqAccordion">
        
		<?php $i = 1;?>
		@foreach($faqs as $faq)
			<div class="panel panel-default ">
            <div class="panel-heading accordion-toggle question-toggle collapsed" data-toggle="collapse" data-parent="#faqAccordion" data-target="#question{{$faq->id}}">
                 <h4 class="panel-title">
                    <a href="#" class="ing">Q:{{$i}} {{$faq->question}}</a>
              </h4>

            </div>
            <div id="question{{$faq->id}}" class="panel-collapse collapse" style="height: 0px;">
                <div class="panel-body">
                   <?php echo $faq->answer;?>
                </div>
            </div>
        </div>
		<?php $i++;?>
		 @endforeach
			
        
    </div>
    <!--/panel-group-->

<!--         <div class="col-sm-1"></div> -->
       
        </div> <!-- end col-sm-10 -->
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
