@extends ('backend.layouts.master') 
@section ('title', trans('menus.user_management')) 
@section('page-header')
<h1>
    {{ trans('menus.user_data_management') }}
</h1>
@endsection

@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>

@stop

@section('footer-scripts')
<div class="spinner-div" style="display: none;">
    <div class="pwOverlay"></div>
    <div class="pwloader">
        <!--<button class="btn btn-primary" type="button" disabled>
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          <span class="sr-only">Please Wait...</span>
        </button>-->
        <span class="text-white">Please Wait...</span>
        <br />
        <img src="{{url('/images/spinner.gif')}}" width="120" />
        <!--<button class="btn btn-primary" type="button" disabled>
          <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Loading
        </button>-->
    </div>
</div>
{!! HTML::script('js/import-lib/xlsx.core.min.js') !!}
{!! HTML::script('js/import-lib/xls.core.min.js') !!}
{!! HTML::script('js/import-lib/jquery.csv.min.js') !!}
{!! HTML::script('js/importfile.js') !!}
@stop
@section('content')

<style>
    .importfile{padding-top:0px; padding-bottom:0px;}
    .pwOverlay {background: rgba(0,0,0,0.85);position: fixed;width: 100%; height: 100%; z-index: 1040; top: 0; left: 0;}
    .pwloader {position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1050;text-align: center;}
</style>
<div class="row">
    <input type="hidden" id="user_id" value="<?php echo $userid; ?>" />    
    <div class="col-md-3 import-file-r2-left" style="background-color:#fff;">        
        <ul class="page-selected" style="cursor: pointer;">
            <li><a page-title="basif_info">Basic Info</a></li>          
            <li><a page-title="product_maker">Product Maker</a></li>
            <li><a page-title="product">Products</a></li>
            <li><a page-title="service_categories">Service Categories</a></li>
            <li><a page-title="service">Services</a></li>
            <li><a page-title="customer">Customer</a></li>
            <li><a page-title="employee">Employee</a></li>
        </ul>
    </div>    
    <div class="col-md-9 import-file-blocks">
        <div class="col-md-12 align-right">   
            <div class="col-md-4">
                <?php if (count($bookingfiles) > 0) {
                    ?>
                    <select  class="browser-default custom-select select-file">
                        <option selected disabled='disabled'>Imported Files</option>
                        <?php
                        foreach ($bookingfiles as $file) {
                            $filename = explode('_', $file->name);
                            ?>
                            <option value="<?php echo $file->name; ?>"><?php echo $filename[1] ?></option>
                        <?php } ?>                       
                    </select>    
                <?php } ?>
            </div>
            <div class="col-md-8">
                <form id="frm_import_file" action="importfile" method="post" enctype="multipart/form-data">
                    <input type="file" id="file_data"  style="display:inline;" class='p-15' />                  
                </form>
            </div>
        </div>
        <div class="col-md-4">
            <div class="fields-block">
                <h4>Define Fields</h4>
                <ul id="show_define_value">            
                </ul>
                <div class="box_bottom_block"></div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="fields-block">
                <h4>File Fields</h4>
                <ul id="show_file_value">                
                </ul>            
                <div class="box_bottom_block"></div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="fields-block">
                <h4>Syn</h4>
                <ul id="show_linked_value">                
                </ul>                          
                <div class="box_bottom_block">
                    <button id="save_map_data" class="btn btn-primary ">Import Data</button>
                </div>               
            </div>
        </div>
    </div>
</div>

@stop