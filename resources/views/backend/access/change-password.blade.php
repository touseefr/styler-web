@extends ('backend.layouts.master')

@section ('title', 'User Management | Change User Password')

@section ('before-styles-end')
    {!! HTML::style('css/plugin/jquery.onoff.css') !!}
@stop

@section('page-header')
    <h1>
        User Management
        <small>Change Password</small>
    </h1>
@endsection

@section ('breadcrumbs')
    <li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> Dashboard</a></li>
    <li><a href="{{url('admin/access/users')}}">User Management</a></li>
    <li><a href="{{url('admin/access/users/'.$user->id.'/edit')}}">Edit {{$user->name}}</a></li>
    <li><a href="{{url('admin/access/user/'.$user->id.'/password/change')}}">Change Password</a></li>
@stop

@section('content')
    @include('backend.access.includes.partials.header-buttons')

    {!! Form::open(['route' => ['admin.access.user.change-password', $user->id], 'class' => 'form-horizontal', 'role' => 'form', 'method' => 'post']) !!}

        <div class="col-12 col-md-6">
          <div class="form-group d-flex">
            <label class="control-label mr-3 col-12 col-sm-4">Password</label>
            <div class="col-12 col-sm-8">
              {!! Form::password('password', ['class' => 'form-control']) !!}
            </div>
          </div><!--form control-->
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group d-flex">
            <label class="control-label mr-3 col-12 col-sm-4">Confirm Password</label>
             <div class="col-12 col-sm-8">
               {!! Form::password('password_confirmation', ['class' => 'form-control']) !!}
             </div>
          </div><!--form control-->
        </div>
        <div class="text-right">
          <a href="{{url('admin/access/users')}}" class="btn btn-danger btn-md mb-2">Cancel</a>
          <input type="submit" class="btn btn-primary btn-md mb-2" value="Save" />
        </div><!--well-->

    {!! Form::close() !!}
@stop
