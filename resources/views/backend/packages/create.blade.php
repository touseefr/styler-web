@extends ('backend.layouts.master') @section ('title', 'Schools and Colleges') @section('page-header')
<h1>
    {{ trans('menus.packages.main') }}
</h1>

@stop @section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box box-default">
            <!-- /.box-header -->
            <div class="box-header with-border">
                <h3 class="box-title">
              <!--      {{ trans('labels.packages.chagres') }}
                </h3> -->
            </div>
            <!-- /.box-header -->
            <!-- form start -->
            {!! Form::open(['route' => 'backend.packages.update', 'role' => 'form','method' => 'POST','files'=>true, 'class'=>'form-horizontal']) !!}
            <div class="box-body">
                   <!-- panel start -->
                <div class="col-sm-12 panel panel-default" style="padding-left:0px;padding-right:0px;">
                    <!-- panel heading start -->
                <div class="panel-heading" style="background:transparent;">
                        <h3 class="panel-title">{{ trans('labels.packages.chagres') }}</h3>
            </div>
                    <!-- panel heading end -->
            <!-- panel body start -->
            <div class="panel-body"> 
                <div class="form-group">
                    {!! Form::label('school.schoolname', trans('labels.packages.chagres'), ['class' => 'col-sm-2 control-label']) !!}
                    <div class="col-sm-9">
                        {!! Form::input('text','name', @$packagedetail->price, ['class' => 'form-control','id' => 'schoolname','name'=>'packagecost','placeholder'=>'Monthly Charges',]) !!}
                         {!! Form::input('hidden','name', @$packagedetail->id, ['id' => 'packageId','name'=>'packageId',]) !!}
                    </div>
                </div>
                
            </div>
            <!-- panel body end -->
            </div>
            <!-- panel end -->
            </div>
            <!-- /.box-body -->
            <div class="box-footer">
                {!! Form::submit(trans('labels.packages.submit'), ['class' => 'btn bg-green pull-right']) !!}
            </div>
            {!! Form::close() !!}
        </div>
        <!-- /.box -->
    </div>
</div>
<div class="clearfix"></div>
@stop
