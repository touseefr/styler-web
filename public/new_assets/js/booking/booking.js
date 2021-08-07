$(document).ready(function() {
    var checkCookie = Cookies.get(BusinessId);

    setEmployees(employees);
    if (!!checkCookie) {
        checkCookie = JSON.parse(checkCookie);
        if (Object.keys(checkCookie.items).length > 0) {
            $(".numberofitems").text(checkCookie.numberItems);
            $(".totalprice").text(checkCookie.totalCost);
            $("#totalprice").text(checkCookie.totalCost);
            $("#tbl-show-items").append(getTableHtml(checkCookie.items));
            $(".cart-bottom").show();
            $.each(checkCookie.items, function(index, value) {
                $('.btn-add-cart[service-id="' + index + '"]').hide();
                $('.btn-remove-item[service-id="' + index + '"]').show();
            });
        } else {
            Cookies.remove(BusinessId);
            $(".cart-bottom").hide();
        }
    }
});
/*
 * booking page booking.blade.php
 *
 */
/*
 * fancybox slider initialize by following functions
 * @type type
 */
if (window.fancybox) {
    $('[data-fancybox="gallery"]').fancybox();
}
if (window.lightSlider) {
    $("#lightSlider").lightSlider({
        gallery: true,
        item: 1,
        loop: true,
        slideMargin: 0,
        thumbItem: 9
    });
}
/*
 * fancybox slider initialize end
 */
/*
 * slick slider initialize deal with function
 */
$("#responsive").slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 800,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});
/*
 * Open show cart modal deal by following function
 * Call from Choose Theme Button from bottom cart display
 */
$(document).on("click", ".btn-cart", function() {
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
    console.log(userdataafter7days);
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
});
/*
 * Global variable for handling cart items
 *
 */
$(document).on("click", "#days .day", function() {
    var employeeid = $("#year").val();
    var current_day = $(this).attr("day-string");
    var local_week_no = $(this).attr("week_no");
    $("#availableSlots").html(
        employees_available_slots[
            "week-" + local_week_no + "-" + employeeid + "-" + current_day
        ]
    );
    $(".day").removeClass("current");
    $(this).addClass("current");
    var date = $(this).attr("date");
    var monthNyear = moment(date).format("MMMM YYYY");
    $("#btn-prsent-month").text(monthNyear);
});
/*
 * Show cart items deal by following functions
 * call from Book Now Button
 */
$(document).on("click", ".btn-add-cart", function() {
    if (employees.length == 0) {
        toastr.error("No Employee Available", "Error", { timeOut: 5000 });
        return false;
    }
    var serviceInfo = $(this).attr("data-service");
    var serviceId = $(this).attr("service-id");
    var items = {};
    var checkCookie = Cookies.get(BusinessId);
    if (typeof checkCookie !== "undefined") {
        checkCookie = JSON.parse(checkCookie);
        items = checkCookie["items"];
    }
    var setcookiearray = {};
    var cartItems = {};
    cartItem = JSON.parse(serviceInfo);
    cartItems[serviceId] = cartItem;
    itemsPrice = parseInt(itemsPrice) + parseInt(cartItem["price"]);
    setcookiearray["items"] = $.extend(items, cartItems);
    setcookiearray["numberItems"] = Object.keys(setcookiearray["items"]).length;
    setcookiearray["totalCost"] = itemsPrice;
    $("#tbl-show-items").append(getTableHtml(cartItems));
    $(".numberofitems").text(Object.keys(setcookiearray["items"]).length);
    $(".totalprice").text(itemsPrice);
    $("#totalprice").text(itemsPrice);
    $(".cart-bottom").show();
    Cookies.set(BusinessId, setcookiearray);
    $('.btn-add-cart[service-id="' + serviceId + '"]').hide();
    $('.btn-remove-item[service-id="' + serviceId + '"]').show();
});
/*
 * Remove cart items deal by following functions
 * call from Book Now Button
 */
