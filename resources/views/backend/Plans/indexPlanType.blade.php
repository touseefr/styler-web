@extends('backend.layouts.master')
@section('page-header')
<h1>{{trans('plans.manage_plan_type.manage_plan_type')}}</h1>
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a href="{{url('admin/subscription/plan/type/create')}}" class="toolbar_btn" title="Create New Plan">
                <i class="fa fa-plus tool-icon"></i>
                <div>{{trans('plans.manage_plan_type.addplantype')}}</div>
            </a>
        </li>   
    </ul>
</div>
@endsection

@section('content')

@if(Session::has('message'))
<div class="alert alert-success" style="text-align: center;">{{Session::get('message')}}</div>

@endif
@if(Session::has('error'))
<div class="alert alert-error" style="text-align: center;">{{Session::get('error')}}</div>
@endif

@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">{{trans('plans.manage_plan_type.manage_plan_type')}}</li>
@stop
<table class="table table-bordered table-hover table-striped">
    <tr>
        <th>Title</th>
        <th>Package Name</th>
        <th>Stripe Id</th>
        <th>Price</th>
        <th>Interval</th>
        <th>Currency</th>
        <th>Top Cricle Text</th>
        <th>Button Text</th>
        <th>Created Date</th>
        <th>Role</th>
        <th>Actions</th>
    </tr>
    @if(isset($plansType) && count($plansType)>0)
    @foreach($plansType as $plan)
    <tr class="post-{{ $plan['id'] }}">
        <th>{{$plan['name']}}</th>
        <th>{{(isset($plan['plan_detail'][0]))?$plan['plan_detail'][0]['name']:''}}</th>
        <th>{{(isset($plan['plan_detail'][0]))?$plan['plan_detail'][0]['stripe_plan_id']:''}}</th>
        <th>{{(isset($plan['plan_detail'][0]))?$plan['plan_detail'][0]['price']:''}}</th>
        <th>{{(isset($plan['plan_detail'][0]))?$plan['plan_detail'][0]['duration']:''}}</th>
        <th>{{(isset($plan['plan_detail'][0]))?$plan['plan_detail'][0]['currency']:''}}</th>
        <th>{{$plan['top_circle_text']}}</th>
        <th>{{$plan['button_text']}}</th>
        <th>{{$plan['created_at']}}</th>
        <th>{{$plan['plan_belong_to_role']['name']}}</th>
        <td>           
            <a href="/admin/subscription/plan/type/edit/<?php echo $plan['id']; ?> " class="btn btn-xs btn-primary"><i class="fa fa-pencil"></i></a>
            <a  id='{{$plan['id']}}' class="btn-delete btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i></a>            
        </td>
    </tr>
    @endforeach
    @else
    <tr >
        <td colspan="7" style="text-align: center;">{{trans("plans.manage_plans.msg_not_found")}}</td>        
    </tr>
    @endif
</table>

@endsection

@section('footer-scripts')
<script>
    $().ready(function () {
        $('#btn_save_options').click(function (e) {
            e.preventDefault();

            $.post('<?php echo url('/admin/blog/save_options'); ?>', {
                _token: "{{ csrf_token() }}",
                rss_name: $('#option_rss_name').val(),
                rss_number: $('#option_rss_number').val(),
                rss_fullposts: $('#option_rss_fullposts').val()
            }, function (data) {
                console.log('options saved');
            });
        });
        // categories
        $('#create_category').click(function (e) {
            e.preventDefault();
            $(this).addClass('disabled');
            var btn = $(this);

            $.post('<?php echo url('/admin/blog/create_category'); ?>', {
                _token: "{{ csrf_token() }}",
                category_name: $('#new_cat').val()

            }, function (data) {
                $(btn).removeClass('disabled');

                if (data.status == 'success') {
                    toastr.success('Category created.');

                    console.log(data.object);

                    // TODO add table row

                } else {
                    toastr.error(data.error);
                }
            }, 'json');
        });
        // publishing
        $('.btn-publish').click(function (e) {

            e.preventDefault();
            $(this).addClass('disabled');

            var post_id = $(this).attr('id');
            var btn = $(this);

            $.get('blog/post/' + post_id + '/status', {
                _token: "{{ csrf_token() }}",
                post_id: post_id
            }, function (data) {
                $(btn).removeClass('disabled');
                if (data.status == '200') {
                    toastr.success(data.msg);
                    $(".post_status_text_" + post_id).text(data.now_status);

                } else {
                    toastr.error(data.error);
                }
            }, 'json');
        });
        // delete post
        $('.btn-delete').click(function (e) {
            e.preventDefault();
            $(this).addClass('disabled');

            var post_id = $(this).attr('id');
            var btn = $(this);

            $.post('/admin/subscription/plan/type/' + post_id + '/delete', {
                _token: "{{ csrf_token() }}",
                post_id: post_id
            }, function (data) {
                console.log(data);
                $(btn).removeClass('disabled');
                if (data.status == '200') {
                    $('.post-' + post_id).fadeOut(2000, function () {});
                    toastr.success(data.msg);
                    // TODO delete table row
                } else {
                    toastr.error(data.error);
                }
            }, 'json');
        });

    });
</script>

@endsection