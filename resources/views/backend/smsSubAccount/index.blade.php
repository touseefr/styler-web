@extends('backend.layouts.master')

@section('page-header')
<h1>SMS Global Sub Account</h1>
<!--<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a href="{{ Url('admin/SmsPackage/New') }}" class="toolbar_btn" title="Create New Package">
                <i class="fa fa-plus tool-icon"></i>
                <div>Add New Package</div>
            </a>
        </li>
    </ul>
</div>-->
@endsection

@section('content')
@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">SMS Sub Account</li>
@stop
@if(Session::has('message'))
<p class="alert {{ Session::get('type') }}">{{ Session::get('message') }}</p>
@endif
<table class="table table-bordered table-hover table-striped">
    <thead>
        <tr>            
            <th>Email</th>
            <th>Name</th>
            <th>Password</th>
            <th>Key</th>
            <th>Secret</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>        
        @if(count($accounts)>0)
        @foreach($accounts as $index=>$account)
        <tr>            
            <th>{{$account['user_detail']['email']}}</th>
            <th>{{$account['user_detail']['name']}}</th>
            <th>Tiger@123</th>
            <th>{{$account['api_key']}}</th>
            <th>{{$account['api_secret']}}</th>
            <th>
                <a href="{{url('admin/smsglobal/edit/subaccounts/'.$account["id"])}}" class="btn btn-xs btn-primary"><i class="fa fa-pencil"></i></a>
                <!--<a class="btn-delete btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i></a>-->                                                          
            </th>
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
    $().ready(function () {

        // delete post
        $('.btn-delete').click(function (e) {
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
                success: function (data) {
                    $(btn).removeClass('disabled');
                    if (data.status == 'success') {
                        $('.package-' + id).fadeOut(2000, function () {});
                        toastr.success(data.message);
                    } else {
                        toastr.error('Something went wrong.Please try later!');
                    }
                },
                error: function (response) {
                    toastr.error('Something went wrong.Please try later!');
                }
            });
        });
        
    });
</script>

@endsection