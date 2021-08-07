@extends ('backend.layouts.master')

@section ('title', 'Plan Management')

@section('page-header')
<h1>
   Memberhsip Plans
</h1>
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a class="toolbar_btn" title="Faqs" href="{{url('admin/membership')}}">
                <i class="fa  fa-tags tool-icon"></i>
                <div>Plans</div>
            </a>
        </li>
        <li>
            <a href="{{url('admin/membership/add')}}" class="toolbar_btn" title="Create New Faq">
                <i class="fa fa-plus tool-icon"></i>
                <div>Add New Plan</div>
            </a>
        </li>
       
    </ul>
</div>
@endsection

@section ('breadcrumbs')
    <li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
    <li class="active">Plan Management</li>
@stop

@section('content')
@if(Session::has('message'))
   <div class="alert alert-{{Session::get('type')}}" style="text-align: center;">					   {{Session::get('message')}}</div>
@endif

<div class="row">
			<div class="col-xs-12">
				<div class="box">
					
					<!-- /.box-header -->
					<div class="box-body">
					
						<table id="example1" class="table table-bordered table-striped">
							<thead>
								<tr>
									<th>S.No.</th>
									<th>Plan</th>
									<th>Amount (USD)</th>
									<th>Duration</th>
									<th>Discount(%)</th>
									<th>Actions</th>
								</tr>
							</thead>
								<tbody>
								@foreach($plans as $plan)
									<tr>
										<td>{{$plan->id}}</td>
										<td>{{$plan->name}}</td>
										<td>{{$plan->price}}</td>
										<td>{{$plan->duration}}</td>
										<td>{{$plan->discount}}</td>
										<td>
											<a href="membership/edit/{{$plan->id}}" class="btn bg-orange btn-xs"><i class="fa fa-pencil" aria-hidden="true"></i></a>&nbsp;
											<a onclick="return confirm('Are you sure you want to delete this plan?')" href="membership/delete/{{$plan->id}}" class="btn bg-red btn-xs"><i class="fa fa-trash-o" aria-hidden="true"></i></a>

										</td>
									</tr>
								
								@endforeach
								
									
																	
																
						</tbody></table>
					</div>
					<!-- /.box-body -->
				</div>
				<!-- /.box -->
			</div>
			<!-- /.col -->
		</div>



    <div class="clearfix"></div>
@stop