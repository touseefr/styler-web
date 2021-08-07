@extends ('backend.layouts.master') @section ('title', 'Catrgories') @section('page-header')
<h1>
    {{ trans('menus.categories.main') }}
</h1>
@include('backend.categories.includes.partials.header-buttons') @endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li>{!! link_to_route('backend.categories.index', trans('menus.categories.main')) !!}</li>
<li class="active">{!! trans('menus.categories.create') !!}</li>
@stop @section('content') 
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <!-- /.box-header -->
                <div class="box-header with-border">
                    <h3 class="box-title">
                        {{ trans('labels.category.add_new_category') }}
                    </h3>
                </div>
                <!-- /.box-header -->
                <!-- form start -->
                {!! Form::open(['route' => 'backend.categories.save', 'role' => 'form','method' => 'POST','class'=>'form-horizontal']) !!}
                <div class="box-body">
                    <div class="form-group">
                        {!! Form::label('categorytype', trans('labels.category.category_type'), ['class' => 'col-sm-3 control-label']) !!}
                         <div class="col-sm-7">
                        <select class="form-control" name="categorytype">
                            <option value="0">Select Category Type</option>
                            @foreach ($categoriestype as $type)
                            <option value="{!! $type->id !!}" >{!! $type->name !!}</option>
                            @endforeach
                        </select>
                        </div>
                    </div>
                    <div class="form-group">
                        {!! Form::label('categoryname', trans('labels.category.category_name'), ['class' => 'col-sm-3 control-label']) !!}
                        <div class="col-sm-7">
                         {!! Form::input('text','name', '', ['class' => 'form-control','id' => 'categoryname','name'=>'categoryname','placeholder'=>'Category Name',]) !!}
                        </div>
                    </div>
                    <div class="form-group">
                        {!! Form::label('parentcategory', trans('labels.category.parent_category'), ['class' => 'col-sm-3 control-label']) !!}
                         <div class="col-sm-7">
                        <select class="form-control select2" name="parentcategory">
                            <option value="0">Select Category</option>
                            @foreach ($categories as $category)
                            <option value="{!! $category->id !!}" >{!! $category->name !!}</option>
                            @endforeach
                        </select>
                        </div>
                    </div>
                </div>
                <!-- /.box-body -->
                <div class="box-footer">
                     {!! Form::submit(trans('labels.category.add_category_button'), ['class' => 'btn bg-green pull-right']) !!} 
                </div>
                {!! Form::close() !!}
        </div>
        <!-- /.box -->
    </div>
</div>
{!! HTML::script('js/backend/categories/categories.js') !!} @yield('before-scripts-end')
<div class="clearfix"></div>
@stop