$(document).on("click", ".btn-remove-item", function() {
    var checkCookie = JSON.parse(Cookies.get(BusinessId));
    var modalHtml = "";

    var serviceId = $(this).attr("service-id");
    if (!!checkCookie) {
        checkCookie.numberItems = checkCookie.numberItems - 1;
        checkCookie.totalCost =
            checkCookie.totalCost - checkCookie.items[serviceId]["price"];
        delete checkCookie.items[serviceId];
        var where_from = $(this).attr("where-from");
        if (where_from == 0) {
            $(this)
                .parent()
                .parent()
                .remove();
        } else {
            $("#tbl-show-items")
                .find('[service-id="' + serviceId + '"]')
                .parent()
                .parent()
                .remove();
        }
        $(".numberofitems").text(checkCookie.numberItems);
        $(".totalprice").text(checkCookie.totalCost);
        $("#totalprice").text(checkCookie.totalCost);
        if (Object.keys(checkCookie.items).length === 0) {
            $("#myModal").modal("hide");
            $(".cart-bottom").hide();
            $(".numberofitems").text("0");
            $(".totalprice").text("00.00");
            $("#totalprice").text("0");
            $('[disabled="disabled"]').removeAttr("disabled");
            Cookies.remove(BusinessId);
            $(".btn-add-cart").show();
            $(".btn-remove-item").hide();
            itemsPrice = 0;
        } else {
            Cookies.set(BusinessId, checkCookie);
            $('.btn-add-cart[service-id="' + serviceId + '"]').show();
            $('.btn-remove-item[service-id="' + serviceId + '"]').hide();
        }
    } else {
    }
});

$(document).on("change", "#year", function() {
    Cookies.remove("name");
    var employeeid = $("#year").val();
    var current_day = $("#days .current").attr("day-string");
    var local_current_day = $("#days .current").attr("week_no");
    $("#availableSlots").html(
        employees_available_slots[
            "week-" + local_current_day + "-" + employeeid + "-" + current_day
        ]
    );
});
$(document).on("click", ".slot", function() {
    $(".slot").removeClass("tab-selected");
    $(this).addClass("tab-selected");
});

$(document).on("click", "#save_service_booking", function() {
    // frm_book_deal
    var bookingInfo = $("#frm_book_deal").serialize();
    start_spinner();
    $.ajax({
        url: site_url + "/serviceusersave",
        method: "POST",
        data: bookingInfo,
        success: function(data) {
            var check_status = JSON.parse(data);
            console.log(check_status);
            $("#booking").modal("hide");
            end_spinner();
            if (check_status.status == "200") {
                setTimeout(function() {
                    location.reload();
                }, 2000);
                Cookies.remove(BusinessId);
                toastr.success(check_status.error_msg, "Success", {
                    timeOut: 5000
                });
            } else {
                toastr.error(
                    "This Slot is not available any more.",
                    "Booking Error!",
                    {
                        timeOut: 5000
                    }
                );
            }
        },
        error: function(err) {
            toastr.error(
                "Someting went wrong, Please try again later.",
                "Success",
                {
                    timeOut: 5000
                }
            );
        }
    });
    return false;
});

