@extends('backend.layouts.master')

@section('page-header')
<h1>User Packages</h1>
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
<li class="active">User Packages</li>
@stop
<div class="row border-bottom">
    <div class="col-xs-12 col-md-6">
    </div>
    <div class="col-xs-12 col-md-6 text-right">
        <a id="newbtn" class='btn btn-primary btn-md px-25 mr-10 mb-2' data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Search</a>                
    </div>
</div>
<div clas='clear'></div>
<br />
@if(Session::has('message'))
<p class="alert {{ Session::get('type') }}">{{ Session::get('message') }}</p>
@endif

<div class="col-md-12 admin-user-search-panel" style="margin-bottom: 20px;display:none;">
    <form class="form-inline formFlex" id='frm-admin-search-user' name="frm-admin-search-user" method="POST" action="">
        <div class="form-group mr-15">
            <label for="exampleInputEmail1">User By Name</label>
            <input type="text" class="form-control" name="userName" id="exampleInputEmail1"  aria-describedby="emailHelp" placeholder="User Name">
        </div>
        <div class="form-group mr-15">
            <label for="fromDate">From</label>
            <input type="text" class="form-control" id="fromDate" name="fromDate" />
        </div>
        <div class="form-group mr-15">
            <label for="toDate">To</label>
            <input type="text" class="form-control" id="toDate" name="toDate" />
        </div>
        <button type="submit" class="btn btn-primary px-25" id='admin-search-user'>Submit</button>
    </form>
</div>

<table class="serach-table table-bordered table-hover table-striped">
    <thead>
        <tr>            
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Package</th>
            <th>Subscribe Date</th>
        </tr>
    </thead>
    <tbody>        
        @if(count($users)>0)
        @foreach($users as $index=>$user)
        <tr>
            <th>{{$user['user_details']['name']}}</th>
            <th>{{$user['user_details']['email']}}</th>
            <th>{{$user['package_type']}}</th>
            <th>{{$user['fetch_packages']['name']}}</th>
            <th>{{$user['created_at']}}</th>
        </tr>
        @endforeach
        @else
        <tr>
            <td colspan="5" style="text-align: center;">No User Have Packages.</td>
        </tr>
        @endif

    </tbody>
</table>

@endsection

@section('footer-scripts')
<script>
    $().ready(function () {
        var $obj_search = $(".serach-table").DataTable();
        $(document).on("click", "#newbtn", function () {
            $(".admin-user-search-panel").show();
        });
        $(document).on("submit", "#frm-admin-search-user", function () {

//    var $obj_search = $(".serach-table").DataTable();
//    $obj_search.row.add(["check 01 Saloon", "cs02@test.com", "sms", "SmS Small Package", "2020-01-17 11:35:21"]);
//    $obj_search.draw();
//    return false;
            var data = $(this).serialize();
            console.log(data);
            $.ajax({
                url: "/admin/list/user/packages",
                data: data,
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                    if (response.status == '200') {
                        var $obj_search = $(".serach-table").DataTable();
                        $obj_search.clear().draw();
                        $.each(response.data, function ($index, $value) {
                            $obj_search.row.add($value);
                        });
                        $obj_search.draw();

                    }
                }}
            );
            return false;
        });
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
    }
    );
</script>

@endsection