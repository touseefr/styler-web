@extends ('backend.layouts.master') @section ('title', 'Edit Faq') @section('page-header')
<h1>
   Edit Faq
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
            <a href="{{url('admin/pages/faq/edit')}}" class="toolbar_btn" title="Edit Faq">
                <i class="fa fa-plus tool-icon"></i>
                <div>Edit Faq</div>
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
        <div class="box box-default">
            <div class="box-body">
               <div class="col-md-12">
			   
			   <form method="POST" action="{{url('admin/pages/faq/edit')}}/{{$faq->id}}" accept-charset="UTF-8" class="form-horizontal" enctype="multipart/form-data">
			   
			   <input name="_token" value="{{csrf_token()}}" type="hidden">
			   
			   <div class="form-group">
					<label class="col-sm-2 control-label" for="title">Category</label>
					<div class="col-sm-10">
						<select class="form-control" name="faq_category" id="faq_category">
						<?php 
								$categories = DB::select("select * from categories where parent is NULL");
						?>
						@foreach($categories as $category)
						<?php 
								$selected = ($category->id == $faq->category_id) ? 'selected' : '';
						?>
							<option {{$selected}} value="{{$category->id}}">{{$category->name}}</option>
						@endforeach
						</select>
					</div>
				</div>
				
			   <div class="form-group">
					<label class="col-sm-2 control-label" for="title">Question</label>
					<div class="col-sm-10">
						<input type="text" value="{{$faq->question}}" class="form-control" name="question" id="question">
					</div>
				</div>
				
				 <div class="form-group">
					<label class="col-sm-2 control-label" for="content">Answer</label>
					<div class="col-sm-10">
						<textarea id="content" name="answer" class="ckeditor form-control">{{$faq->answer}}</textarea>
					</div>
				</div>
				
				<button id="btn_save_faq" type="submit" class="col-md-offset-2 btn btn-primary">Update faq</button>
                </form>
               </div>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</div>
<div class="clearfix"></div>
@stop
