@extends('frontend.layouts.account')
@section('content')


@section('after-styles-end')
<style type="text/css">
    .bs-example{
        margin: 20px;
    }   
</style>

@endsection
<div class="container">

    <div class="row" style="margin-top: 50px;margin-bottom: 50px;">
        <div class="col-md-8">
            <form class="bs-example" action="{{URL('/booknow')}}" method="post">
                <div class="panel-group" id="accordion">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <label for='r11' style='width: 350px;'>
                                    <input type='radio' id='r11' name='payType' value='0' required checked="checked"/> Pay at venue
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne"></a>
                                </label>
                            </h4>
                        </div>
<!--                        <div id="collapseOne" class="panel-collapse collapse in">
                            <div class="panel-body">
                                <p>HTML stands for HyperText Markup Language. HTML is the main markup language for describing the structure of Web pages. <a href="http://www.tutorialrepublic.com/html-tutorial/" target="_blank">Learn more.</a></p>
                            </div>
                        </div>-->
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class=panel-title>
                                <label for='r12' style='width: 350px;'>
                                    <input type='radio' id='r12' name='payType' value='1' required disabled="disabled"/> Pay online with card.
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"></a>
                                </label>
                            </h4>
                        </div>
                        <div id="collapseTwo" class="panel-collapse collapse">
                            <div class="panel-body">
                                <p>Bootstrap is a powerful front-end framework for faster and easier web development. It is a collection of CSS and HTML conventions. <a href="http://www.tutorialrepublic.com/twitter-bootstrap-tutorial/" target="_blank">Learn more.</a></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="booknow-frm-btn">
                        <button type="submit" class="btn btn-primary btn-lg btn-block">Book Now</button>
                    </div>
                </div>
            </form>
            
            
        </div>
        <div class="col-md-4">
            <div class="booknow-c2-r1">
                <p>Appointment starting at</p>
                <h3>{{$bookinginfo['time']}}</h3>
                <p>on <span>{{date('l, d F Y',strtotime($bookinginfo['start_date']))}}</span></p>                    
            </div>
            <input type="hidden" name="date" value="{{date('l, d F Y',strtotime($bookinginfo['start_date']))}}" />
            <!--            <div class="booknow-c2-r2">
                            <p>Paradai Thai Massage - Brighton</p>
                            <p><span class="booknow-c2-r2-left">Paradai Thai Massage - Brighton</span><span class="booknow-c2-r2-right">$ 99.00</span></p>
                        </div>-->
            <div class="booknow-c2-r3">
                <p><span class="booknow-c2-r2-left">total</span><span class="booknow-c2-r2-right">$ {{$bookinginfo['total_price']}}</span></p>
            </div>
        </div>
    </div>
</div>


@endsection
@section('after-scripts-end')
<script type="text/javascript">
    $(document).ready(function () {
//        $('#r11').on('click', function () {
//            $(this).parent().find('a').trigger('click')
//        })

//        $('#r12').on('click', function () {
//            $(this).parent().find('a').trigger('click')
//        })
    });
</script>

@endsection
