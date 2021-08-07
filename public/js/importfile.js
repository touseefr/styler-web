var page_title = "basif_info";
var sz_info = {
    "basif_info": ["business_name", "contact_number", "business_address", "business_email", "about", "state", "abn", "postcode", "latitude", "longitude", "abn_name", "website", "business_suburb"],
    "product": ["category_id", "make_id", "title", "size", "quantity", "wholesale_price", "retail_price", "description"],
    "product_maker": ["title"],
    "service_categories": ["name", "description"],
    "service": ["title", "process_time", "price", "desc", "dicount", "service_type", "duration", "category_id"],
    "customer": ["first_name", "last_name", "email", "gender", "contact_number", "address", "state", "dob", "phone_home", "phone_work", "sms_number", "address_line_1", "city", "zip", "notification_emails", "notification_postal", "notification_phone", "notification_sms", "notification_appoinment", "occupation", "history"],
    "employee": ["first_name", "last_name", "email", "gender", "contact_number", "address", "state", "dob", "phone", "mobile", "doh", "address_line_1", "city", "zip", "phone","comment", "comment"],

};
var sz_map = new Array();
var filedata = {};
var file_all_data = new Array();
var append_data = "";
var select_define_value = 0;
var select_file_value = 0;
var other_data = new Array();
$(document).ready(function () {
    loadinfo(sz_info[page_title]);
});
$(document).on("click", "#show_define_value li", function () {
    if (select_define_value == 0) {
        var checkFile = ($("#file_data").val()) ? $("#file_data").val() : filedata;
        if (checkFile.length > 0) {
            if (sz_map.length == 0) {
                sz_map[sz_map.length] = {'define_value': $(this).text(), 'file_value': ''};
            } else {
                sz_map[(sz_map.length + 1)] = {'define_value': $(this).text(), 'file_value': ''};
            }
            $(this).remove();
            select_define_value = 1;
        } else {
            alert("File is required.");
        }
    }
});
$(document).on("click", "#show_file_value li", function () {
    if (select_define_value === 1) {
        select_define_value = 0;
        sz_map[(sz_map.length - 1)]['file_value'] = $(this).text();
        var html = '<li><a dataindex="' + (sz_map.length - 1) + '">' + sz_map[(sz_map.length - 1)]['file_value'] + ' => ' + sz_map[(sz_map.length - 1)]['define_value'] + '</a>&nbsp;<i  class="fa fa-trash remove_it" data-toggle="tooltip" data-placement="top" dataindex="' + (sz_map.length - 1) + '" title="Delete"></i></li>';
        $("#show_linked_value").append(html);
        $(this).remove();
    }
});
$(document).on("click", ".remove_it", function () {
    var dataindex = $(this).attr('dataindex');
    $(this).parent().remove();
    var html = '<li><a>' + sz_map[(dataindex)]['file_value'] + '</a></li>';
    $("#show_file_value").append(html);
    var html = '<li><a>' + sz_map[([dataindex])]['define_value'] + '</a></li>';
    $("#show_define_value").append(html);
    sz_map.splice(dataindex, 1);
});
$(document).on("click", "#save_map_data", function () {
    var send_data = {};
    var formData = new FormData();
    var select_file = $('.select-file').val();
    var file_status = 0;
    formData.append('maping', JSON.stringify(sz_map));
    formData.append('user_id', $('#user_id').val());
    formData.append('page_title', page_title);
// Attach file
    formData.append('image', $('input[type=file]')[0].files[0]);
    if (select_file === "undefined" && select_file !== null) {
        file_status = 1;
    }
    formData.append('file_status', file_status);
    formData.append('file_path', select_file);
    if (page_title === "product") {
        send_data = {'other': other_data['categories'], 'maping': sz_map, 'data': formData, 'user_id': $('#user_id').val(), 'page_title': page_title, 'file_status': file_status, 'file_path': select_file};
    } else {
        send_data = {'maping': sz_map, 'data': formData, 'user_id': $('#user_id').val(), 'page_title': page_title, 'file_status': file_status, 'file_path': select_file};
    }
    $(".spinner-div").show();
    $.ajax({
        url: "../save_info",
        type: "POST",
        dataType: "json",
        data: formData,
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false,
        success: function (data) {
            if (data.status === "200") {
                alert(data.msg);
                $('#frm_import_file').trigger("reset");
                $("#show_file_value").html('');
                $("#show_linked_value").html('');
                $("#show_define_value").html('');
                loadinfo(sz_info[page_title]);
                var file_all_data = new Array();

            } else {
                alert(data.msg);
            }
            $(".spinner-div").hide();
        },
        error: function (e)
        {
            console.log('error');
            $(".spinner-div").hide();
        }
    });
});
$(document).on("click", ".page-selected li a", function () {
    page_title = $(this).attr('page-title');
    loadinfo(sz_info[page_title]);
    $("#show_file_value").html('');
    $("#show_linked_value").html('');
    sz_map = new Array();
});
$(document).on("change", '#file_data', function (e) {
    var inputField = $("#file_data");
    ExportToTable(inputField);
});
$(document).on("change", '.select-file', function (e) {
    var getfile = $(this).val();
    $.ajax({
        url: "../filecontent",
        type: "POST",
        dataType: "json",
        data: {path: getfile},
        success: function (data) {
            console.log(data);
            if (data.status === "200") {
                console.log("i am here");
                var file_content = JSON.parse(data.file_content);
                console.log(file_content);
                ParseFileData(file_content);

            } else {
                console.log("i am not here");
            }
        },
        error: function (e)
        {
            console.log('error');
        }
    });
//    ExportToTable(inputField);
});
function ParseFileData(data, fileType) {
    var $data_array = new Array();
    if (fileType === 1) {
        if (data.length > 0) {
            var $table_header = data[0];
            var row_count = 0;
            $.each(data, function (row_index, sheetdata) {
                if (row_index !== 0) {
                    var $get_array = {};
                    $.each($table_header, function (table_key_index, table_key_value) {
                        if (sheetdata[table_key_index]) {
                            $get_array[table_key_value] = sheetdata[table_key_index];
                        }
                    });
                    $get_array = JSON.parse(JSON.stringify($get_array));
                    if ($.isEmptyObject($get_array)) {
                    } else {
                        $data_array[(row_count)] = JSON.parse(JSON.stringify($get_array));
                        row_count++;
                    }
                }
            });
        }
        if (page_title === "product") {
            $data_array = parseFileDataWithTableTitle($data_array, 1);
        }
    } else {
        if (page_title === "product") {
            $data_array = parseFileDataWithTableTitle(data);
        } else {
            $data_array = data;
        }
    }

    if (page_title === 'basic_info') {
        file_all_data = [$.extend(true, {}, returnPure($data_array[0]))];
    } else {
        file_all_data = [$.extend(true, {}, returnPure($data_array))];
    }
    filedata = $data_array;
    var defined_fields = [];
    defined_fields = returnPure(sz_info[page_title]);
    var count = 0;
    $.each(defined_fields, function (index, value) {
        if (value in filedata[0]) {
            sz_map[count] = {'define_value': value, 'file_value': value};
            var html = '<li><a dataindex="' + (count) + '">' + sz_map[count]['file_value'] + ' => ' + sz_map[(count)]['define_value'] + '</a>&nbsp;<i  class="fa fa-trash remove_it" data-toggle="tooltip" data-placement="top" dataindex="' + (count) + '" title="Delete"></i></li>';
            $("#show_linked_value").append(html);
            delete filedata[0][value];
            defined_fields.splice(defined_fields.indexOf(value), 1);
            count++;
        }
    });
    loadinfo(defined_fields);
    if (filedata.length > 0) {
        var append_data_html = '';
        $.each(filedata[0], function (index, value) {
            if (index != '__rowNum__') {
                append_data_html += '<li><a>' + index + '</a></li>';
            }
        });
        $("#show_file_value").html(append_data_html);
    } else {
        $("#show_file_value").html('<li><a>No Data Found.</a></li>');
    }
}
function ExportToTable(inputField) {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
    var read_data = [];
    if (regex.test(inputField.val().toLowerCase())) {
        var xlsxflag = false;
        if (inputField.val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            read_data = reader.addEventListener("load", function (e) {
                var data = e.target.result;
                if (xlsxflag) {
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                } else {
                    var workbook = XLS.read(data, {
                        type: 'binary'
                    });
                }
                var sheet_name_list = workbook.SheetNames;
                var cnt = 0;
                sheet_name_list.forEach(function (y) {
                    if (xlsxflag) {
                        var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    } else {
                        var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                    }
                    console.log(exceljson);
                    if (exceljson.length > 0 && cnt === 0) {
                        ParseFileData(exceljson);
                        cnt++;
                    }
                });
                return read_data;
            });
            if (xlsxflag) {
                reader.readAsArrayBuffer(inputField[0].files[0]);
            } else {
                reader.readAsBinaryString(inputField[0].files[0]);
            }
        } else {
            alert("Sorry! Your browser does not support HTML5!");
        }
    } else {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
        if (regex.test(inputField.val().toLowerCase())) {
            var reader = new FileReader();
            reader.readAsText(inputField[0].files[0]);
            reader.addEventListener("load", function (event) {
                var csv = event.target.result;
                var data = $.csv.toArrays(csv);
                console.log(data);
                ParseFileData(data, 1);
            });
        } else {
            alert("File Formate is Invalid");
        }
    }
    return read_data;
}
function loadinfo(page_title) {
    $("#show_define_value").html("");
    append_data = "";
    $.each(page_title, function (index, value) {
        append_data += '<li><a>' + value + '</a></li>';
    });
    $("#show_define_value").html(append_data);
}
function returnPure(data) {
    var newPersonObj = JSON.parse(JSON.stringify(data));
    return newPersonObj;
}
function parseFileDataWithTableTitle(data, filetype) {
    datainfo = new Array();
    datainfo['products'] = [];
    datainfo['categories'] = [];
    var categories = 0;
    var productcount = 0;
    var categorytcount = 0;
    $.each(data, function (index, value) {
        var objkey = Object.keys(value)[0];
        if (value[objkey] == "categories") {
            categories = 1;
        }
        if (categories == 0) {
            datainfo['products'][productcount] = value;
            productcount++;
        } else {
            datainfo['categories'][categorytcount] = value;
            categorytcount++;
        }
    });
    other_data = datainfo;
    return datainfo['products'];
}
