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
@stop @section('content') 
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-body table-responsive no-padding ">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date Created</th>
                            <th>{{ trans('crud.actions') }}</th>
                        </tr>
                        @foreach ($schoolcolleges as $schoolcollege)
                <tr>
                    <td>{!! $schoolcollege->id !!}</td>
                    <td>{!! $schoolcollege->title !!}</td>
                    <td>{!! $schoolcollege->email !!}</td>
                    <td>{!! $schoolcollege->contact !!}</td>
                    <td>{!! $schoolcollege->created_at->diffForHumans() !!}</td>
                    <td>{!! $schoolcollege->action_buttons !!}</td>
                </tr>

            @endforeach
                    </tbody>
                </table>
                <div class="pull-left">
                    {!! $schoolcolleges->total() !!} Total Records
                </div>
                <div class="pull-right">
                    {!! $schoolcolleges->render() !!}
                </div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</div>
<div class="clearfix"></div>
@stop
