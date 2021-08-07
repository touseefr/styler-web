@extends ('backend.layouts.master')

@section ('title', 'Review Management')

@section('page-header')
<h1>
    Bad Review Management
</h1>
@endsection

@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active"><a href="{{url('admin/bad/reviews')}}">Bad Review Management</a></li>
@stop

@section('content')
@if(Session::has('message'))
<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
@endif

<div class="row">
    <div class="col-xs-12">
        <div class="box">

            <!-- /.box-header -->
            <div class="box-body">

                <table id="example1" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th  style="display: none;">ID</th>
                            <th>Reviewer</th>
                            <th>Reviewee</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($reviews as $review)
                        <?php
                        $Reviewer = App\User::find($review->from_user_id);
                        $Reviewee = App\User::find($review->to_user_id);
                        $excerpt = App\Review::getExcerpt($review->review_comment, 0, 80);
                        $excerpt2 = $review->review_comment;
                        ?>
                        <tr>
                            <td  style="display: none;">{{$review->id}}</td>
                            <td>{{$Reviewer->name}}</td>
                            <td>{{$Reviewee->name}}</td>
                            <td>
                                <div class="ratebox" data-id="1" data-rating="{{$Reviewee->rating}}"></div>
<!--                                <input id="input-21d" value="{{$Reviewee->rating}}" type="text" class="rating" data-min=0 data-max=5 data-step=0.5 data-size="sm"
                                       title="" readonly></td>-->
                            <td><a data-toggle="modal" data-target="#showreview-{{$review->id}}" style="color: #000;cursor: pointer;">{{$excerpt}}</a>


                                <div id="showreview-{{$review->id}}" class="modal" tabindex="-1" role="dialog">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header bg-teal">
                                                <h4 class="modal-title">Review</h4>  
                                                <button type="button" class="close" data-dismiss="modal" style="margin-top: 0;padding-top: 0px;">&times;</button>
                                            </div>
                                            <div class="modal-body">
                                                <p>{{$excerpt2}}</p>
                                            </div>
                                            <div class="modal-footer">
                                                <a class="btn btn-xs bg-green act" title="Approve Review"  href="{{url('/admin')}}/bad/reviews/approve/{{$review->id}}" style="margin-bottom: 0;"><i class="fa fa-undo" aria-hidden="true"></i></a>&nbsp;
                                                <a onclick="return confirm('Are you sure you want to delete this review?')" href="reviews/delete/{{$review->id}}" class="btn bg-red btn-xs"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </td>
                            <td>{{date('d/m/Y', strtotime($review->created_at))}}</td>
                            <td>
                                <a class="btn btn-xs bg-green act"  href="{{url('/admin')}}/bad/reviews/approve/{{$review->id}}" ><i class="fa fa-undo" aria-hidden="true"></i></a>&nbsp;
                                <a onclick="return confirm('Are you sure you want to delete this review?')" href="reviews/delete/{{$review->id}}" class="btn bg-red btn-xs"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
                                <!--                                @if($review->status == 0)
                                                                <a href="reviews/approve/{{$review->id}}" class="btn btn-xs bg-green act" title="Approve Review"><i class="fa fa-check"></i></a>
                                                                @else
                                                                <a href="reviews/suspend/{{$review->id}}" class="btn btn-xs bg-red act" title="Disapprove Review"><i class="fa fa-undo"></i></a>
                                                                @endif-->
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                <center>
                    <?php
                    //echo App\User::pagination($targetset, $total_records, $limit, $set);
                    ?>
                </center>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
    <!-- /.col -->
</div>



<div class="clearfix"></div>

<!-- Modal -->
<div id="edit_review" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <form name="edit_review" class="edit_review_form" action="" method="post">
            <input type="hidden" name="_token" value="{{ csrf_token() }}"/>
            <input type="hidden" name="review_id" value=""/>
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Edit Review</h4>
                </div>
                <div class="modal-body">

                    <textarea style="height:185px;" class="form-control" name="edit_review_comment"> </textarea>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </div>
        </form>
    </div>
</div>
@stop