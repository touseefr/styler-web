@extends ('backend.layouts.master') @section ('title', 'FAQ') @section('page-header')
<h1>
   FAQ
</h1>
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a class="toolbar_btn" title="Faqs" href="{{url('admin/pages/faq')}}">
                <i class="fa  fa-tags tool-icon"></i>
                <div>FAQs</div>
            </a>
        </li>
        <li>
            <a href="{{url('admin/pages/faq/create')}}" class="toolbar_btn" title="Create New Faq">
                <i class="fa fa-plus tool-icon"></i>
                <div>Create New Faq</div>
            </a>
        </li>
       
    </ul>
</div>
@endsection @section ('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">{{ trans('menus.dashboard') }}</a>
</li>
<li class="active">FAQ</li>
@stop @section('content') 
@if(Session::has('message'))
   <div class="alert alert-{{Session::get('type')}}" style="text-align: center;">					   {{Session::get('message')}}</div>
@endif
<div class="row">
    <div class="col-xs-12">
        <div class="box box-primary">
            <div class="box-body table-responsive no-padding ">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Date Created</th>
                            <th>Actions</th>
                        </tr>
						@foreach($faqs as $faq)
							<tr>
								<td>{{$faq->id}}</td>
								<td>{{App\Faq::get_catname_by_id($faq->category_id)}}</td>
								<td>{{$faq->question}}</td>
								<td><?php echo html_entity_decode($faq->answer);?></td>
								<td>{{date('d/m/Y', strtotime($faq->created_at))}}</td>
								<td>
									<a class="btn btn-xs btn-primary" href="faq/edit/<?php echo $faq->id;?>"><i class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"></i></a>
								
									<a onclick="return confirm('Are you sure you want to delete this faq?')" href="faq/delete/<?php echo $faq->id;?>" class="btn btn-xs btn-danger" href=""><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"></i></a> 
								</td>
							</tr>
						@endforeach
                       
                    </tbody>
                </table>
                
               
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</div>
<div class="clearfix"></div>
@stop
