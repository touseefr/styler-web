$(document).ready(function () {

    $(document).on('click','#getcopytext',function(){
        $(this).find('i').addClass('fa-clipboard-check').removeClass('fa-clipboard');
        $('.copiedtext').show();
        setTimeout(function(){
            $('.copiedtext').hide();
            $('#getcopytext').find('i').addClass('fa-clipboard').removeClass('fa-clipboard-check');
        },2000)
    });
    $('.pop-gallery').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });
});


$(document).ready(function () {
    $('.slider-test').slick({
        slidesToShow: 1,
        slidesToScroll: 1
    });
});
$(function () {

    $('.stars').stars();
    $("#review_model").on('show.bs.modal', function () {
        $.get("/apps/widgets/review/review-detail.blade.php", function (data) {
            $("#review_model").find('.modal-content').html(data);
        })
    });
});
function changeHomeTab(text, obj) {
    $('.nav-tabs div').show();
    $(obj).closest('div').hide();
    $('.tab-title').html(text);
}
function updateCheckboxVal(obj) {

    var is_checked = $(obj).is(":checked");
    if (is_checked) {
        $('#hidden-status').val(0);
    } else {
        $('#hidden-status').val(1);
    }
}
$(document).ready(function () {
    $(document).on('click', '.review_detail_pop', function (e) {
        var targeted_popup_class = jQuery(this).attr('data-review-detail');
        var targeted_user_id = jQuery(this).attr('to-user-id');
        var login_user_id = lgin_user_id;
        var comment_id = jQuery(this).attr('comment_id');
        var from_user_id = jQuery(this).attr('from-user-id');
        var str_length = login_user_id.length;
        var recmt_content = jQuery(this).attr('data-reply-comment');
        if (recmt_content != "")
            recmt_content = JSON.parse(recmt_content);

        if (str_length > 0 && targeted_user_id == login_user_id) {
            $("#write_reply").show();
        }

        $("#comment_id").val(comment_id);
        $("#to_user_id").val(targeted_user_id);

        $("#from-user-id").val(from_user_id);
        if (recmt_content.length > 0) {
            $(".reply_block").show();
            var recmts = "";
            $.each(recmt_content, function (index, values) {
                var image_path = (values.image_path.length > 0) ? values.image_path : "images/user_pic.jpg";
                var cmted_name = values.name;
                var recmt = values.review_comment;
                var recmt_html = '<div class="reply_comment_cont col-md-12 col-ms-12 col-xs-12" >\n\
            <div class="col-md-2"><img src="' + image_path + '" id="img_profile_img" alt="" width="75" height="75" class="img-circle center-block"></div>\n\
                 <div class="col-md-9" style="line-height: 29px;font-size: 15;font-weight: normal;"><p id="recomt_content">' + recmt + '</p>Reply by:&nbsp; <span><b id="recmt_name">' + cmted_name + '</b></span></div>\n\
                 </div><div class="clear"></div>';
                recmts = recmts + recmt_html;
            });
            $(".reply_block").html(recmts);
        } else {

        }

        $('#review_detail').html(targeted_popup_class);
        $('#popup-1').modal("show")
//        $('[data-popup="popup-1"]').fadeIn(350);
        e.preventDefault();
    });
    //----- CLOSE
    $('.modal_close').on('click', function (e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
        $("#write_reply").hide();
        $(".reply_comment").hide();
        $(".reply_block").hide();
        $("reply_block").hide();
        $("reply_block").html("");
        e.preventDefault();
    });
    //-------- write comment button
    $(document).on("click", "#write_reply", function () {
        $(".reply_comment").show();
        $("#reply_content").val('');
    });
    //-------- reply comment
    $('#btn-reply').on('click', function (e) {
        var comment_id = $("#comment_id").val();
        var trageted_user_id = $("#from-user-id").val();
        var review_detail = $('#reply_content').val();
        if (!review_detail) {
            var msg_div = ".msg";
            $(msg_div).addClass("alert-danger");
            $(msg_div).text("Reply field is empty.");
            $(msg_div).show();
            setTimeout(function () {
                $(msg_div).fadeOut('slow', 'linear');
            }, 2000);
            return false;
        }
        $.ajax({
            method: "POST",
            url: "/reply_on_comment",
            data: {to_user_id: trageted_user_id, reply_comment: review_detail, comment_id: comment_id, _token: '{{csrf_token()}}'},
            success: function (data) {
                var status_check = JSON.parse(data);
                console.log(status_check);
                var msg_div = ".msg";
                if (status_check.success == "200") {
                    $(msg_div).addClass("alert-success");
                    $(msg_div).text(status_check.msg);
                    console.log(status_check.msg);
                } else {
                    $(msg_div).addClass("alert-danger");
                    $(msg_div).text("Something went wrong.Please try again later.");
                }
                var recmts = "";
                var replys = JSON.parse(status_check.reviews);
                $.each(replys, function (index, values) {
                    var image_path = (values.image_path.length > 0) ? values.image_path : "images/user_pic.jpg";
                    var cmted_name = values.name;
                    var recmt = values.review_comment;
                    var recmt_html = '<div class="reply_comment_cont col-md-12 col-ms-12 col-xs-12" >\n\
            <div class="col-md-2"><img src="' + image_path + '" id="img_profile_img" alt="" width="75" height="75" class="img-circle center-block"></div>\n\
                 <div class="col-md-10" style="line-height: 29px;font-size: 15;font-weight: normal;"><p id="recomt_content">' + recmt + '</p>Reply by:&nbsp; <span><b id="recmt_name">' + cmted_name + '</b></span></div>\n\
                 </div><div class="clear"></div>';
                    recmts = recmts + recmt_html;
                });
                $(".reply_block").html();
                $(".reply_block").html(recmts);
                $(".reply_block").show();
                $(msg_div).show();
                $(".reply_comment").hide();
                setTimeout(function () {
                    $(msg_div).fadeOut('slow', 'linear');
                }, 2000);
            },
        })

    });
    // < !--button scroll code  start here-- >
    $('#button1').click(function () {
        $("html, body").animate({scrollTop: $(".customersection").offset().top}, 600);
        return false;
    });
    $('#button2').click(function () {
        $("html, body").animate({scrollTop: $(".bscroll").offset().top}, 600);
        return false;
    });
    $('#button3').click(function () {
        $("html, body").animate({scrollTop: $(".bscroll").offset().top}, 600);
        return false;
    });
    // <!-- button scroll code  end here -->
    $('.front-box').hover(
            function () {
                var cls = $(this).attr('data-inf');
                $('.' + cls).css('opacity', '1');
                $('.play_intro').css('opacity', '0');
            }, function () {
        var cls = $(this).attr('data-inf');
        $('.' + cls).css('opacity', '0');
        $('.play_intro').css('opacity', '1');
    }
    );
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#scroll').fadeIn();
            $('nav').addClass('fixed-header');
        } else {
            $('#scroll').fadeOut();
            $('nav').removeClass('fixed-header');
        }
    });
    $("div.content").scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#scroll').fadeIn();
            $('nav').addClass('fixed-header');
        } else {
            $('#scroll').fadeOut();
            $('nav').removeClass('fixed-header');
        }
    });
    $('#scroll').click(function () {
        $("div.content").animate({scrollTop: 0}, 600);
        $("html, body").animate({scrollTop: 0}, 600);
        return false;
    });
    var size = $(".user_latest_reviews").size();
    var x = 3;
    $('#load_more').click(function (e) {
        e.preventDefault();
        x = (x + 3 <= size) ? x + 3 : size;
        $('.user_latest_reviews:lt(' + x + ')').fadeIn(1000);
        if (x >= size) {
            $('#load_more').hide();
            $('#less').show();
        }
    });
    $('#less').click(function (e) {
        e.preventDefault();
        var size = $(".user_latest_reviews:visible").size();
        x = (size > 3) ? size - 3 : 0;
        //             x= (x-3 >= size) ? x-3 : size;
        $('.user_latest_reviews:gt(' + x + ')').fadeOut(1000);
        if (x <= 3) {
            $('#less').hide();
            $('#load_more').show();
        }
    });
    $('#passwordtext').hide();
    $('#login-frm #rememberMe').click(function (e) {
        if ($(this).is(':checked')) {
            $('#password').prop('type', 'text');
        } else {
            $('#password').prop('type', 'password');
        }
    });



});






