@section('after-angular-load')
<!--<script src="https://js.stripe.com/v2/"></script>-->
<script type="text/javascript">
//    $(document).ready(function () {
//        Stripe.setPublishableKey("{{env('STRIPE_KEY')}}");
    //});

</script>
<!--{!! HTML::script('new_assets/js/angular-payments.min.js') !!} -->

@if(Auth::user()->confirmed === 0) 
<script>
    $(document).ready(function () {
        $("#emailconfirm-popup").modal({backdrop: 'static', keyboard: false});
    });
</script>
<!-- Modal -->
<div class="modal fade" id="emailconfirm-popup" role="dialog">
    <div class="modal-dialog" style="margin-top: 63px;">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">

                <h4 class="modal-title">Confirm your email account</h4>
            </div>
            <div class="modal-body">
                <p><?php
                    if (Auth::user()->confirmed == 0) {
                        $user_id = Auth::user()->id;
                        echo $message = "Your account is not confirmed. Please click the confirmation link in your e-mail";
                    }
                    ?></p>
            </div>
            <div class="modal-footer">
                <!--<button type="button" class="btn btn-default" data-dismiss="modal" disabled="diabled">Close</button>-->
                <button type="button" class="btn btn-default btn-green-1" data-dismiss="modal" onclick="javascript: window.open('<?php echo URL::to('/account/confirm/resend/' . Auth::user()->id); ?>', '_self')" >Resend Confirmation Email</button>
            </div>
        </div>

    </div>
</div>
<div class="emailOverlay"></div>
@endif

<script type="text/javascript">
    function _Getelement(el) {
        return document.getElementById(el);
    }
    function uploadFile() {
        var file = _Getelement("userbanner").files[0];        
        var formdata = new FormData();
        formdata.append("userbanner", file);
        var ajax = new XMLHttpRequest();
        ajax.upload.addEventListener("progress", progressHandler, false);
        ajax.addEventListener("load", completeHandler, false);
        ajax.addEventListener("error", errorHandler, false);
        ajax.addEventListener("abort", abortHandler, false);
        ajax.open("POST", "BannerUploadImage");        
        ajax.send(formdata);
    }
    function progressHandler(event) {
        $("#progressBar").css('display', 'block');
        _Getelement("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
        var percent = (event.loaded / event.total) * 100;
        _Getelement("progressBar").value = Math.round(percent);
        _Getelement("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
    }
    function completeHandler(event, response) {        
        var resposne = JSON.parse(event.currentTarget.response);        
        if (resposne.status == "200") {
            $("#imgBanner").attr('src', resposne.image);
            $("#progressBar").css('display', 'none');
        }
    }
    function errorHandler(event) {
        _Getelement("status").innerHTML = "Upload Failed";
    }
    function abortHandler(event) {
        _Getelement("status").innerHTML = "Upload Aborted";
    }
</script>

@endsection



@extends('frontend.layouts.account') @section('content')
@include('frontend.includes.hearderportion')
@if(Session::has('message'))
@endif
@if (access()->hasRole('Administrator'))
@include('frontend.user.partials.distributor', array('user' => $user))
@elseif (access()->hasRole('Admin'))
@include('frontend.user.partials.distributor', array('user' => $user))
@elseif (access()->hasRole('Individual'))
@include('frontend.user.partials.individual', array('user' => $user))
@elseif (access()->hasRole('JobSeeker'))
@include('frontend.user.partials.individual', array('user' => $user))
@elseif (access()->hasRole('ServiceProvider'))
@include('frontend.user.partials.service_provider', array('user' => $user))
@elseif (access()->hasRole('SchoolCollege'))
@include('frontend.user.partials.school_college', array('user' => $user))
@elseif (access()->hasRole('Distributor'))
@include('frontend.user.partials.distributor', array('user' => $user))
@endif


@endsection
@if(true)

@section('after-styles-end')
<style type="text/css">

    .StripeElement {
        background-color: white;
        height: 40px;
        padding: 10px 12px;
        border-radius: 4px;
        border: 1px solid transparent;
        box-shadow: 0 1px 3px 0 #e6ebf1;
        -webkit-transition: box-shadow 150ms ease;
        transition: box-shadow 150ms ease;
    }

    .StripeElement--focus {
        box-shadow: 0 1px 3px 0 #cfd7df;
    }

    .StripeElement--invalid {
        border-color: #fa755a;
    }

    .StripeElement--webkit-autofill {
        background-color: #fefde5 !important;
    }
    .stripe-sub-btn {
        text-align: right;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .stripe-sub-btn button{

    }
    .card-title{
        margin-top: 15px;
    }
</style>
@endsection
@endif 

