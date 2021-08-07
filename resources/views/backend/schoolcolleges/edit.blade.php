@extends ('backend.layouts.master') @section ('title', 'Schools and Colleges') @section('page-header')
<h1>
   {{ trans('menus.schoolcolleges.main') }}
</h1>
@include('backend.schoolcolleges.includes.partials.header-buttons')
@endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{!! link_to_route('backend.schoolcolleges.index', trans('menus.schoolcolleges.main')) !!}</li>
<li class="active">{!! trans('menus.schoolcolleges.edit') !!}</li>
@stop @section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <!-- /.box-header -->
                <div class="box-header with-border">
                    <h3 class="box-title">
                        {{ trans('labels.school.edit_school') }}
                    </h3>
                </div>
                <!-- /.box-header -->
                <!-- form start -->
                {!! Form::open(['route' => 'backend.schoolcolleges.update', 'role' => 'form','method' => 'POST','files'=>true, 'class'=>'form-horizontal']) !!}
                <div class="box-body">
                    <!-- Left nav start -->
                   <div class="col-sm-3">
                       <div class="list-group nav nav-tabs" id="navTab">
                        <a class="list-group-item active" idata-toggle="tab" href="#primary-section">Primary Information</a>
                        <a class="list-group-item" data-toggle="tab" href="#category-association">Association</a>
                        <a class="list-group-item" data-toggle="tab" href="#image-gallery">Gallery</a>
                        </div>
                   </div>
                    <!-- Left nav end -->
                    <!-- panel start -->
                    <div class="col-sm-9 panel panel-default" style="padding-left:0px;padding-right:0px;">
                     <!-- panel heading start -->
                    <div class="panel-heading" style="background:transparent;">
                        <h3 class="panel-title" id="pageTitle">Primary Information</h3>
                    </div>
                     <!-- panel heading end -->
                     <!-- panel body start -->
                <div class="panel-body">
                    <div id="primary-section">
                        <div class="form-group">
                            {!! Form::label('schoolname', trans('labels.school.name'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                            {!! Form::input('text','name', @$schoolcollegesdetail->title, ['class' => 'form-control','id' => 'schoolname','name'=>'schoolname','placeholder'=>'School or college Name',]) !!}
                            </div>
                        </div>
                        <div class="form-group">
                            {!! Form::label('schoolemail', trans('labels.school.email'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                            {!! Form::input('text','name', @$schoolcollegesdetail->email, ['class' => 'form-control','id' => 'schoolemail','name'=>'schoolemail','placeholder'=>'Email',]) !!}
                            </div>
                        </div>

                        <div class="form-group">
                            {!! Form::label('schoolphone', trans('labels.school.phone'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                            {!! Form::input('text','name', @$schoolcollegesdetail->contact, ['class' => 'form-control','id' => 'schoolphone','name'=>'schoolphone','placeholder'=>'Phone Number',]) !!}
                            </div>
                        </div>
                        
                        <div class="form-group">
                            {!! Form::label('schoolsuburb', trans('labels.school.suburb'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                           <select class="form-control select2" id ='schoolsuburb' name='schoolsuburb'>
                           @if($schoolcollegesdetail->locations && count($schoolcollegesdetail->locations) > 0)
<option value="{{ $schoolcollegesdetail->locations[0]['id']}}">{{ $schoolcollegesdetail->locations[0]['name']}}</option>
                           @endif
                        </select>
                            </div>
                        </div>

                       <div class="form-group">
                            {!! Form::label('schooltown', trans('labels.school.town'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                            {!! Form::input('text','name', @$schoolcollegesdetail->town, ['class' => 'form-control','id' => 'schooltown','name'=>'schooltown','placeholder'=>'Town',]) !!}
                            </div>
                        </div>
                        <div class="form-group">
                            {!! Form::label('schooladdress', trans('labels.school.address'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                            {!! Form::textarea('notes', @$schoolcollegesdetail->address, ['class' => 'form-control','id' => 'schooladdress','name'=>'schooladdress','size' => '30x4','placeholder'=>'Address',]) !!}
                            </div>
                        </div>

                        <div class="form-group">
                            {!! Form::label('schoolwebsite', trans('labels.school.website'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                            {!! Form::input('text','name', @$schoolcollegesdetail->website, ['class' => 'form-control','id' => 'schoolwebsite','name'=>'schoolwebsite','placeholder'=>'Website',]) !!}
                            </div>
                        </div>

                        <div class="form-group">
                            {!! Form::label('schooltype', trans('labels.school.type'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                            <select class="form-control" name="schooltype" id="schooltype">
                                <option value="">Type</option>
                                <option value="school"  selected >School</option>
                                <option value="college" @if($schoolcollegesdetail->type=='college')  selected @endif>College</option>
                            </select>
                            </div>
                        </div>
                       

                    </div>
                    <div id="category-association" style="display:none">
                        <div class="control-group"><label class="control-label" for="Wesbite">Categories<a href="#" data-toggle="tooltip" data-original-title="Created Ctegories, Select a category where do you want to show this School or college."><i class="fa fa-exclamation-circle fa-1 fa-fw"></i></a></label>
                            <div class="controls">
                            <?php $checked=""; ?>
                                <div class="web-address-list multiselect nohover">
                                    <ul>
                                        @foreach ($schoolcollegescategories as $category)
                                            <?php $checked = ""; ?>
                                            @foreach ($schoolcollegesdetail->categories as $selected)
                                                @if($selected->id==$category->id)  <?php $checked = "checked"; ?>  @endif
                                            @endforeach
                                        <li class="list_0"><label class="checkbox"> 
                                        <input type="checkbox" {!! $checked !!} name="categories[]" value="{!! $category->id !!}"  ><i class="fa fa-globe fb-fw"></i> {!! $category->name !!} </label>    
                                        </li>
                                             @endforeach
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="image-gallery" style="display:none">
                        <div class="form-group">
                            {!! Form::label('schoolimage', trans('labels.school.image'), ['class' => 'col-sm-2 control-label']) !!}
                            <div class="col-sm-9">
                            {!! Form::input('file','name', '', ['class' => 'form-control','id' => 'schoolimage','name'=>'schoolimage',]) !!}
                            </div>
                         </div>
                         @if(count($schoolcollegesdetail->assets )) 
                             <div class="row">
                                 @foreach ($schoolcollegesdetail->assets as $images)
                                    <div class="col-md-4">
                                        <a href="#" class="thumbnail">
                                           <img src="{!! url() !!}/{!! $images['path'] !!}{!! $images['name'] !!}" alt="School College Image" class="img-responsive" alt="Cinque Terre" height="150" width="150">
                                        </a>
                                    </div>
                                 @endforeach
                             </div>
                            @endif
                    </div>
                </div>
                     <!-- panel body end -->
            </div>          
             <!-- panel end -->
</div>
                <!-- /.box-body -->
                <div class="box-footer">
                    {!! Form::submit(trans('labels.school.submit'), ['class' => 'btn bg-green pull-right']) !!}
                    {!! Form::input('hidden','name', $schoolcollegesdetail->id ,  ['id' => 'updatedid','name'=>'id']) !!}
                </div>
                {!! Form::close() !!}
        </div>
        <!-- /.box -->
    </div>
</div>
{!! HTML::script('js/backend/schoolcolleges/schoolcollege.js') !!} @yield('before-scripts-end')
<div class="clearfix"></div>
@stop
