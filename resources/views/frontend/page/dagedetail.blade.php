@section('after-styles-end')
<!--@if(isset($showmsg) &&  $showmsg==1)-->
{!! HTML::style('new_assets/css/toastr.min.css' ) !!}
<!--@endif-->
@endsection
@section('after-scripts-end')
{!! HTML::script('new_assets/js/toastr.min.js') !!} 

 @if ($showmsg==1)
<script type="text/javascript">
    $(document).ready(
            function () {
                toastr.error("{{$msg}}", 'Exception', {timeOut: 5000});
            });
</script>
 @endif

 @if ($showmsg==2)
<script type="text/javascript">
    $(document).ready(
            function () {
                toastr.success("{{$msg}}", 'Success', {timeOut: 5000});
            });
</script>
@endif
@endsection
@extends('frontend.layouts.account') @section('content')

@include('frontend.includes.hearderportion')
<div class="clear"></div>
<section class="termsandcondition_container">
    <div class="container">
        <div class="row" style="padding-bottom: 30px;">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-12">                       
                        <h1>{{ $page[0]->title }}</h1>
                    </div>
                    <div class="col-md-12">
                        {!! $page[0]->description !!}                                                
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
