@extends('backend.layouts.master')

@section('page-header')
<h1>Coupon</h1>
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">           
        <li>
            <a href="{{ Url('admin/coupon/new') }}" class="toolbar_btn" title="Create New Coupon">
                <i class="fa fa-plus tool-icon"></i>
                <div>Add New Coupon</div>
            </a>
        </li>   
    </ul>
</div>
@endsection

@section('content')
@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">Coupon</li>
@stop
@if(Session::has('message'))
<p class="alert {{ Session::get('type') }}">{{ Session::get('message') }}</p>
@endif
<table class="table table-bordered table-hover table-striped">
    <tr>
        <th>ID</th>
        <th>Code</th>
        <th>Title</th>
        <th>Amount</th>
        <th>Duration</th>
        <th>Status</th>
        <th>Description</th>       
    </tr>    
    @if($coupons)
    
    @foreach($coupons as $coupon)
    <tr>
        <td>{{ $coupon->id }}</td>
        <td>{{ $coupon->coupon_id }}</td>
        <td>{{ $coupon->coupon_name }}</td>
        <td>{{ $coupon->coupon_amount }}</td>
        <td>{{ $coupon_type[$coupon->coupon_type] }}</td>
        <td>{{ $duration[$coupon->coupon_status] }}</td>
        <td>{{ strip_tags($coupon->coupon_description) }}</td>       
    </tr>    
    @endforeach
    @else
    <tr >
        <td colspan="8" style="text-align: center;">Coupon not Found</td>        
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

            var post_id = $(this).data('id');
            var btn = $(this);

            $.post('<?php echo url('/admin/blog/publish_post'); ?>', {

                _token: "{{ csrf_token() }}",
                post_id: post_id

            }, function (data) {
                $(btn).removeClass('disabled');
                if (data.status == 'success') {
                    toastr.success(data.message);
                    $('.btn-publish').fadeOut(2000, function () {});
                    console.log(data.object);

                    // TODO delete table row



                } else {
                    toastr.error(data.error);
                }
            }, 'json');
        });

        // delete post
        $('.btn-delete').click(function (e) {
            e.preventDefault();
            $(this).addClass('disabled');

            var post_id = $(this).data('id');
            var btn = $(this);

            $.get('/admin/post/' + post_id + '/delete', {
                _token: "{{ csrf_token() }}",
                post_id: post_id
            }, function (data) {
                $(btn).removeClass('disabled');
                if (data.status == 'success') {
                    $('.post-' + post_id).fadeOut(2000, function () {});
                    toastr.success(data.message);

                    console.log(data.object);

                    // TODO delete table row



                } else {
                    toastr.error(data.error);
                }
            }, 'json');
        });

    });
</script>

@endsection