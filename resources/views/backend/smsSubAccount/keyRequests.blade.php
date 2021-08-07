@extends('backend.layouts.master')
@section('page-header')
<h1>SMS Global Requests</h1>
@endsection

@section('content')
@section ('breadcrumbs')
<li><a href="{!!route('backend.dashboard')!!}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active">SMS Add Keys</li>
@stop
@if(Session::has('message'))
<p class="alert {{ Session::get('type') }}">{{ Session::get('message') }}</p>
@endif

<style>

</style>
<table class="table table-bordered table-hover table-striped">
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Request</th>
            <th>Package</th>
            <th>Package Price</th>
            <th>Package SMS</th>
            <th>Stripe Customer id</th>
            <th>Receipt</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        @if($krequests->count()>0)
        @foreach($krequests->toArray() as $index=>$packInfo)
        <tr id='row-id-{{$index}}'>
            <th>{{$packInfo['user_details']['name']}}</th>
            <th>{{$packInfo['user_details']['email']}}</th>
            <th>
                @if($packInfo["charge_transfer"] == 2)
                <span class="btn btn-xs btn-primary">Credential Required</span>
                @endif
                @if( $packInfo["charge_transfer"] == 2 || $packInfo["charge_transfer"] == 3)
                <span class="btn btn-xs btn-primary">Fund Transfer</span>
                @endif
            </th>
            <th>{{$packInfo['fetch_packages']['name']}}</th>
            <th>{{$packInfo['fetch_packages']['price']}}</th>
            <th>{{$packInfo['fetch_packages']['limit']}}</th>
            <th>{{$packInfo['stp_customer_id']}}</th>
            <th><a href="{{$packInfo['receipt_url']}}" target="_blank">Receipt</a></th>
            <th>
                @if($packInfo["charge_transfer"] == 2)
                <a href="{{url('admin/smsglobal/edit/subaccounts/'.$packInfo["fetch_sms_global_account"]['id'])}}" class="btn btn-xs btn-primary"><i class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title="Add Sub Account Keys"></i></a>
                @endif
                @if( $packInfo["charge_transfer"] == 3)
                <a id="confirm-dialog-id-{{$packInfo['id']}}" class="btn btn-xs btn-success btn-fund-transfer fund-transfer" data-user-id="{{$packInfo['user_details']['id']}}" data-row-id='row-id-{{$index}}' data-id='{{$packInfo['id']}}'>
                    <i class="fa fa-usd" aria-hidden="true"></i>
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </a>
                <!--<button type="button" class="btn btn-info btn-lg  btn-fund-transfer">Open Modal</button>-->
                @endif
            </th>
        </tr>
        @endforeach
        @else
        <tr>
            <td colspan="9" style="text-align: center;">SMS Global Request</td>
        </tr>
        @endif
    </tbody>
</table>
<style type="text/css">
    .dialog-ovelay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.50);
        z-index: 999999
    }

    .dialog-ovelay .dialog {
        width: 400px;
        margin: 100px auto 0;
        background-color: #fff;
        box-shadow: 0 0 20px rgba(0, 0, 0, .2);
        border-radius: 3px;
        overflow: hidden
    }

    .dialog-ovelay .dialog header {
        padding: 10px 8px;
        background-color: #f6f7f9;
        border-bottom: 1px solid #e5e5e5
    }

    .dialog-ovelay .dialog header h3 {
        font-size: 14px;
        margin: 0;
        color: #555;
        display: inline-block
    }

    .dialog-ovelay .dialog header .fa-close {
        float: right;
        color: #c4c5c7;
        cursor: pointer;
        transition: all .5s ease;
        padding: 0 2px;
        border-radius: 1px
    }

    .dialog-ovelay .dialog header .fa-close:hover {
        color: #b9b9b9
    }

    .dialog-ovelay .dialog header .fa-close:active {
        box-shadow: 0 0 5px #673AB7;
        color: #a2a2a2
    }

    .dialog-ovelay .dialog .dialog-msg {
        padding: 12px 10px
    }

    .dialog-ovelay .dialog .dialog-msg p {
        margin: 0;
        font-size: 15px;
        color: #333
    }

    .dialog-ovelay .dialog footer {
        border-top: 1px solid #e5e5e5;
        padding: 8px 10px
    }

    .dialog-ovelay .dialog footer .controls {
        direction: rtl
    }

    .dialog-ovelay .dialog footer .controls .button {
        padding: 5px 15px;
        border-radius: 3px
    }

    .button {
        cursor: pointer
    }

    .button-default {
        background-color: rgb(248, 248, 248);
        border: 1px solid rgba(204, 204, 204, 0.5);
        color: #5D5D5D;
    }

    .button-danger {
        background-color: #f44336;
        border: 1px solid #d32f2f;
        color: #f5f5f5
    }

    .link {
        padding: 5px 10px;
        cursor: pointer
    }

    .fund-transfer {
        background-color: #62ccbb;
        border-color: #62ccbb;
        /*background: url(/new_assets/images/money.png);*/
        background-size: 100%;
        /*padding: 11px;*/
    }

    .fund-transfer:hover {
        background-color: #62ccbb !important;
    }
