$(document).ready(function () {

    var searchTable = $('#searchtable').DataTable();
    $(document).on('click', '#newbtn', function () {
        $("#collapseExample").collapse('toggle');
        $("#user-tables").collapse('toggle');
    });
    $(document).on('click', '#admin-search-user', function () {
        var formData = $("#frm-admin-search-user").serialize();
        $.ajax({
            type: "POST",
            url: web_site + '/admin/getSearchUser',
            data: formData, // serializes the form's elements.
            success: function (data)
            {
                searchTable.clear().draw();
                searchTable.rows.add(data.data).draw();
            }
        });
    });
    $(document).on('click', '#add-bad-word', function () {
        var formData = $("#frm-bad-word").serialize();
        $.ajax({
            type: "POST",
            url: web_site + '/admin/bad/words/save',
            data: formData, // serializes the form's elements.
            success: function (data)
            {
                location.reload();
            }
        });
    });
    $(document).on('click', "#edit-bad-word", function () {
        var wordRecord = $(this).attr('data-bad-record');
        wordRecord = $.parseJSON(wordRecord);
        $("#badWord").val(wordRecord.bad_word);
        $("#wordId").val(wordRecord.id);
        if (wordRecord.is_active == 1) {
            $("#isActive").prop('checked', true);
        } else {
            $("#isActive").prop('checked', false);
        }

        $("#collapseExample").collapse('show');
    });


    $(document).on('click', '#admin-search-invoice', function () {
        var formData = $("#frm-admin-search-user").serialize();
        $.ajax({
            type: "GET",
            url: web_site + '/admin/searchtransaction',
            data: formData, // serializes the form's elements.
            success: function (data)
            {
                data.records = $.parseJSON(data.records);
                searchTable.clear().draw();
                searchTable.rows.add(data.records).draw();
            }
        });
    });


    $(document).on('click', '#home-tab', function () {
        if ($("#collapseExample").hasClass('show')) {
            $("#collapseExample").collapse('toggle');
            $("#user-tables").collapse('toggle');
        }
    });
    $(document).on('click', '#profile-tab', function () {
        if ($("#collapseExample").hasClass('show')) {
            $("#collapseExample").collapse('toggle');
            $("#user-tables").collapse('toggle');
        }
    });
});