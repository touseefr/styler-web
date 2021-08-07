@extends('backend.layouts.master')

@section('page-header')
<h1>Posts</h1>
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a class="toolbar_btn" title="Faqs" href="{{url('admin/blog')}}">
                <i class="fa  fa-tags tool-icon"></i>
                <div>Posts</div>
            </a>
        </li>
        <li>
            <a href="{{url('admin/blog/post/create')}}" class="toolbar_btn" title="Create New Faq">
                <i class="fa fa-plus tool-icon"></i>
                <div>Add New Post</div>
            </a>
        </li>   
    </ul>
</div>
@endsection

@section('content')

@if(Session::has('message'))
<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
@endif

@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">Posts</li>
@stop
<table class="table table-bordered table-hover table-striped">
    <tr>
        <th>ID</th>
        <th>Status</th>
        <th>Published on</th>
        <th>Title</th>
        <th>Actions</th>
    </tr>
    @foreach($posts as $post)
    <tr class="post-{{ $post->id }}">
        <td>{{ $post->id }}</td>
        <td class='post_status_text_{{ $post->id }}'>{{ $post->post_status }}</td>
        <td>{{ date('d M Y', strtotime($post->published_at)) }}</td>
        <td>{{ $post->title }}</td>
        <td>
            <a  href="{{url('admin/blog/post/edit/'.$post->id)}}" class="btn btn-xs btn-primary"><i class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"></i></a>
            <a  id='{{$post->id}}' class="btn-delete btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i></a>
            <a  id='{{$post->id}}'class="btn btn-publish btn-xs btn-success"><i class="fa fa-check" data-toggle="tooltip" data-placement="top" title="" data-original-title="Publish"></i></a>
        </td>
    </tr>

    @endforeach
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

            $.get('/admin/blog/post/' + post_id + '/delete', {
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