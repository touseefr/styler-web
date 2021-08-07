@extends('backend.layouts.master')
@section('page-header')    
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">

    </ul>
</div>
@endsection
@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">        
    Add a new Counpon
</li>
@stop
@section('content')       
{!! Form::open(array('class' => 'form-horizontal', 'files' => 'true', 'url' => '/admin/coupon/new')) !!}

<div class="row">
    <div class="col-md-6">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="title">Title</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" name="coupon_title" id="coupon_title"/>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label field-content" for="slug">Percentage</label>
            <div class="col-sm-10">
                <div class="input-group">
                    <span class="input-group-addon" style="background-color: #e6e9ef;font-weight: bold;">%</span>
                    <input type="number" class="form-control" id="coupon_amount" name="coupon_amount">
                </div>
        <!--        <input type="text" class="form-control" id="coupon_amount" name="coupon_amount"/>-->
            </div>
        </div>
    </div>
    <div class="col-md-6">        
        <div class="form-group">
            <label class="col-sm-3 control-label" for="chapo">Discount Type</label>
            <div class="col-sm-9" style="margin-top: 7px;display: flex;align-items: flex-start;">    
                <input type="radio" id="coupon_type_percentage" name="coupon_type" class="discount_type" value="0" checked="checked" style="margin-left: 5px;cursor: pointer;" />
                <label for="coupon_type_percentage" style="margin-left: 5px;cursor: pointer;">Percentage</label>                               
                <input type="radio" id="coupon_type_amount" name="coupon_type" class="discount_type" value="1"  style="margin-left: 5px;cursor: pointer;"  />
                <label for="coupon_type_amount" style="margin-left: 5px;cursor: pointer;">Amount</label>                
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-3 control-label" for="chapo">Duration</label>
            <div class="col-sm-9" style="margin-top: 7px;display: flex;align-items: flex-start;">                
                <input type="radio" id="coupon_duration_forever" name="coupon_duration" value="0" checked="checked" style="margin-left: 5px;cursor: pointer;" />
                <label for="coupon_duration_forever" style="margin-left: 5px;cursor: pointer;">Forever</label>                
                <input type="radio" id="coupon_duration_once" name="coupon_duration" value="1" style="margin-left: 5px;cursor: pointer;" />
                <label for="coupon_duration_once" style="margin-left: 5px;cursor: pointer;">Once</label>  
                 <input type="radio" id="coupon_days_duration" name="coupon_duration" value="2" class="duration" style="margin-left: 5px;cursor: pointer;" />
                <label for="coupon_days_duration" style="margin-left: 5px;cursor: pointer;">Days</label> 
                <input type="number" id="number_of_days" name="number_of_days" placeholder="Days" value="0" style="display: none;margin-left: 15px;margin-top: -4px;width: 56px;text-align: center;" />
<!--                <input type="radio" id="coupon_type_repeating" name="coupon_duration" value="2" style="margin-left: 5px;cursor: pointer;" />
                <label for="coupon_type_repeating" style="margin-left: 5px;cursor: pointer;">repeating</label>                -->
            </div>
        </div>
    </div>

</div>


<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-1 control-label" for="coupon_description">Description</label>
            <div class="col-sm-11">
                <textarea rows="10" id="coupon_description" name="coupon_description" class="form-control"></textarea>
            </div>
        </div>		 
    </div>
</div>
<button id="btn_save_post"  type="submit" class="col-md-offset-2 btn btn-primary" stylreviewe="margin-left: 92px !important;">Save</button>
{!! Form::close()!!}
@endsection

@section('footer-scripts')

<script src="//cdn.ckeditor.com/4.5.6/standard/ckeditor.js"></script>
<script src="//cdn.ckeditor.com/4.5.6/standard/adapters/jquery.js"></script>

<script>

$(document).ready(function () {
    $(document).on("change", ".discount_type", function () {
        var selected_value = $(this).val();
        console.log(selected_value);
        if (selected_value == 0) {
            $('.field-content').text("Percentage");
            $('.input-group-addon').text("%");
        } else {
            $('.field-content').text("Amount");
            $('.input-group-addon').text("$");
        }
    })
    $(document).on("change", ".duration", function () {
        console.log($(this).val());
        var radioOption=$(this).val();
        if(radioOption==2){
            console.log("select the info");
            $("#number_of_days").show();
        }else{
            $("#number_of_days").hide();
        }
    });

});

function showPost(data) {
    $('#title').val(data.title);
    $('#slug').val(data.slug);
    $('#chapo').val(data.chapo);
    $('#content').val(data.content);
    $('#published_at').val(data.published_at);
    $('#category_id').val(data.category_id);
}

$(document).ready(function () {

    $('.ckedit').ckeditor(); // if class is prefered.

    // loading
    var post_id = $('#post_id').val();
    if (post_id > 0) {
        $.post('<?php echo url("/admin/blog/load_post"); ?>', {
            _token: "{{ csrf_token() }}",

            post_id: post_id
        }, function (data) {
            showPost(data);

        }, 'json');
    }
    // publishing
    $('#btn_publish_post').click(function (e) {
        e.preventDefault();

        $(this).addClass('disabled');

        $.post('<?php echo url("/admin/blog/save_post"); ?>', {
            _token: "{{ csrf_token() }}",

            post_id: $('#post_id').val()
        }, function (data) {

            $('#btn_publish_post').removeClass('disabled');

        }, 'json');
    });
});
</script>

<style type="text/css">
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }

</style>
@endsection