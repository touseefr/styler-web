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
    Edit Sms Global Sub Account.
</li>
@stop
@section('content')
{!! Form::open(array('class' => 'form-horizontal', 'id' => 'packages-form','files' => 'true', 'url' => '/admin/smsglobal/edit/subaccounts/'.$account['id'])) !!}
<input type="hidden" id="user_id" name="user_id" value="{{$account['user_detail']['id']}}"/>
<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="name">Title</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" name="name" id="name" value="{{$account['user_detail']['name']}}"  disabled="disabled"/>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="limit">Email</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" name="limit" value="{{$account['user_detail']['email']}}"  disabled="disabled" />
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="price">Password</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" name="password" id="password" value="Tiger@123"  disabled="disabled" />
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="price">Api Key</label>
            <div class="col-sm-10" style="margin-top: 6px">
                <input type="text" class="form-control" name="api_key" id="api_key" value="{{$account['api_key']}}"  placeholder="SMS Global API Key" required="required" />
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="description">Api Secret</label>
            <div class="col-sm-10">
                <input type="text" id="api_secret" name="api_secret" class="form-control" value="{{$account['api_secret']}}"   placeholder="SMS Global API Secret" required="required" />
            </div>
        </div>
    </div>
</div>
<div class="row" style="padding-left: 5px;">
    <div class="col-md-12">
        <button id="btn_save_post" type="submit" class="col-md-offset-2 btn btn-primary">Save</button>
    </div>
</div>
{!! Form::close()!!}
@endsection