$(document).on("click", "#btn-book-now", function() {
    var selected_time = $(".tab-selected").text();
    var selected_date = moment($(".current").attr("date")).format("MM-DD-YYYY");
    var selected_employee = $("#year").val();
    var selected_duration = 0;
    var totalprice = $("#totalprice").text();
    //    return false;
    start_spinner();
    $.each($(".selected-duration"), function(index, item) {
        selected_duration =
            parseInt(selected_duration) + parseInt($(this).attr("duration"));
    });
    var serviceId = [];
    $.each($(".color-teal"), function(index, item) {
        serviceId.push({ id: $(this).attr("service-id") });
    });
    if (selected_time == "") {
        alert("Select the Empty Slot");
        return false;
    }

    var bookingInfo = {};
    bookingInfo["time"] = selected_time;
    bookingInfo["date"] = selected_date;
    bookingInfo["start_date"] = new moment(
        new Date(selected_date + " " + selected_time)
    ).format("YYYY-MM-DD HH:mm");
    bookingInfo["total_price"] = totalprice;
    bookingInfo["end_date"] = moment(
        new Date(selected_date + " " + selected_time)
    )
        .add(selected_duration, "minutes")
        .format("YYYY-MM-DD HH:mm");
    bookingInfo["duration"] = selected_duration;
    bookingInfo["employeeid"] = selected_employee;
    bookingInfo["services"] = serviceId;
    bookingInfo["businessid"] = BusinessId;
    $.ajax({
        url: site_url + "/checklogin",
        method: "POST",
        data: bookingInfo,
        success: function(data) {
            var check_status = JSON.parse(data);
            if (check_status.auth == 200) {
                if (check_status.status == "200") {
                    Cookies.remove(BusinessId);
                    end_spinner();
                    window.open(check_status.redirect_url, "_self");
                } else {
                    end_spinner();
                    toastr.error(
                        "This Slot is not available any more.",
                        "Booking Error!",
                        {
                            timeOut: 5000
                        }
                    );
                }
            } else {
                end_spinner();
                $("#myModal").modal("hide");
                $("#booking").modal("show");
            }
        }
    });
});

function getEmptySlots(today) {
    console.log(today);
    var showcurrenttoday = moment().format("MMMM YYYY");
    var dates = getWeeksStartAndEndInMonth(today, "1", "7");
    var modalHtml = "";
    var modaldata = [];
    var workinghours = [];
    var week_working_hours = [];
    var employee_slots = [];
    var week_days = [];
    modaldata["showdate"] = showcurrenttoday;
    var todayDay = new moment(today).format("DD");
    $.each(dates, function(index, value) {
        var objmom = new moment(value);
        var activeclass = "";
        if (objmom.format("DD") == todayDay && week_no === 0) {
            activeclass = "current";
        }
        modalHtml +=
            '<div class="day ' +
            activeclass +
            '" date="' +
            value +
            '"  day-string="' +
            objmom.format("dddd").toLowerCase() +
            '" week_no="' +
            week_no +
            '"><small>' +
            objmom.format("ddd") +
            "</small>" +
            objmom.format("DD") +
            "</div>";
        week_days.push(objmom.format("DD"));
    });
    modaldata["week_days"] = modalHtml;
    $.each(employees, function(emp_index, emp_value) {
        var operating_hours = emp_value.employee_schedule;
        var empployeeId = emp_value.id;

        $.each(operating_hours, function(oph_index, oph_value) {
            var breakTime = getBreakTime(oph_value.break);
            var bookingday = new moment(oph_value.start)
                .format("dddd")
                .toLowerCase();
            var startinghour = new moment(oph_value.start).format("HH");
            var startingminute = new moment(oph_value.start).format("mm");
            var endinghour = new moment(oph_value.end).format("HH");
            var endingminute = new moment(oph_value.end).format("mm");

            var minute_intervals = ["00", "15", "30", "45"];
            var dayworkinghour = [];
            if (
                oph_index == new moment().format("dddd").toLowerCase() &&
                week_no == 0
            ) {
                startinghour = new moment().format("HH");
            }
            var currentMinutesIndex = $.inArray(
                startingminute,
                minute_intervals
            );
            var count = 0;
            var employeeblockSlot = getBlockTime(
                emp_value.blockTime,
                week_days
            );
            console.log(employeeblockSlot);
            var employeebookingdays = getBookingTime(
                emp_value.bookinghours,
                week_days
            );
            console.log(employeebookingdays);
            for (i = startinghour; i < endinghour; i++) {
                for (v = 0; v < 4; v++) {
                    if (count == 0) {
                        v = currentMinutesIndex;
                    }
                    var slot = "09-06-2018 " + i + ":" + minute_intervals[v];
                    var slot1 = i + minute_intervals[v];
                    if (slot1.length !== 4) {
                        slot1 = `0${slot1}`;
                    }
                    var checkinarray = $.inArray(slot1, breakTime);
                    var checkinbooking = $.inArray(
                        slot1,
                        employeebookingdays[oph_index]
                    );
                    var checkinblock = $.inArray(
                        slot1,
                        employeeblockSlot[oph_index]
                    );
                    if (
                        checkinarray === -1 &&
                        checkinbooking === -1 &&
                        checkinblock === -1
                    ) {
                        var modalhtml =
                            '<div class="slot">' +
                            new moment(new Date(slot)).format("hh:mm A") +
                            "</div>";
                        dayworkinghour.push(modalhtml);
                    }
                    count++;
                }
            }
            endingminute = $.inArray(endingminute, minute_intervals);
            if (endingminute > 0) {
                for (i = endinghour; i < endinghour + 1; i++) {
                    for (v = 0; v < 4; v++) {
                        if (v < endingminute && endinghour === i) {
                            var slot =
                                "09-06-2018 " + i + ":" + minute_intervals[v];
                            var slot1 = i + minute_intervals[v];
                            if (slot1.length !== 4) {
                                slot1 = `0${slot1}`;
                            }
                            var checkinarray = $.inArray(slot1, breakTime);
                            var checkinbooking = $.inArray(
                                slot1,
                                employeebookingdays[oph_index]
                            );
                            var checkinblock = $.inArray(
                                slot1,
                                employeeblockSlot[oph_index]
                            );
                            if (
                                checkinarray === -1 &&
                                checkinbooking === -1 &&
                                checkinblock === -1
                            ) {
                                var modalhtml =
                                    '<div class="slot">' +
                                    new moment(new Date(slot)).format(
                                        "hh:mm A"
                                    ) +
                                    "</div>";
                                dayworkinghour.push(modalhtml);
                            }
                            count++;
                        }
                    }
                }
            }
            week_working_hours[
                "week-" + week_no + "-" + empployeeId + "-" + oph_index
            ] = dayworkinghour;
        });
    });
    modaldata["available_employee_slots"] = week_working_hours;
    week_no++;
    return modaldata;
}

