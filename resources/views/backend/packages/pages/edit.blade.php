@extends ('backend.layouts.master') @section ('title', 'Edit Page') @section('page-header')

<h1>
    {{ trans('menus.staticpages.main') }}
</h1>
@include('backend.pages.includes.partials.header-buttons')
@endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{!! link_to_route('backend.pages.index', trans('menus.staticpages.main')) !!}</li>
<li class="active">{!! trans('menus.staticpages.edit') !!}</li>
@stop @section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <!-- /.box-header -->
                <div class="box-header with-border">
                    <h3 class="box-title">
                        {{ trans('labels.pages.edit_page') }}
                    </h3>
                </div>
                <!-- /.box-header -->
                <!-- form start -->
                {!! Form::open(['route' => 'backend.pages.update', 'role' => 'form','method' => 'POST','files'=>true, 'class'=>'form-horizontal']) !!}
                <div class="box-body">
                    <!-- Left nav start -->
                    <!-- Left nav end -->
                    <!-- panel start -->
                    <div class="col-sm-12 panel panel-default" style="padding-left:0px;padding-right:0px;">
                     <!-- panel heading start -->
                    <div class="panel-heading" style="background:transparent;">
                        <h3 class="panel-title" id="pageTitle">Primary Information</h3>
                    </div>
                     <!-- panel heading end -->
                     <!-- panel body start -->
                <div class="panel-body">
                    <div id="primary-section">
                        <div class="form-group">
                          <div class="col-12 col-sm-6 d-flex">
                              {!! Form::label('pagetitle', trans('labels.pages.pagetitle'), ['class' => 'col-sm-2 control-label']) !!}
                              {!! Form::input('text','name', @$pagedetail->title, ['class' => 'form-control','id' => 'pagetitle','name'=>'pagetitle','placeholder'=>'Page Title']) !!}                                
                            </div>
                            <div class="col-6 col-sm-6 d-flex">
                              {!! Form::label('pageurl', trans('labels.pages.pageurl'), ['class' => 'col-sm-2 control-label']) !!}
                              {!! Form::input('text','name', @$pagedetail->url, ['class' => 'form-control','id' => 'pageurl','name'=>'pageurl','placeholder'=>'Page Url','disabled'=>'true']) !!}
                            </div>
                        </div>
					            	<div class="form-group">
                          <div class="col-12 d-flex">
                            {!! Form::label('pagedesc', trans('labels.pages.pagedesc'), ['class' => 'col-sm-1 control-label']) !!}
                            {!! Form::textarea('notes', @$pagedetail->description, ['class' => 'form-control textarea','id' => 'pagedesc','name'=>'pagedesc','size' => '30x4','placeholder'=>'Page Description']) !!}
                          </div>
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
                    {!! Form::input('hidden','name', $pagedetail->id ,  ['id' => 'updatedid','name'=>'id']) !!}
                </div>
                {!! Form::close() !!}
        </div>
        <!-- /.box -->
    </div>
</div>
{!! HTML::script('js/backend/pages/pages.js') !!} @yield('before-scripts-end')
<div class="clearfix"></div>
@stop
