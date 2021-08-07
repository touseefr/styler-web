@extends ('backend.layouts.master') @section ('title', 'Pages') @section('page-header')
<h1>
   {{ trans('menus.staticpages.main') }}
</h1>
@include('backend.pages.includes.partials.header-buttons')
@endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{!! link_to_route('backend.pages.index', trans('menus.staticpages.main')) !!}</li>
@stop @section('content') 
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-body table-responsive no-padding ">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Url</th>
                            <th>Date Created</th>
                            <th>{{ trans('crud.actions') }}</th>
                        </tr>
                        @foreach ($pages as $page)
                <tr>
                    <td>{!! $page->id !!}</td>
                    <td>{!! $page->title !!}</td>
                    <td>/{!! $page->url !!}</td>
                    <td>{!! $page->created_at !!}</td>
					<td>{!! $page->action_buttons !!}</td>
                </tr>

            @endforeach
                    </tbody>
                </table>
                <div class="pull-left">
                    {!! $pages->total() !!} Total Records
                </div>
                <div class="pull-right">
                    {!! $pages->render() !!}
                </div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</div>
<div class="clearfix"></div>
@stop