function getTableHtml($items) {
    var modalHtml = "";
    $.each($items, function(index, value) {
        modalHtml +=
            '<div class="row py-20">\n\
<div class="col-xs-12 col-md-6">' +
            value["title"] +
            '</div>\n\
<div class="col-xs-5 col-md-2 selected-duration" duration="' +
            value["duration"] +
            '"><i class="fa fa-clock"></i> ' +
            value["duration"] +
            ' min</div>\n\
<div class="col-xs-5 col-md-2"><i class="fa fa-dollar"></i> ' +
            value["price"] +
            '</div>\n\
<div class="col-xs-2 col-md-2"><a class="btn-remove-item fa-1-5x color-teal" href="javascript:;" service-id="' +
            index +
            '" where-from="0" price="' +
            value["price"] +
            '"><i class="fa fa-trash">&nbsp;</i></a></div>\n\
</div>';
    });

    return modalHtml;
}

function setEmployees($employees) {
    var modalHtml = "";
    $.each($employees, function(index, value) {
        modalHtml +=
            '<option value="' +
            value["id"] +
            '">' +
            value["first_name"] +
            " " +
            value["last_name"] +
            "</option>";
    });
    $("#year").html(modalHtml);
}

function getNext7Dates($fromdate, $numberofdays = 7) {
    var dates = [];
    for (var i = 1; i < $numberofdays; i++) {
        var next = new Date($fromdate);
        next.setDate($fromdate + i);
        dates.push(next.toString());
    }
    return dates;
}

function getWeeksStartAndEndInMonth(startdate, interval, stop) {
    let weeks = [];
    firstDate = new Date(startdate);
    for (var i = 1; i <= stop; i++) {
        weeks.push(firstDate);
        firstDate = moment(firstDate)
            .add(interval, "days")
            .toDate();
    }
    return weeks;
}

