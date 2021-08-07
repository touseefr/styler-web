    <div class="d-inlineB vTop text-right">
          <button type="button" class="btn btn-primary btn-md mb-2 dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              {{ trans('menus.header_buttons.users.button') }}
          </button>
          <ul class="dropdown-menu" role="menu">
          <li><a href="{{url('admin/access/users')}}">{{ trans('menus.header_buttons.users.all') }}</a></li>

            @permission('create-users')
                <li><a href="{{url('admin/access/users/create')}}">{{ trans('menus.create_user') }}</a></li>
            @endauth

            <li class="divider"></li>
            <li><a href="{{    url('admin/access/users/deactivated')}}">{{ trans('menus.deactivated_users') }}</a></li>
            <li><a href="{{url('admin/access/users/banned')}}">{{ trans('menus.banned_users') }}</a></li>
            <li><a href="{{url('admin/access/users/deleted')}}">{{ trans('menus.deleted_users') }}</a></li>
          </ul>


    </div>

    <div class="clearfix"></div>
