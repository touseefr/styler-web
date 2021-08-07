
<div class="container">
	<div class="row text-center carousel_container">
	    <div class="sponser">Our Sponsors</div>
	    <div class="sponser_slides">
			{{--<slick dots="true" infinite="true" speed=300 slides-to-show=3 touch-move="true" slides-to-scroll=1 slick-slide="false" class="slider one-time" responsive="[{breakpoint: 990, settings: {slidesToShow: 4}}, {breakpoint: 768,settings: {slidesToShow: 2}}, {breakpoint: 480,settings: {slidesToShow: 1}}]">--}}
	       
			   	<div class="col-md-3 col-sm-3 col-md-3 col-xs-12">
					<figure>
						<a href="#">
							<img src="images/sponser/sp1.png" alt="" width="185" height="130" style="border:0;"/>
						</a>
					</figure>
				</div>

				<div class="col-md-3 col-sm-3 col-md-3 col-xs-12">
					<figure>
						<a href="#">
						<img src="images/sponser/sp2.png" alt="" width="185" height="130" style="border:0;"/>
						</a>
					</figure>
				</div>

				<div class="col-md-3 col-sm-3 col-md-3 col-xs-12">
					<figure>
						<a href="#">
							<img src="images/sponser/sp3.png" alt="" width="185" height="130" style="border:0;"/>
						</a>
					</figure>
				</div>

				<div class="col-md-3 col-sm-3 col-md-3 col-xs-12">
					<figure>
						<a href="#">
							<img src="images/sponser/sp4.png" alt="" width="185" height="130" style="border:0;"/>
						</a>
					</figure>
				</div>

				<div class="col-md-3 col-sm-3 col-md-3 col-xs-12">
					<figure>
						<a href="#">
							<img src="images/sponser/sp5.png" alt="" width="185" height="130" style="border:0;"/>
						</a>
					</figure>
				</div>
			{{--</slick>--}}
	 </div>
	</div>
</div> @section('after')
<script type="text/javascript">
    $(document).ready(function(){//
        $('.sponser_slides').slick({
            dots: true,
            infinite: true,
            speed: 700,
            autoplay:true,
            autoplaySpeed: 2000,
            arrows:true,
            slidesToShow: 3,
            slidesToScroll: 1
        });        
    });
</script>

  

<script type="text/javascript">
    $(document).ready(function(){//
//        $('.myclass').slick({
//            infinite: true,
//            speed: 500,
//            autoplay:true,
//            autoplaySpeed:2000,
//            slidesToShow: 1,
//            slidesToScroll: 1,
//        });
    });
</script>@endsection