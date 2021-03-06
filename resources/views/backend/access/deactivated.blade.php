@extends ('backend.layouts.master')

@section ('title', trans('menus.user_management') . ' | ' . trans('menus.deactivated_users'))

@section('page-header')
    <h1>
        {{ trans('menus.user_management') }}
        <small>{{ trans('menus.deactivated_users') }}</small>
    </h1>
@endsection

@section ('breadcrumbs')
    <li><a href="{{url('dashboard')}}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
    <li><a href="{{url('admin/access/users')}}">{{trans('menus.user_management')}}</a></li>
    {{-- <li>{!! link_to_route('admin.access.users.index', trans('menus.user_management')) !!}</li> --}}
    <li class="active"><a href="{{url('admin/access/users/deactivated')}}">{{trans('menus.deactivated_users')}}</a></li>
    {{-- <li class="active">{!! link_to_route('admin.access.users.deactivated', trans('menus.deactivated_users')) !!}</li> --}}
@stop

@section('content')
    @include('backend.access.includes.partials.header-buttons')

    <table class="table table-striped table-bordered table-hover">
        <thead>
        <tr>
            <th>{{ trans('crud.users.id') }}</th>
            <th>{{ trans('crud.users.name') }}</th>
            <th>{{ trans('crud.users.email') }}</th>
            <th>{{ trans('crud.users.confirmed') }}</th>
            <th>{{ trans('crud.users.roles') }}</th>
            <th>{{ trans('crud.users.other_permissions') }}</th>
            <th class="visible-lg">{{ trans('crud.users.created') }}</th>
            <th class="visible-lg">{{ trans('crud.users.last_updated') }}</th>
            <th>{{ trans('crud.actions') }}</th>
        </tr>
        </thead>
        <tbody>
            @if ($users['business_user']->count())
                @foreach ($users['business_user'] as $user)
                    <tr>
                        <td>{!! $user->id !!}</td>
                        <td>{!! $user->name !!}</td>
                        <td>{!! link_to("mailto:".$user->email, $user->email) !!}</td>
                        <td>{!! $user->confirmed_label !!}</td>
                        <td>
                            @if ($user->roles()->count() > 0)
                                @foreach ($user->roles as $role)
                                    {!! $role->name !!}<br/>
                                @endforeach
                            @else
                                None
                            @endif
                        </td>
                        <td>
                            @if ($user->permissions()->count() > 0)
                                @foreach ($user->permissions as $perm)
                                    {!! $perm->display_name !!}<br/>
                                @endforeach
                            @else
                                None
                            @endif
                        </td>
                        <td class="visible-lg">{!! $user->created_at->diffForHumans() !!}</td>
                        <td class="visible-lg">{!! $user->updated_at->diffForHumans() !!}</td>
                        <td>{!! $user->action_buttons !!}</td>
                    </tr>
                @endforeach
            @else
                <td colspan="9">{{ trans('crud.users.no_deactivated_users') }}</td>
            @endif
        </tbody>
    </table>

    <div class="pull-left">
        {!! $users['business_user']->count() !!} {{ trans('crud.users.total') }}
    </div>



    <div class="clearfix"></div>
@stop
