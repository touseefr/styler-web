/*
 * booking_from check call from book now button or book later button
 *  0:book_later,1:booknow
 */
var booking_from = 0;

//$(document).ready(function () {
//    console.log(employees);
//    console.log(employees.length);
//    if (employees.length === 0) {
//        $('#btn-deal-book-now').attr('disabled', 'disabled');
//    }
//
//});

$(document).on("click", "#btn-deal-book-now", function() {
    booking_from = 1;
    if (employees.length === 0) {
        toastr.error("Employee are not available!!", "Employee", {
            timeOut: 5000
        });
    } else {
        var auth_status = $(this).attr("auth-status");
        if (auth_status == 0) {
            $("#booking").modal("show");
        } else {
            //        if (){
            getDealsHtml();
            openBookingCalendar();
            //        }
        }
    }
});
$(document).on("click", "#btn-book-now", function(e) {
    var auth_status = parseInt($("#btn-deal-book-now").attr("auth-status"));
    if (auth_status === 0) {
        var login_data = Cookies.set("deal_booking_now_" + BusinessId);
    }
    var selected_date = moment($("#days .current").attr("date")).format(
        "MM-DD-YYYY"
    );
    var selected_time = $("#availableSlots .tab-selected").text();
    var start_time = new moment(
        new Date(selected_date + " " + selected_time)
    ).format("YYYY-MM-DD HH:mm");
    var end_date = moment(new Date(selected_date + " " + selected_time))
        .add(duration, "minutes")
        .format("YYYY-MM-DD HH:mm");
    var selected_employee = $("#year").val();
    var total_price = $("#totalprice").text();
    var deal_name = $(".deal-title-table").text();
    var selected_date_time_query =
        "&date=" +
        selected_date +
        "&time=" +
        selected_time +
        "&start_date=" +
        start_time +
        "&end_date=" +
        end_date +
        "&employeeid=" +
        selected_employee +
        "&total_price=" +
        total_price +
        "&duration=" +
        duration +
        "&deal_name=" +
        deal_name;
    if (selected_date.length === 0 || selected_time.length === 0) {
        toastr.error("Please select the date and time.", "Error", {
            timeOut: 5000
        });
        e.stopImmediatePropagation();
        return false;
    }

    if (auth_status === 0) {
        var parameters = login_data + selected_date_time_query;
        var controller_action = "/dealbooknow";
    } else {
        var urlParams = new URLSearchParams(location.search);
        var listing_id = urlParams.get("id");
        var parameters = selected_date_time_query + "&listing_id=" + listing_id;
        var controller_action = "/dealbooknowauth";
    }
    start_spinner();
    $.ajax({
        method: "POST",
        url: main_url + controller_action,
        data: parameters
    }).success(function(msg) {
        end_spinner();
        var results = jQuery.parseJSON(msg);
        if (results.status == "200") {
            $("#myModal").modal("hide");
            $("#booking").modal("hide");
            setTimeout(function() {
                location.reload();
            }, 2000);
            toastr.success(results.msg, "Success", { timeOut: 5000 });
        } else {
            toastr.error(
                "This Slot is not available any more.",
                "Booking Error!",
                {
                    timeOut: 5000
                }
            );
        }
    });
    e.stopImmediatePropagation();
});
$(document).on("click", "#btn-book-later", function() {
    booking_from = 0;
    var auth_status = $(this).attr("auth-status");
    if (auth_status == 0) {
        $("#booking").modal("show");
    } else {
        var urlParams = new URLSearchParams(location.search);
        var listing_id = urlParams.get("id");
        start_spinner();
        $.ajax({
            method: "GET",
            url: main_url + "/booklaterwithauth",
            data: { listing_id: listing_id }
        }).success(function(msg) {
            end_spinner();
            var results = jQuery.parseJSON(msg);
            toastr.success(results.error_msg, "Success", { timeOut: 5000 });
        });
    }
});
$(document).on("submit", "#frm_book_deal", function() {
    if (booking_from === 1) {
        Cookies.set(
            "deal_booking_now_" + BusinessId,
            $("#frm_book_deal").serialize()
        );
        getDealsHtml();
        openBookingCalendar();
    } else {
        $("#save_deal_booking").attr("disabled", "disabled");
        start_spinner();
        $.ajax({
            method: "POST",
            url: main_url + "/booklater",
            data: $("#frm_book_deal").serialize()
        }).success(function(msg) {
            end_spinner();
            $("#booking").modal("hide");
            $("#frm_book_deal").trigger("reset");

            var results = jQuery.parseJSON(msg);
            if (results.status == "200") {
                toastr.success(results.error_msg, "Success", { timeOut: 5000 });
            } else {
                toastr.error(results.error_msg, "Error", { timeOut: 5000 });
            }
            $("#save_deal_booking").removeAttr("disabled");
        });
    }
    return false;
});
$(document).on("click", "#btn-deal-book-now-other", function() {
    var urlParams = new URLSearchParams(location.search);
    var listing_id = urlParams.get("id");
    start_spinner();
    $.ajax({
        method: "GET",
        url: main_url + "/booklaterwithauth",
        data: { listing_id: listing_id }
    }).success(function(msg) {
        end_spinner();
        var results = jQuery.parseJSON(msg);
        toastr.success(results.error_msg, "Success", { timeOut: 5000 });
    });
});

function openBookingCalendar() {
    var today = moment().toDate();
    var userdata = getEmptySlots(today);
    $("#myModal").modal("show");
    $("#btn-prsent-month").text(userdata["showdate"]);
    $("#days").html(userdata["week_days"]);
    employees_available_slots = userdata["available_employee_slots"];
    var userdataafter7days = getEmptySlots(
        moment(today)
            .add(7, "day")
            .toDate()
    );
    $("#days").append(userdataafter7days["week_days"]);
    var new_array = $.extend(
        employees_available_slots,
        userdataafter7days["available_employee_slots"]
    );
    employees_available_slots = new_array;
    var employeeid = $("#year").val();
    var current_day = $("#days .current").attr("day-string");
    var local_current_day = $("#days .current").attr("week_no");
    $("#availableSlots").html(
        employees_available_slots[
            "week-" + local_current_day + "-" + employeeid + "-" + current_day
        ]
    );
}
function getDealsHtml() {
    var modalHtml =
        '<div class="row py-20">\n\
<div class="col-xs-12 col-md-3 deal-title-table">' +
        deal_info["title"] +
        '</div>\n\
<div class="col-xs-5 col-md-3 selected-duration" duration=""><span>Original Price</span>&nbsp;&nbsp;<i class="fa fa-dollar"></i>' +
        deal_info["price"] +
        ' </div>\n\
<div class="col-xs-3 col-md-3"> <span>Discount</span>&nbsp;&nbsp;<i class="fa fa-dollar"></i> ' +
        deal_info["discount"] +
        '</div>\n\
<div class="col-xs-2 col-md-3"><a class="btn-remove-item fa-1-5x color-teal" href="javascript:;" service-id="" where-from="0" price="' +
        (deal_info["price"] - deal_info["discount"]) +
        '"><span>Price Now</span>&nbsp;&nbsp;<i class="fa fa-dollar"></i>' +
        (deal_info["price"] - deal_info["discount"]) +
        "</a></div>\n\
</div>";

    $("#tbl-show-items").html(modalHtml);
    $("#totalprice").text(deal_info["price"] - deal_info["discount"]);
}