</style>
@endsection

@section('footer-scripts')

<script>
    $(document).ready(function() {
        function Confirm(title, msg, $true, $false, $link_id) {
            var $content = "<div class='dialog-ovelay'>" +
                "<div class='dialog'><header>" +
                " <h3> " + title + " </h3> " +
                "<i class='fa fa-close'></i>" +
                "</header>" +
                "<div class='dialog-msg'>" +
                " <p> " + msg + " </p> " +
                "</div>" +
                "<footer>" +
                "<div class='controls'>" +
                " <button class='button button-danger doAction'>" + $true + "</button> " +
                " <button class='button button-default cancelAction'>" + $false + "</button> " +
                "</div>" +
                "</footer>" +
                "</div>" +
                "</div>";
            $('body').prepend($content);
            $('.doAction').click(function() {
                var $objdata = $("#" + $link_id);
                var $id = $objdata.attr("data-id");
                var $rowId = $objdata.attr("data-row-id");
                var $userId = $objdata.attr("data-user-id");
                $.ajax({
                    url: '/admin/list/subaccounts/fund/transfer/' + $id + '/' + $userId,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        if (data.status == '200') {
                            $("#" + $rowId).fadeOut(1000, function() {});
                            toastr.success(data.msg);
                        } else {
                            toastr.error('Something went wrong.Please try later!');
                        }
                    },
                    error: function(response) {
                        toastr.error('Something went wrong.Please try later!');
                    }
                });

                $(this).parents('.dialog-ovelay').fadeOut(500, function() {
                    $(this).remove();
                });
            });
            $('.cancelAction, .fa-close').click(function() {
                $(this).parents('.dialog-ovelay').fadeOut(500, function() {
                    $(this).remove();
                });
            });

        }
        $(document).on('click', '.btn-fund-transfer', function() {
            var $confirm_id = $(this).attr('id');
            Confirm('Fund Transfer', 'Are you sure you transfer the fund successfully.Please recheck.', 'Yes', 'Cancel', $confirm_id);
        });

        // delete post
        //        $('.btn-fund-transfer').on("click", function (e) {
        //            e.preventDefault();
        //            var $id = $(this).attr("data-id");
        //            var $rowId = $(this).attr("data-row-id");
        //            var $userId = $(this).attr("data-user-id");
        //            $.ajax({
        //                url: '/admin/list/subaccounts/fund/transfer/' + $id + '/' + $userId,
        //                type: 'GET',
        //                dataType: 'json',
        //                success: function (data) {
        //                    if (data.status == '200') {
        //                        $("#" + $rowId).fadeOut(1000, function () {});
        //                        toastr.success(data.msg);
        //                    } else {
        //                        toastr.error('Something went wrong.Please try later!');
        //                    }
        //                },
        //                error: function (response) {
        //                    toastr.error('Something went wrong.Please try later!');
        //                }
        //            });
        //        });

    });
</script>

@endsection