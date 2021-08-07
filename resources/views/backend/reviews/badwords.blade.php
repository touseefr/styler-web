@extends ('backend.layouts.master')

@section ('title', 'Review Management')

@section('page-header')
<h1>
    Bad Words Management
</h1>
@endsection

@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active"><a href="{{url('admin/bad/words')}}">Bad words Mangement</a></li>
@stop

@section('content')
@if(Session::has('message'))
<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
@endif
<div class="row">

    <div class="col-xs-12">

        <div class='row'>
            <div class="col-xs-12 text-right">
                <a id="add-new-badword" class='btn btn-primary btn-md' data-toggle="collapse"  href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Add New Word</a>
            </div>
        </div>        
        <br />
        <style>
            /* The container */
            .container {
                display: block;
                position: relative;
                padding-left: 35px;
                margin-bottom: 12px;
                cursor: pointer;
                font-size: 22px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            /* Hide the browser's default checkbox */
            .container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
            }

            /* Create a custom checkbox */
            .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 25px;
                width: 25px;
                background-color: #eee;
            }

            /* On mouse-over, add a grey background color */
            .container:hover input ~ .checkmark {
                background-color: #ccc;
            }

            /* When the checkbox is checked, add a blue background */
            .container input:checked ~ .checkmark {
                background-color: #2196F3;
            }

            /* Create the checkmark/indicator (hidden when not checked) */
            .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }

            /* Show the checkmark when checked */
            .container input:checked ~ .checkmark:after {
                display: block;
            }

            /* Style the checkmark/indicator */
            .container .checkmark:after {
                left: 9px;
                top: 5px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 3px 3px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }
        </style>
        <div class='row collapse'  id="collapseExample">
            <div class="col-md-12 admin-user-search-panel" style="margin-bottom: 30px;">
                <form class="form-inline formFlex" id='frm-bad-word'  name="frm-bad-word" method="POST" >
                    <input type='hidden' id='wordId' name='wordId' value=""/>
                    <div class="form-group mr-15"> 
                        <label for="badWord">Bad Word</label>
                        <input type="text" class="form-control" name="badWord" id="badWord" aria-describedby="emailHelp" placeholder="Bad Word">              
                    </div>
                    <div class="form-group mr-15">                                 
                      <input type="checkbox" value="1" name="isActive" id="isActive" class="mr-2" checked />  
                      <label id='isActive'>Active</label>
                    </div>
                    <button type="button" class="btn btn-primary" id='add-bad-word'>Submit</button>
                </form>
            </div>  
        </div>

    </div>
</div>
<div class="row">
    <div class="col-xs-12">
        <div class="box">
            <!-- /.box-header -->
            <div class="box-body">
                <table id="example1" class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th style="display: none;">ID</th>
                            <th>Word</th>                                                        
                            <th>status</th>                                                        
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $status = array("Deactive", "Active");
                        foreach ($badwords as $word) {
                            ?>
                            <tr>
                                <td  style="display: none;">{{$word->id}}</td>
                                <td>{{$word->bad_word}}</td>
                                <td>{{$status[$word->is_active]}}</td>
                                <td>
                                    <a class="edit_review btn bg-orange btn-xs" data-bad-record='<?php echo json_encode($word);?>'  id='edit-bad-word'><i class="fa fa-pencil" aria-hidden="true"></i></a>
                                    <a onclick="return confirm('Are you sure you want to delete this review?')" href="words/delete/<?php echo $word->id;?>" class="btn bg-red btn-xs"><i class="fa fa-trash-o" aria-hidden="true"></i></a>
                                </td>                            
                            </tr>
                        <?php } ?>                        
                    </tbody>
                </table>                
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
    <!-- /.col -->
</div>



@stop