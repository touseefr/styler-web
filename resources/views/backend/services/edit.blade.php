@extends ('backend.layouts.master') @section ('title', 'Services') @section('page-header')
<h1>
    {{ trans('menus.services.main') }}
</h1>
@include('backend.services.includes.partials.header-buttons') @endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">
        <i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a>
</li>
<li>{!! link_to_route('backend.services.index', trans('menus.services.main')) !!}</li>
<li class="active">{!! trans('menus.services.create') !!}</li>
@stop @section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
           
            <!-- /.box-header -->
            <div class="box-header with-border">
              <h3 class="box-title">
              {{trans('labels.category.edit_category')}}
            
              </h3>
             
            </div>
            <!-- /.box-header -->
            <!-- form start -->
           {!! Form::open(['route' => 'backend.services.update',  'role' => 'form','method' => 'POST','class'=>'form-horizontal services']) !!}
  			<div class="box-body">
                <div class="form-group">
                {!! Form::label('servicename', trans('labels.category.category_name'), ['class' => 'col-sm-3 control-label']) !!} 
                   <div class="col-sm-7">
                  {!! Form::input('text','name', @$servicedetail->name ,  ['class' => 'form-control','id' => 'servicename','name'=>'servicename','placeholder'=>trans('labels.services.service_name'),]) !!}
                  </div>
                 </div>
                  <div class="form-group">
                        {!! Form::label('categories', trans('labels.services.assign_category'), ['class' => 'col-sm-3 control-label']) !!}
                           <div class="col-sm-7">
                                @if(count($categorieslist) > 0 )
                                <ul class="nav nav-list list-group">
                                     @foreach ($categorieslist as $parentcategory)
                                    <li class="list-group-item">
                                       <div class="checkbox">
                                        <label class="tree-toggler nav-header">
										<input @if(count($parentcategory->services) > 0) checked="checked"    @endif name="categoriesselected[]" type="checkbox" value="{!! $parentcategory->id !!}" />{!! $parentcategory->name !!}</label>
                                        @if(count($parentcategory->categories) > 0)
                                            <span class="collapse-icon" style="float:right;"> <i class="fa fa-fw fa-plus-circle"></i> </span>
                                        @endif
                                       </div>
                                        @if(count($parentcategory->categories) > 0)
										
                                        <ul class="nav nav-list tree" style="display:none;">
                                            @foreach($parentcategory->categories as $subcategories)
											<li class="list-group-item"><div class="checkbox"><label>
											<input @if(count($subcategories->services) > 0) checked="checked"    @endif type="checkbox" name="categoriesselected[]" value="{!! $subcategories->id !!}" /> {!!  $subcategories->name !!} </label></div> </li>
                                            @endforeach
                                        </ul>
                                        @endif
                                    </li>
                                     @endforeach
                                </ul>
                                @endif
                            </div>
                    </div>
         </div>
              <!-- /.box-body -->
			   <div class="box-footer">
               
                 {!! Form::submit(trans('labels.category.update_category'), ['class' => 'btn bg-green pull-right']) !!}
                 {!! Form::input('hidden','name', $servicedetail->id ,  ['id' => 'updatedid','name'=>'id']) !!}
         </div>
          {!! Form::close() !!}
            
        </div>
        <!-- /.box -->
    </div>
</div>
{!! HTML::script('js/backend/services/services.js') !!} @yield('before-scripts-end')
<div class="clearfix"></div>
@stop
