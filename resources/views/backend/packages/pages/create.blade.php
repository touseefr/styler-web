@extends ('backend.layouts.master') @section ('title', 'Create Page') @section('page-header')
<h1>
   {{ trans('menus.staticpages.create') }}
</h1>
@endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{!! link_to_route('backend.pages.index', trans('menus.staticpages.main')) !!}</li>
<li class="active">{!! trans('menus.staticpages.create') !!}</li>
@stop @section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-default">
            <!-- /.box-header -->
            <div class="box-header with-border">
                <h3 class="box-title">
                    {{ trans('labels.pages.create_page') }}
                </h3>
            </div>
            <!-- /.box-header -->
            <!-- form start -->
            {!! Form::open(['route' => 'backend.pages.save', 'role' => 'form','method' => 'POST','files'=>true, 'class'=>'form-horizontal']) !!}
            <div class="box-body">
                   <!-- panel start -->
                <div class="col-sm-12 panel panel-default" style="padding-left:0px;padding-right:0px;">
                    <!-- panel heading start -->
                <div class="panel-heading" style="background:transparent;">
                        <h3 class="panel-title">Primary Information</h3>
            </div>
                    <!-- panel heading end -->
            <!-- panel body start -->
            <div class="panel-body"> 
                <div class="form-group">
                    {!! Form::label('pagetitle', trans('labels.pages.pagetitle'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::input('text','name', '', ['class' => 'form-control','id' => 'pagetitle','name'=>'pagetitle','placeholder'=>'Page Title',]) !!}
                    </div>
                </div>
                <div class="form-group">
                    {!! Form::label('pageurl', trans('labels.pages.pageurl'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::input('text','name', '', ['class' => 'form-control','id' => 'pageurl','name'=>'pageurl','placeholder'=>'Page Url',]) !!}
                    </div>
                </div>
               <div class="form-group">
                    {!! Form::label('pagedesc', trans('labels.pages.pagedesc'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::textarea('notes', null, ['class' => 'form-control textarea','id' => 'pagedesc','name'=>'pagedesc','size' => '30x4','placeholder'=>'Page Description',]) !!}
                    </div>
                </div>
            </div>
            <!-- panel body end -->
            </div>
            <!-- panel end -->
            </div>
            <!-- /.box-body -->
            <div class="box-footer">
                {!! Form::submit(trans('labels.pages.submit'), ['class' => 'btn bg-green pull-right']) !!}
            </div>
            {!! Form::close() !!}
        </div>
        <!-- /.box -->
    </div>
</div>
{!! HTML::script('js/backend/pages/pages.js') !!} @yield('before-scripts-end')
<div class="clearfix"></div>
@stop
