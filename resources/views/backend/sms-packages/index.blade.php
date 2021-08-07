@extends('backend.layouts.master')

@section('page-header')
<h1>SMS Packages</h1>
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a href="{{ Url('admin/SmsPackage/New') }}" class="toolbar_btn" title="Create New Package">
                <i class="fa fa-plus tool-icon"></i>
                <div>Add New Package</div>
            </a>
        </li>
    </ul>
</div>
@endsection

@section('content')
@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">SMS Packages</li>
@stop
@if(Session::has('message'))
<p class="alert {{ Session::get('type') }}">{{ Session::get('message') }}</p>
@endif
<table class="table table-bordered table-hover table-striped">
    <thead>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>No Of SMS</th>
            <th>Price</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @if(count($packagedetail) > 0)
        @foreach($packagedetail as $package)
        <tr class="package-{{$package->id}}">
            <td>{{ $package->id }}</td>
            <td>{{ $package->name }}</td>
            <td>{{ $package->description }}</td>
            <td>{{ $package->limit }}</td>
            <td>${{ $package->price }}</td>
            <td>
                <a id='{{$package->id}}' data-id='{{$package->id}}' class="btn-delete btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i></a>
                @if( $package->status == 1)
                <a id='{{$package->id}}' href="/admin/SmsPackage/{{$package->id}}" data-id='{{$package->id}}' class="btn btn-xs btn-warning"><i class="fa fa-pause" data-toggle="tooltip" data-placement="top" title="Deactivate Package"></i></a>
                @else
                <a id='{{$package->id}}' href="/admin/SmsPackage/{{$package->id}}" data-id='{{$package->id}}' class="btn btn-xs btn-success"><i class="fa fa-play" data-toggle="tooltip" data-placement="top" title="Activate Package"></i></a>
                @endif
            </td>
        </tr>
        @endforeach
        @else
        <tr>
            <td colspan="6" style="text-align: center;">SMS Packages not Available</td>
        </tr>
        @endif
    </tbody>
</table>

@endsection

@section('footer-scripts')
<script>
    $().ready(function() {

        // delete post
        $('.btn-delete').click(function(e) {
            e.preventDefault();
            $(this).addClass('disabled');

            var id = $(this).data('id');
            var btn = $(this);
            $.ajax({
                url: '/admin/SmsPackage/' + id,
                type: 'DELETE',
                data: {
                    id: id
                }, // Remember that you need to have your csrf token included
                dataType: 'json',
                success: function(data) {
                    $(btn).removeClass('disabled');
                    if (data.status == 'success') {
                        $('.package-' + id).fadeOut(2000, function() {});
                        toastr.success(data.message);
                    } else {
                        toastr.error('Something went wrong.Please try later!');
                    }
                },
                error: function(response) {
                    toastr.error('Something went wrong.Please try later!');
                }
            });
        });
    });
</script>

@endsection