/*
 * profile page contact service provider,distributor and sc start
 */

$(document).on("submit", "#frmContactMe", function () {
    $("#btnSendMail").attr("disabled", "disabled");
    var formData = $(this).serialize();
    console.log(formData);
    start_spinner();
    $.ajax({
        type: "POST",
        url: '/contactme',
        data: formData,
        success: function (response) {
            var response = jQuery.parseJSON(response);

            if (response.status == '200') {
                $(".msgStatus").addClass("alert alert-success");
            } else {
                $(".msgStatus").addClass("alert alert-danger");
            }
            $(".msgStatus").text(response.msg);
            $(".msgStatus").show();
            setTimeout(function () {
                $(".msgStatus").fadeOut('slow', 'linear');
                $('#msgStatus').trigger("reset");
                $("#myModal").modal('hide');



            }, 5000);
            end_spinner();

        }
    });
    $("#btnSendMail").removeAttr("disabled");


    return false;
})

/*
 * profile page contact service provider,distributor and sc end
 */

$(document).ready(function () {
    $('.sponser_slides').slick({
        dots: true,
        infinite: true,
        speed: 700,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
});
//Resize handler to reset the menu visibility
var resizeTimer;
$(window).on('resize', function (e) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        if ($(window).width() > 500) {
            $('.nav-menu-2').show();
            $('.mobile-nav-button').hide();
            $('.row-1').show();
        } else {
        }
    }, 250);
});
$('.mobile-nav-button').on('click', function () {
    $('.nav-menu-2').slideToggle();
});
$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('#scroll').fadeIn();
        $('nav').addClass('fixed-header');
    } else {
        $('#scroll').fadeOut();
        $('nav').removeClass('fixed-header');
    }
});
$('#scroll').click(function () {
    $("html, body").animate({scrollTop: 0}, 600);
    return false;
});