function getBreakTime($break) {
    var dayworkinghour = [];
    var minute_intervals = ["00", "15", "30", "45"];
    $.each($break, function(oph_index, oph_value) {
        var startinghour = new moment(oph_value.start).format("HH");
        var startingminute = new moment(oph_value.start).format("mm");
        var endinghour = new moment(oph_value.end).format("HH");
        var endingminute = new moment(oph_value.end).format("mm");

        for (i = startinghour; i < endinghour; i++) {
            var index_of_min = $.inArray(startingminute, minute_intervals);
            for (v = index_of_min; v < 4; v++) {
                var slot = i + minute_intervals[v];
                dayworkinghour.push(slot);
            }
        }
        if (startinghour == endinghour) {
            for (i = startingminute; i < endingminute; i++) {
                var index_of_min = $.inArray(startingminute, minute_intervals);
                for (v = index_of_min; v < 4; v++) {
                    var slot = startinghour + minute_intervals[v];
                    dayworkinghour.push(slot);
                }
            }
        }
        console.log(dayworkinghour);
    });
    return dayworkinghour;
}

function getBookingTime($booking, $weekdays) {
    var dayworkinghour = [];
    var minute_intervals = ["00", "15", "30", "45"];
    var $bookingtimes = [];
    $bookingtimes["friday"] = [];
    $bookingtimes["saturday"] = [];
    $bookingtimes["sunday"] = [];
    $bookingtimes["monday"] = [];
    $bookingtimes["tuesday"] = [];
    $bookingtimes["wednesday"] = [];
    $bookingtimes["thursday"] = [];
    var day = "";
    $.each($booking, function(oph_index, oph_value) {
        var daystring = new moment(oph_value.time).format("dddd").toLowerCase();
        var day = new moment(oph_value.time).format("DD");
        var hasweekday = $.inArray(day, $weekdays);
        if (hasweekday > -1) {
            var objStartDate = new moment(new Date(oph_value.time));
            var objEndDate = new moment(new Date(oph_value.end_time));
            var diff = objEndDate.diff(objStartDate, "minutes") / 15;
            var startinghour = new moment(oph_value.time).format("HH");
            var startingminute = new moment(oph_value.time).format("mm");
            var currentMinutesIndex = $.inArray(
                startingminute,
                minute_intervals
            );
            for (i = 0; i < diff; i++) {
                var slot = startinghour + minute_intervals[currentMinutesIndex];
                dayworkinghour.push(slot);
                var book = $bookingtimes[daystring];
                book.push(slot);
                $bookingtimes[daystring] = book;
                // $bookingtimes[daystring] = dayworkinghour;
                if (currentMinutesIndex === 3) {
                    currentMinutesIndex = 0;
                    startinghour++;
                } else {
                    currentMinutesIndex++;
                }
            }
        }
    });
    return $bookingtimes;
}

function getBlockTime($booking, $weekdays) {
    var dayworkinghour = [];
    var minute_intervals = ["00", "15", "30", "45"];
    var $bookingtimes = [];
    $bookingtimes["friday"] = [];
    $bookingtimes["saturday"] = [];
    $bookingtimes["sunday"] = [];
    $bookingtimes["monday"] = [];
    $bookingtimes["tuesday"] = [];
    $bookingtimes["wednesday"] = [];
    $bookingtimes["thursday"] = [];
    var day = "";
    $.each($booking, function(oph_index, oph_value) {
        var daystring = new moment(oph_value.start_time)
            .format("dddd")
            .toLowerCase();
        var day = new moment(oph_value.start_time).format("DD");
        var hasweekday = $.inArray(day, $weekdays);
        if (hasweekday > -1) {
            var objStartDate = new moment(new Date(oph_value.start_time));
            var objEndDate = new moment(new Date(oph_value.end_time));
            var diff = objEndDate.diff(objStartDate, "minutes") / 15;
            var startinghour = new moment(oph_value.start_time).format("HH");
            var startingminute = new moment(oph_value.start_time).format("mm");
            var currentMinutesIndex = $.inArray(
                startingminute,
                minute_intervals
            );
            for (i = 0; i < diff; i++) {
                var slot = startinghour + minute_intervals[currentMinutesIndex];
                dayworkinghour.push(slot);
                var book = $bookingtimes[daystring];
                book.push(slot);
                $bookingtimes[daystring] = book;
                // $bookingtimes[daystring] = dayworkinghour;
                if (currentMinutesIndex === 3) {
                    currentMinutesIndex = 0;
                    startinghour++;
                } else {
                    currentMinutesIndex++;
                }
            }
        }
    });
    return $bookingtimes;
}

