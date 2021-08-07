@extends ('backend.layouts.master') @section ('title', 'Schools and Colleges') @section('page-header')
<h1>
    {{ trans('menus.schoolcolleges.main') }}
</h1>
@include('backend.schoolcolleges.includes.partials.header-buttons') @endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{!! link_to_route('backend.schoolcolleges.index', trans('menus.schoolcolleges.main')) !!}</li>
<li class="active">{!! trans('menus.schoolcolleges.create') !!}</li>
@stop @section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-default">
            <!-- /.box-header -->
            <div class="box-header with-border">
                <h3 class="box-title">
                    {{ trans('labels.school.new_school') }}
                </h3>
            </div>
            <!-- /.box-header -->
            <!-- form start -->
            {!! Form::open(['route' => 'backend.schoolcolleges.save', 'role' => 'form','method' => 'POST','files'=>true, 'class'=>'form-horizontal']) !!}
            <div class="box-body">
                <!-- Left nav start -->
                <div class="col-sm-3">
                    <div class="list-group nav nav-tabs" id="navTab">
                    <a class="list-group-item active" idata-toggle="tab" href="#primaryInformationSection">Primary Information</a>
                    <a class="list-group-item disabled" data-toggle="tab" href="#associationSection">Association</a>
                    <a class="list-group-item disabled" data-toggle="tab" href="#">Gallery</a>
                    </div>
               </div>
                    <!-- Left nav end -->
                   <!-- panel start -->
                <div class="col-sm-9 panel panel-default" style="padding-left:0px;padding-right:0px;">
                    <!-- panel heading start -->
                <div class="panel-heading" style="background:transparent;">
                        <h3 class="panel-title">Primary Information</h3>
            </div>
                    <!-- panel heading end -->
            <!-- panel body start -->
            <div class="panel-body"> 
                <div class="form-group">
                    {!! Form::label('school.schoolname', trans('labels.school.name'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::input('text','name', '', ['class' => 'form-control','id' => 'schoolname','name'=>'schoolname','placeholder'=>'School or college Name',]) !!}
                    </div>
                </div>
                <div class="form-group">
                    {!! Form::label('school.schoolemail', trans('labels.school.email'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::input('text','name', '', ['class' => 'form-control','id' => 'schoolemail','name'=>'schoolemail','placeholder'=>'Email',]) !!}
                    </div>
                </div>
                <div class="form-group">
                    {!! Form::label('school.schoolphone', trans('labels.school.phone'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::input('text','name', '', ['class' => 'form-control','id' => 'schoolphone','name'=>'schoolphone','placeholder'=>'Phone Number',]) !!}
                    </div>
                </div>
                <div class="form-group">
                    {!! Form::label('school.schoolsuburb', trans('labels.school.suburb'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        <select class="form-control select2" id ='schoolsuburb' name = 'schoolsuburb'>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    {!! Form::label('school.schooltown', trans('labels.school.town'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::input('text','name', '', ['class' => 'form-control','id' => 'schooltown','name'=>'schooltown','placeholder'=>'Town',]) !!}
                    </div>
                </div>
                <div class="form-group">
                    {!! Form::label('school.schooladdress', trans('labels.school.address'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::textarea('notes', null, ['class' => 'form-control','id' => 'schooladdress','name'=>'schooladdress','size' => '30x4','placeholder'=>'Address',]) !!}
                    </div>
                </div>
                <div class="form-group">
                    {!! Form::label('school.schoolwebsite', trans('labels.school.website'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::input('text','name', '', ['class' => 'form-control','id' => 'schoolwebsite','name'=>'schoolwebsite','placeholder'=>'Website',]) !!}
                    </div>
                </div>
                <div class="form-group">
                    {!! Form::label('school.schooltype', trans('labels.school.type'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        <select class="form-control" name="schooltype" id="schooltype">
                            <option value="">Type</option>
                            <option value="school">School</option>
                            <option value="college">College</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- panel body end -->
            </div>
            <!-- panel end -->
            </div>
            <!-- /.box-body -->
            <div class="box-footer">
                {!! Form::submit(trans('labels.school.submit'), ['class' => 'btn bg-green pull-right']) !!}
            </div>
            {!! Form::close() !!}
        </div>
        <!-- /.box -->
    </div>
</div>
{!! HTML::script('js/backend/schoolcolleges/schoolcollege.js') !!} @yield('before-scripts-end')
<div class="clearfix"></div>
@stop