$(document).ready(function () {
    function slickSlider() {
        $('.listing_slides ').slick({
            dots: false,
            infinite: true,
            speed: 700,
            autoplay: true,
            autoplaySpeed: 5000,
            arrows: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            prevArrow:"<button type='button' class='slick-prev nextSlide'><img src='images/pre.png' ></button>",
            nextArrow:"<button type='button' class='slick-next prevSlide'><img src='images/next.png' ></button>",
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    slickSlider();
    $('.tabBtn').click(function () {
        // var width=$('.deals-listing').find('.slick-slide:first').outerWidth();
        // if(width<50){
        //     width=233;
        // }
        // $('.deals-listing').find('.slick-slide').css('min-width',width);
        $('.listing_slides').slick('destroy');
        setTimeout(function () {
            slickSlider()
        }, 300);
    });
    var h = $('.hd-trial-container').height();
    $('main').css('padding-top', h - 2);
});
function start_spinner() {
    $(".se-pre-con2").show();
}
function end_spinner() {
    $(".se-pre-con2").hide();
}

function char_length_home_pg() {
    var text_length = $('#ratingformpopup textarea').val().length;
    var min_allowed_char = 30;// $(".allowed_char").html();
    var remaining_char = min_allowed_char - text_length;
    if (text_length <= min_allowed_char) {
        var show_bar = (text_length / min_allowed_char) * 100;
        if(show_bar<100){
            $(".div_char_bar").css("width", show_bar+"%");
        }
        $(".remaining_char").html(remaining_char);
    } else {
        $(".div_char_bar").css("width", "100%");
        $(".remaining_char").html('0');
    }
}

