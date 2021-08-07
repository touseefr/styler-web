@extends ('backend.layouts.master')

@section ('title', trans('menus.user_management') . ' | ' . trans('menus.create_user'))

@section('page-header')
<h1>
    {{ trans('menus.user_management') }}
    <small>{{ trans('menus.create_user') }}</small>
</h1>
@endsection

@section ('breadcrumbs')
<li><a href="{!!url('dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li><a href="{{url('admin/access/users')}}">{{trans('menus.user_management') }}</a></li>
<li class="active"><a href="{{url('admin.access.users.create')}}">{{trans('menus.create_user')}}</a></li>
{{-- <li class="active">{!! link_to_route('admin.access.users.create', trans('menus.create_user')) !!}</li> --}}
@stop

@section('content')
@include('backend.access.includes.partials.header-buttons')


<div class="box">

    <!-- /.box-header -->
    <div class="box-body">
        {!! Form::open(['url' => 'admin/access/users/store', 'class' => 'form-horizontal', 'role' => 'form', 'method' => 'post']) !!}
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    {!! Form::label('name', trans('validation.attributes.name'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::text('name', null, ['class' => 'form-control', 'placeholder' => trans('strings.full_name')]) !!}
                    </div>
                </div><!--form control-->
                <div class="form-group">
                    {!! Form::label('password', trans('validation.attributes.password'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::password('password', ['class' => 'form-control']) !!}
                    </div>
                </div><!--form control-->

            </div>
            <div class="col-md-6">
                <div class="form-group">
                    {!! Form::label('email', trans('validation.attributes.email'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::text('email', null, ['class' => 'form-control', 'placeholder' => trans('validation.attributes.email')]) !!}
                    </div>
                </div><!--form control-->
                <div class="form-group">
                    {!! Form::label('password_confirmation', trans('validation.attributes.password_confirmation'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::password('password_confirmation', ['class' => 'form-control']) !!}
                    </div>
                </div><!--form control-->

            </div>
        </div>


        <div class="row">
            <div class="col-md-12">

                <div class="form-group" style="margin-left: 5px; display: inline-block; padding: 0 15px">
                        <input type="checkbox" value="1" name="status" checked="checked" style="margin-right: 5px;margin-top: 12px;display: inline-block;vertical-align: baseline;transform: scale(1.2);float: left;" />
                        <label class="control-label">{{ trans('validation.attributes.active') }}</label>
<!--                    <div class="col-lg-1">-->
<!--                    </div>-->
<!--                    <input type="checkbox" value="1" name="confirmed" checked="checked"  style="margin-right: 5px;margin-top: 12px;display: inline-block;
                           vertical-align: baseline;transform: scale(1.2);float: left;"/>
                    <label class="control-label">{{ trans('validation.attributes.confirmed') }}</label>-->
                </div>
                <div class="form-group" style="margin-left: 15px; display: inline-block; padding: 0 15px">

<!--                     <input type="checkbox" value="1" name="confirmed" checked="checked"  style="margin-right: 5px;margin-top: 12px;display: inline-block;vertical-align: baseline;transform: scale(1.2);float: left;"/>
                    <label class="control-label">{{ trans('validation.attributes.confirmed') }}</label>-->
                    <input type="checkbox" value="1" name="confirmed"  style="margin-right: 5px;margin-top: 12px;display: inline-block;
                           vertical-align: baseline;transform: scale(1.2);float: left;"/>
                    <label class="control-label">{{ trans('validation.attributes.confirmed') }}</label>
                </div>
<!--                <div class="form-group" style="margin-left: 15px; display: inline-block; padding: 0 15px">
                    <input type="checkbox" value="1" name="confirmation_email" style="margin-right: 5px;margin-top: 12px;display: inline-block;
                           vertical-align: baseline;transform: scale(1.2);float: left;" />
                    <label class="control-label">{{ trans('validation.attributes.send_confirmation_email') }}
                        <small>{{ trans('strings.if_confirmed_is_off') }}</small>
                    </label>

                </div>form control-->
            </div>
        </div>





        <div class="row">
            <div class="col-md-12">
                <label class="control-label">{{ trans('validation.attributes.associated_roles') }}</label>
            </div>
            <div clas="col-md-12">
                <div class="form-group">

                    <div class="col-md-12">
                        @if (count($roles) > 0)
                        <ul class="associated-roles">
                            @foreach($roles as $role)
                            <li class="col-md-4">
                                <input type="checkbox" value="{{$role->id}}" name="assignees_roles[]" id="role-{{$role->id}}" /> <label for="role-{{$role->id}}">{!! $role->name !!}</label>
                            </li>
                            @endforeach
                            @else
                            No Roles to set
                            @endif
                    </div>
                </div><!--form control-->
            </div>
            <!-- subscription package code start here-->
        </div>
        <div class="row">
            <div class="col-md-12">
                <label class="control-label">{{ trans('validation.attributes.subscription_package') }}</label>
            </div>
            <div class="col-md-12">
                <div class="form-group">
                    <div class="col-md-12">
                        <?php $packages = array("Trendy - Basic","Add on booking system","Glamours - Premium"); ?>
                        <ul class="associated-roles">
                            @for($i = 0; $i <3; $i++)
                            <li class="col-md-4"><input type="radio" value="{{$i}}" name="packeage" id="pack-{{$i}}" /> <label for="pack-{{$i}}">{!! $packages[$i] !!}</label></li>
                            @endfor
                        </ul>
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

@section('after-scripts-end')
{!! HTML::script('js/backend/access/permissions/script.js') !!}
{!! HTML::script('js/backend/access/users/script.js') !!}
@stop
