@extends ('backend.layouts.master')

@section ('title', trans('menus.user_management') . ' | ' . trans('menus.create_user'))

@section('page-header')
<h1>
    Plans Management
    <small>Create Plan</small>
</h1>
@endsection

@section ('breadcrumbs')
<li><a href="{!!url('dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li><a href="{{url('admin/subscription/packages/all')}}">{{trans('plans.package_manager') }}</a></li>
<li class="active"><a href="{{url('admin/subscription/packages/create')}}">{{trans('plans.create_plan')}}</a></li>
@stop

@section('content')


@if(Session::has('error'))
<div class="alert alert-error" style="text-align: center;">{{Session::get('error')}}</div>
@endif
<div class="box">

    <!-- /.box-header -->
    <div class="box-body">
        {!! Form::open(['url' => 'admin/subscription/packages/create', 'class' => 'form-horizontal', 'role' => 'form', 'method' => 'post']) !!}
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    {!! Form::label('txttitle', trans('plans.plan_fields.title'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::text('txttitle', null, ['class' => 'form-control', 'placeholder' => trans('plans.plan_fields.title')]) !!}
                    </div>
                </div><!--form control-->
                <div class="form-group">
                    {!! Form::label('txtprice', trans('plans.plan_fields.price'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::text('txtprice', null, ['class' => 'form-control', 'placeholder' => trans('plans.plan_fields.price')]) !!}
                    </div>
                </div><!--form control-->

                <div class="form-group">
                    {!! Form::label('ddlcurrency', trans('plans.plan_fields.currency'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        <select id="ddlcurrency" name="ddlcurrency" class="form-control">
                            <option value="0" selected="selected" disabled="disabled">Currency</option>
                            <option value="usd">USD</option>
                            <option value="aud">AUD</option>
                        </select>
                    </div>
                </div><!--form control-->
                <div class="form-group">
                    {!! Form::label('ddlinterval', trans('plans.plan_fields.interval'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        <select id="ddlinterval" name="ddlinterval" class="form-control" >
                            <option value="0" selected="selected" disabled="disabled">Interval</option>
                            <option value="day">DAY</option>
                            <option value="week">WEEK</option>
                            <option value="month">MONTH</option>
                            <option value="year">YEAR</option>
                        </select>
                    </div>
                </div><!--form control-->
                <div class="form-group">
                    {!! Form::label('txtdiscount', 'Discount', ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::text('txtdiscount', null, ['class' => 'form-control', 'placeholder' => "Discount"]) !!}
                    </div>
                </div><!--form control-->

            </div>
            <div class="col-md-4">                

            </div>
        </div>


        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label class="col-sm-2 control-label" for="taDescription">Description</label>
                    <div class="col-sm-10">
                        <textarea id="taDescription" name="taDescription" class="ckeditor form-control"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="well text-right">
            <a href="{{url('admin/access/users')}}" class="btn btn-danger btn-md mr-2">{{ trans('strings.cancel_button') }}</a>
            <input type="submit" class="btn btn-primary btn-md" value="{{ trans('strings.save_button') }}" />
        </div><!--well-->

        {!! Form::close() !!}
    </div>
</div>
@stop

@section('footer-scripts')
<script src="//cdn.ckeditor.com/4.5.6/standard/ckeditor.js"></script>
@endsection