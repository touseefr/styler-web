@extends ('backend.layouts.master')

@section ('title', trans('menus.user_management') . ' | ' . trans('menus.create_user'))

@section('page-header')
<h1>
    Plan Type Management
    <small>Create Plan Type</small>
</h1>
@endsection

@section ('breadcrumbs')
<li><a href="{!!url('dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li><a href="{{url('admin/subscription/plans/type')}}">Plan Types</a></li>
<li class="active"><a href="">Plan Type</a></li>
@stop

@section('content')

<style type="text/css">
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .m-b-20{margin-bottom:20px !important;}
    .m-l-32{margin-left: 32px !important;}
    .hidden {
        visibility: hidden
    }

</style>

@if(Session::has('error'))
<div class="alert alert-error" style="text-align: center;">{{Session::get('error')}}</div>
@endif
<div class="box">

    <!-- /.box-header -->
    <div class="box-body">
        {!! Form::open(['url' => 'admin/subscription/plan/type/create', 'class' => 'form-horizontal planForm', 'role' => 'form', 'method' => 'post']) !!}
        <div class="row">
            <div class="col-md-10">
                <div class="form-group">
                    {!! Form::label('txttitle', trans('plans.plan_fields.title'), ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        {!! Form::text('txttitle', null, ['class' => 'form-control', 'placeholder' => trans('plans.plan_fields.title')]) !!}
                    </div>
                </div><!--form control-->

                <div class="form-group">
                    {!! Form::label('ddlRole','Role', ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        <select id="ddlRole" name="ddlRole" class="form-control" >
                            <?php foreach ($roles as $role) { ?>
                                <option value="<?php echo $role['id'] ?>"><?php echo $role['name'] ?></option>
                            <?php } ?>
                        </select>
                    </div>
                </div><!--form control-->
                <div class="form-group">
                    {!! Form::label('cbFreePack','Free Package', ['class' => 'col-lg-2 control-label']) !!}
                    <div class="col-lg-10">
                        <input type="checkbox" id="cbFreePack" name="cbFreePack" class="form-check-input" value="isFree"  />
                    </div>
                </div>
                <div id="divPriceDiscount">
                    <div class="form-group">
                        {!! Form::label('includebooking','Include Booking', ['class' => 'col-lg-2 control-label']) !!}
                        <div class="col-lg-10">
                            <input type="checkbox" id="includebooking" name="includebooking" class="form-check-input" value="1"  />
                        </div>
                    </div>
                    <div class="form-group">
                        {!! Form::label('bestValue','Best Value', ['class' => 'col-lg-2 control-label']) !!}
                        <div class="col-lg-10">
                            <input type="checkbox" id="bestValue" name="bestValue" class="form-check-input" value="1"  />
                        </div>
                    </div>
                    <div class="form-group">
                        {!! Form::label('','Price', ['class' => 'col-lg-2 control-label']) !!}
                        <div class="col-lg-10">
                            <div class="row">
                                <div class="col-lg-4">
                                    Weekly
                                    <input type="number" name="Plan[week][Price]" class="form-control" id="txtPriceWeekly" value="" Placeholder="Weekly Price" />
                                </div>
                                <div class="col-lg-4">
                                    Monthly
                                    <input type="number" name="Plan[month][Price]" id="txtPriceMonthly" class="form-control" value="" Placeholder="Monthly Price" />
                                </div>
                                <div class="col-lg-4">
                                    Annualy
                                    <input type="number" name="Plan[year][Price]" id="txtPriceAnnually" value="" class="form-control" Placeholder="Annualy Price" />
                                </div>
                            </div>
                        </div>
                    </div><!--form control-->
                    <div class="form-group">
                        {!! Form::label('txtAnnuallyDiscount','Discount %', ['class' => 'col-lg-2 control-label']) !!}
                        <div class="col-lg-10">
                            <div class="row">
                                <div class="col-lg-4">
                                    Annualy
                                    <input type="number" name="Plan[year][Discount]" class="form-control" id="txtAnnuallyDiscount" value="" Placeholder="Annuly Discount" />
                                </div>
                                <div class="col-lg-4" >
                                    <div id="divAnnualNetPrice" style="display: none">
                                        Net Price
                                        <input type="number" name="Plan[year][netPrice]" class="form-control" id="txtAnnualyNetPrice" readonly="" value="" Placeholder="Net Price" />
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        {!! Form::label('txtbgcolor', 'Background Color', ['class' => 'col-lg-2 control-label']) !!}
                        <div class="col-lg-10">
                            <input type='color' id="txtbgcolour" name='txtbgcolour'/>
                        </div>
                    </div><!--form control-->
                </div>

            </div>
            <div class="col-md-4">
            </div>
        </div>
        {!! Form::close() !!}
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <label class="col-sm-2 control-label" for="taDescription">Description</label>
                    <div class="col-sm-10">
                        <button id="btnaddTextField" type="button" >Add Text Field </button>
                        <button id="btnaddCheckboxField"  type="button">Add checkbox Field </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-10">
                <div class="form-group">
                    <label class="col-sm-2 control-label" for="taDescription"></label>
                    <div class="col-sm-10">
                        <div class="row" id="descriptionRow"  >
                            <?php
                            foreach ($items as $key => $value) {
                                $json_data = json_encode($value);
                                ?>
                                <div class="col-md-6 m-b-20 dragdrop"    id="addRowDesc-<?php echo $key; ?>" >
                                    <?php if ($value['type'] == 'cb') { ?>
                                        <label style="float: left;"><?php echo $value['text']; ?></label>
                                        <a class="btn-delete btn btn-xs btn-danger delete-descr-row float-right" style="margin-left: 15px;"><i class="fa fa-trash" ></i></a>
                                        <input type="checkbox" name="cbCheck[]" data-info='<?php echo $json_data; ?>' style="float: right;" value="<?php echo $value['inputValue']; ?>" <?php echo ($value['inputValue'] == 1) ? 'checked="checked"' : ''; ?> class="inputCbChange descData"/>
                                    <?php } else { ?>
                                        <label><?php echo $value['text']; ?></label>
                                        <a class="btn-delete btn btn-xs btn-danger delete-descr-row float-right" style="margin-left: 15px;"><i class="fa fa-trash" ></i></a>
                                        <input type="text" name="cbCheck[]" data-info='<?php echo $json_data; ?>' style="width: 82px;float: right;" value="<?php echo $value['inputValue']; ?>" class="inputTxtChange form-control descData" />
                                    <?php } ?>
                                </div>
                            <?php }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="well text-right">
            <a href="{{url('admin/access/users')}}" class="btn btn-danger btn-md mr-2">{{ trans('strings.cancel_button') }}</a>
            <input type="button" class="btn btn-primary btn-md savePlan" value="{{ trans('strings.save_button') }}" />
        </div><!--well-->


    </div>
</div>
@stop

@section('footer-scripts')
<script type="text/javascript">


var CountDesc = 17;
$(document).ready(function () {
    $(document).on("blur", "#txtPriceAnnually", function () {
        var discount = $("#txtAnnuallyDiscount").val();
        var OriginalPrice = $(this).val();
        displayingNetPrice(discount, OriginalPrice);
    });
    $(document).on("blur", "#txtAnnuallyDiscount", function () {
        var discount = $(this).val();
        var OriginalPrice = $("#txtPriceAnnually").val();
        displayingNetPrice(discount, OriginalPrice);
    });
    $(document).on("change", "#cbFreePack", function () {
        if (this.checked) {
            $("#divPriceDiscount").hide();
        } else {
            $("#divPriceDiscount").show();
        }

    });
    $(document).on("change", ".inputCbChange", function () {
        UpdateDataInfo($(this));
    });
    $(document).on("blur", ".inputTxtChange", function () {
        UpdateDataInfo($(this));
    });
    $(document).on("click", "#btnaddTextField", function () {
        var html = '<div class="col-md-6 m-b-20" id="addRowDesc-' + CountDesc + '">';
        html += '<input type="text" id="txtAddLabel" class="form-control col-md-6 float-left txtAddLabel"  name="txtAddLabel" value="" />';
        html += '<input type="text" id="txtAddValue" class="form-control col-md-3 float-left m-l-32 txtAddValue" name="txtAddValue" value="" />';
        html += '<a data-row-id="addRowDesc-' + CountDesc + '" class="SaveChanges btn btn-xs btn-success float-right col-md-1" data-type="txt" style="margin-top: 5px;"><i class="fa fa-play"  data-placement="center"></i></a>';
        html += '</div>';
        $("#descriptionRow").append(html);
        CountDesc++;
    });
    $(document).on("click", "#btnaddCheckboxField", function () {
        var html = '<div class="col-md-6 m-b-20" id="addRowDesc-' + CountDesc + '">';
        html += '<input type="text" id="txtAddCbLabel" class="form-control col-md-6 float-left txtAddLabel"  name="txtAddLabel" value="" />';
        html += '<input type="checkbox" id="txtAddCbValue" class="float-left m-l-32 txtAddCbValue" name="txtAddCbValue" value="" />';
        html += '<a data-row-id="addRowDesc-' + CountDesc + '" class="SaveChanges btn btn-xs btn-success float-right col-md-1" data-type="cb" style="margin-top: 5px;"><i class="fa fa-play"  data-placement="center"></i></a>';
        html += '</div>';
        $("#descriptionRow").append(html);
        CountDesc++;
    });
    $(document).on("click", ".SaveChanges", function () {
        var saveType = $(this).attr('data-type');
        var labelValue = $(this).parent().find(".txtAddLabel").val();
        var dataInfo = {text: "", type: "", inputValue: ""};
        var dataRowId = $(this).attr('data-row-id');
        var html = '';
        var ValueVal = '';
        var isChecked = '';
        if (saveType == "txt") {
            ValueVal = $(this).parent().find(".txtAddValue").val();
        } else {
            if ($(this).parent().find(".txtAddCbValue").is(":checked")) {
                ValueVal = "1";
                isChecked = 'checked="checked"';
            } else {
                ValueVal = "0";
                isChecked = '';
            }
        }
        dataInfo['text'] = labelValue;
        dataInfo['type'] = saveType;
        dataInfo['inputValue'] = ValueVal;
        html += '<label class="float-left">' + labelValue + '</label>';
        html += '<a class="btn-delete btn btn-xs btn-danger delete-descr-row float-right" style="margin-left: 15px;"><i class="fa fa-trash" ></i></a>';
        if (saveType == "txt") {
            html += '<input type="text" name="cbCheck[]" data-info=' + JSON.stringify(dataInfo) + ' style="width: 82px;" value="' + ValueVal + '" class="inputTxtChange form-control float-right descData" />';
        } else {
            html += '<input type="checkbox" name="cbCheck[]" data-info=' + JSON.stringify(dataInfo) + ' value="1" class="inputCbChange float-right descData" ' + isChecked + ' />';
        }
        $("#" + dataRowId).empty();
        $("#" + dataRowId).html(html);
    });
    $(document).on("click", ".delete-descr-row", function () {
        $(this).parent().remove();
    });
    $(document).on("click", ".savePlan", function () {
        var descData = [];
        $(".descData").each(function (value) {
            descData.push($(this).attr('data-info'));
        });
        var formData = $('.planForm').serializeArray();
        formData.push({name: "descData", value: JSON.stringify(descData, null, 2)});
        $.ajax({
            url: '/admin/subscription/plan/type/create',
            type: 'POST',
            data: $.param(formData),
            success: function (response) {
                var res = JSON.parse(response);
                if (res.status == "200") {
                    toastr.success("Plan created successfully.");
                    window.location.href = '/admin/subscription/plans/type';
                } else {
                    toastr.error("Something went wrong. Please try again later.")
                }
            }
        });
    });
    function UpdateDataInfo($objInput) {
        var dataValue = $objInput.attr('data-info');
        if (dataValue) {
            dataValue = JSON.parse(dataValue);
            if (dataValue['type'] == 'cb') {
                if ($objInput.is(':checked')) {
                    dataValue['inputValue'] = "1";
                } else {
                    dataValue['inputValue'] = "0";
                }
            } else {
                dataValue['inputValue'] = $objInput.val();
            }
            $objInput.attr('data-info', JSON.stringify(dataValue));
        }
    }
    function displayingNetPrice(discount, OriginalPrice) {
        if (OriginalPrice > 0) {
            if (discount > 0) {
                $("#divAnnualNetPrice").show();
                var discountedPrice = (discount / 100) * OriginalPrice;
                var netPrice = OriginalPrice - discountedPrice;
                $("#txtAnnualyNetPrice").val(netPrice);
            } else {
                $("#divAnnualNetPrice").hide();
            }
        } else {
            $("#divAnnualNetPrice").hide();
            $("#txtAnnualyNetPrice").val(0);
        }
    }
    $( "#descriptionRow" ).sortable({
      revert: true
    });
});

</script>


@endsection
