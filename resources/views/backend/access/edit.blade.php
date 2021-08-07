@extends ('backend.layouts.master')

@section ('title', trans('menus.user_management') . ' | ' . trans('menus.edit_user'))

@section('page-header')
<h1>
    {{ trans('menus.user_management') }}
    <small>{{ trans('menus.edit_user') }}</small>
</h1>
@endsection

@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li><a href="{{url('admin/access/users')}}">{{trans('menus.user_management')}}</a></li>
{{-- <li>{!! link_to_route('admin.access.users.index', trans('menus.user_management')) !!}</li> --}}
<li class="active"><a href="">{{trans('menus.edit_user')}}</a></li>
{{-- <li class="active">{!! link_to_route('admin.access.users.edit', trans('menus.edit_user')) !!}</li> --}}
@stop

@section('content')
@include('backend.access.includes.partials.header-buttons')

<div class="box">

    <!-- /.box-header -->
    <div class="box-body">
        {!! Form::model($user, ['url' => 'admin/access/users/'. $user->id, 'class' => 'form-horizontal', 'role' => 'form', 'method' => 'PATCH']) !!}
        <input type="hidden" name="pre_package_id" value="{{!empty($user->UserActiveSubscription()->plan_id)?$user->UserActiveSubscription()->plan_id:"1"}}" />
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    {!! Form::label('name', trans('validation.attributes.name'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::text('name', null, ['class' => 'form-control', 'placeholder' => trans('strings.full_name')]) !!}
                    </div>
                </div><!--form control-->
                @if ($user->id != 1)
                <div class="form-group">
                    <label class="col-lg-2 control-label" style="padding:0;">{{ trans('validation.attributes.active') }}</label>
                    <div class="col-lg-1">
                        <input type="checkbox" value="1" name="status" {{$user->status == 1 ? 'checked' : ''}} />
                    </div>
                    <label class="col-lg-2 control-label" style="padding:0;">{{ trans('validation.attributes.confirmed') }}</label>
                    <div class="col-lg-1">
                        <input type="checkbox" value="1" name="confirmed" {{$user->confirmed == 1 ? 'checked' : ''}} />
                    </div>
                </div><!--form control-->
                <div class="form-group">

                </div>
                @endif

            </div>

            <div class="col-md-6">
                <div class="form-group">
                    {!! Form::label('email', trans('validation.attributes.email'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::text('email', null, ['class' => 'form-control', 'placeholder' => trans('validation.attributes.email')]) !!}
                    </div>
                </div><!--form control-->

                @if ($user->id != 1)
                <!--form control-->
                @endif
            </div>
        </div>




        @if ($user->id != 1)


        <div class="row">
            <div class="col-md-12">
                <label class="control-label">{{ trans('validation.attributes.associated_roles') }}</label>
                </div>
            <div class="col-md-12">
            <div class="form-group">
                <div class="col-md-12">
                    @if (count($roles) > 0)
                    <ul class="associated-roles">
                    @foreach($roles as $role)
                    <li class="col-md-4">

                    <input type="radio" value="{{$role->id}}" name="assignees_roles[]" {{in_array($role->id, $user_roles) ? 'checked' : ''}} id="role-{{$role->id}}" onclick="javascript:alert('Are you sure you want to change user role.')" /> <label for="role-{{$role->id}}">{!! $role->name !!}</label>
                    <!--<br />-->
<!--                    <a href="#" data-role="role_{{$role->id}}" class="show-permissions small">(<span class="show-hide">Show</span> Permissions)</a><br/>                    -->
<!--                    <div class="permission-list hidden" data-role="role_{{$role->id}}">
                        @if ($role->all)
                        All Permissions<br/><br/>
                        @else
                        @if (count($role->permissions) > 0)
                        <blockquote class="small">{{--
                                            --}}@foreach ($role->permissions as $perm){{--
                                            --}}{{$perm->display_name}}<br/>
                            @endforeach
                        </blockquote>
                        @else
                        No permissions<br/><br/>
                        @endif
                        @endif
                    </div>permission list-->
                    </li>
                    @endforeach
                    </ul>
                    @else
                    No Roles to set
                    @endif
                </div>
            </div><!--form control-->

            </div>
        </div>
        <!-- subscription package code start here-->
        <div class="row">
            <div class="col-md-12">
                <label class="control-label">{{ trans('validation.attributes.subscription_package') }}</label>
            </div>
            <div class="col-md-12">
        <div class="form-group">
            <div class="col-md-12">
                <ul class="associated-roles">
                <?php $packages = array(0 => "Trendy - Basic", 1 => "Add on booking system", 2 => "Glamours - Premium"); ?>
                @for($i = 0; $i <3; $i++)
                <li class="col-md-4">
                    <input type="radio" value="{{$i}}" name="packeage" id="pack-{{$i}}"  {{($user->UserActiveSubscription()->plan_id==$i)?'checked="checked"':''}} /> <label for="pack-{{$i}}">{!! $packages[$i] !!}</label>
                </li>
                @endfor
                </ul>
            </div>
        </div>
            </div>
        </div>
        @endif

        <div class="well text-right">
            <a href="{{url('admin/access/users')}}" class="btn btn-danger btn-md mr-2">{{ trans('strings.cancel_button') }}</a>
            <input type="submit" class="btn btn-primary btn-md" value="{{ trans('strings.save_button') }}" />
        </div><!--well-->

        @if ($user->id == 1)
        {!! Form::hidden('status', 1) !!}
        {!! Form::hidden('confirmed', 1) !!}
        {!! Form::hidden('assignees_roles[]', 1) !!}
        @endif

        {!! Form::close() !!}
    </div>
</div>
@stop

@section('after-scripts-end')
{!! HTML::script('js/backend/access/permissions/script.js') !!}
{!! HTML::script('js/backend/access/users/script.js') !!}
@stop
