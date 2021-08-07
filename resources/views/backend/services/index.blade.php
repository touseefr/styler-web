@extends ('backend.layouts.master') @section ('title', 'Services') @section('page-header')
<h1>
   {{ trans('menus.services.main') }}
</h1>
@include('backend.services.includes.partials.header-buttons')
@endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{!! link_to_route('backend.services.index', trans('menus.services.main')) !!}</li>
@stop @section('content') 
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-body table-responsive no-padding ">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>name</th>
                            <th>Date</th>
                            <th>{{ trans('crud.actions') }}</th>
                        </tr>
                        @foreach ($services as $service)
                <tr>
                    <td>{!! $service->id !!}</td>
                    <td>{!! $service->name !!}</td>
                    <td>{!! $service->created_at->diffForHumans() !!}</td>
                    <td>{!! $service->action_buttons !!}</td>
                </tr>

            @endforeach
                    </tbody>
                </table>
                <div class="pull-left">
                    {!! $services->total() !!} Total Records
                </div>
                <div class="pull-right">
                    {!! $services->render() !!}
                </div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</div>
<div class="clearfix"></div>
@stop