/*
 * modal jquery start
 */
function callSelect() {
    $("select").each(function() {
        var $this = $(this),
            numberOfOptions = $(this).children("option").length;

        $this.addClass("select-hidden");
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next("div.select-styled");
        $styledSelect.text(
            $this
                .children("option")
                .eq(0)
                .text()
        );

        var $list = $("<ul />", {
            class: "select-options"
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $("<li />", {
                text: $this
                    .children("option")
                    .eq(i)
                    .text(),
                rel: $this
                    .children("option")
                    .eq(i)
                    .val()
            }).appendTo($list);
        }

        var $listItems = $list.children("li");

        $styledSelect.click(function(e) {
            if ($(".select-options li").length > 1) {
                if ($(".select-options").is(":visible")) {
                    e.stopPropagation();
                    $styledSelect.text($(this).text()).removeClass("active");
                    $this.val($(this).attr("rel"));
                    $list.hide();
                } else {
                    e.stopPropagation();
                    $("div.select-styled.active").each(function() {
                        $(this)
                            .removeClass("active")
                            .next("ul.select-options")
                            .hide();
                    });
                    $(this)
                        .toggleClass("active")
                        .next("ul.select-options")
                        .toggle();
                } //end if
            }
        });

        $listItems.click(function(e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass("active");
            $this.val($(this).attr("rel"));
            $list.hide();
            var employeeid = $("#year").val();
            var current_day = $("#days .current").attr("day-string");
            var get_week_no = $("#days .current").attr("week_no");
            $("#availableSlots").html(
                employees_available_slots[
                    "week-" + get_week_no + "-" + employeeid + "-" + current_day
                ]
            );
        });

        $(document).click(function() {
            $styledSelect.removeClass("active");
            $list.hide();
        });
    });
}
var flag_count_error_click = 0;

function prev() {
    if (flag_count_error_click > 0) {
        $("#prev_arrow").removeAttr("disabled", "disabled");
        var val =
            (parseInt(document.getElementById("days").style.marginLeft) || 0) +
            62;
        document.getElementById("days").style.marginLeft = val + "px";
        flag_count_error_click--;
    } else {
        $("#prev_arrow").attr("disabled", "disabled");
    }
}

function nxt() {
    var val =
        (parseInt(document.getElementById("days").style.marginLeft) || 0) - 62;
    document.getElementById("days").style.marginLeft = val + "px";
    var no_of_employees = Object.keys(employees).length;
    var no_of_dates = Object.keys(employees_available_slots).length;
    var actual_dates = no_of_dates / no_of_employees;

    if (dates_present === 0 || dates_present === 8) {
        var nextdaydate = moment(
            $(".day")
                .last()
                .attr("date")
        )
            .add(1, "day")
            .toDate();
        var userdataafter7days = getEmptySlots(nextdaydate);
        $("#days").append(userdataafter7days["week_days"]);
        var new_array = $.extend(
            employees_available_slots,
            userdataafter7days["available_employee_slots"]
        );
        employees_available_slots = new_array;
        dates_present = 1;
    }
    dates_present++;
    flag_count_error_click++;
}
