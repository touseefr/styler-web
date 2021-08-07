@extends('backend.layouts.master')

@section('page-header')
<h1>Categories</h1>
@endsection
@section('content')
@section ('breadcrumbs')
<li><a href="{{route('backend.dashboard')}}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">Categories</li>
@stop

<div class="d-flex">
    <input type="text" id="new_cat" name="new_cat" value="" class="mr-3 px-3 flex-grow-1" />
    <button id="create_category" class="btn btn-primary">Create Category</button>
</div>
<table class="table table-bordered table-hover table-striped mt-4" id="DatatableCategory">
    <tr>
        <th>ID</th>
        <th>Name</th>            
        <th># of posts</th>
        <th>Actions</th>
    </tr>
    @foreach($categories as $category)
    <tr class="category-{{ $category->id }}">
        <td>{{ $category->id }}</td>
        <td>{{ $category->name }}</td>                
        <td>{{ $category->categoriespostcount() }}</td>
        <td>              
            <a data-id="{{$category->id}}" href="" class="btn-delete btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i></a>
        </td>
    </tr>

    @endforeach
</table>
@endsection

@section('footer-scripts')
<script>
    $().ready(function () {
        // categories
        $('#create_category').click(function (e) {
            e.preventDefault();
            $(this).addClass('disabled');
            var btn = $(this);
            $.post('<?php echo url('/admin/blog/category/create'); ?>', {
                _token: "{{ csrf_token() }}",
                category_name: $('#new_cat').val()
            }, function (data) {
                $(btn).removeClass('disabled');
                if (data.status == '200') {
                    toastr.success('Category created.');
                    var html = '<tr class="category-775"><td>' + data.data.id + '</td><td>' + data.data.name + '</td><td>' + data.data.post_count + '</td><td><a data-id="' + data.data.id + '" href="" class="btn-delete btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i></a></td></tr>';
                    $('#DatatableCategory').find('tbody').append(html);
                } else {
                    toastr.error(data.error);
                }
            }, 'json');
        });

        // delete category
        $('.btn-delete').click(function (e) {
            e.preventDefault();
            $(this).addClass('disabled');
            var category_id = $(this).data('id');
            var btn = $(this);
            $.post('/admin/blog/category/' + category_id + '/delete', {
                _token: "{{ csrf_token() }}",
                category_id: category_id
            }, function (data) {
                $(btn).removeClass('disabled');
                if (data.status == '200') {
                    $('.category-' + category_id).fadeOut(2000, function () {});
                    toastr.success(data.msg);
                } else {
                    toastr.error(data.error);
                }
            }, 'json');
        });
    });
</script>

@endsection