@extends('backend.layouts.master')
@section('page-header')
<h1>Create Listing Package</h1>
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">

    </ul>
</div>
@endsection
@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">
    Add New Listing Package
</li>
@stop
@section('content')
{!! Form::open(array('class' => 'form-horizontal', 'id' => 'packages-form','files' => 'true', 'url' => '/admin/ListingPackage')) !!}

<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="name">Title</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" name="name" id="name" required="required" />
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="limit">No Of Listing</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" name="limit" id="limit" required="required" />
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="price">Price</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" name="price" id="price" required="required" />
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="price">Status</label>
            <div class="col-sm-10" style="margin-top: 6px">
                <input type="checkbox" class="" name="status" id="status" checked value="1" />
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label class="col-sm-2 control-label" for="description">Description</label>
            <div class="col-sm-10">
                <textarea rows="10" id="description" name="description" class="form-control" required="required"></textarea>
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