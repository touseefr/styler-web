$(function(){
	var $navTab;
	/**
     * Javascript cachable variable
     * Store product page navigation list
     */
    $navTab = $('#navTab');

    /**
     * [setActiveTab description]
     * @author Mohan Singh
     */
    var setActiveTab = function() {
        var activeTab = '#primary-section';
        if (activeTab === '#gallery') {
            $('#addProductImage').removeClass('hide');
            $("#addProduct").addClass('hide');
            //return;
        }else {
           $('#addProduct').removeClass('hide');
           $("#addProductImage").addClass('hide');
        }
        $navTab.find('a').removeClass('active'); 
        $('.tab-content').find('.tab-pane').removeClass('active');
        $('a[href="' + activeTab + '"]').addClass('active');
        $(activeTab).addClass('active');
        $(activeTab).tab('show');
       
    }();

   
    /**
     * [description]
     * @author Mohan Singh
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    $navTab.on('click', 'a', function(event) {
       
       event.preventDefault();
       if ($(this).hasClass('disabled')) {
            return false;
        }
		$(this).addClass('active').siblings().removeClass('active');
		$($(this).attr('href')).show().siblings().hide();
		setPanelTitle($(this).text());
       /* event.preventDefault();
        if ($(this).hasClass('disabled')) {
            return false;
        }
        if ($(this).attr('href') === '#gallery') {
            $('#addProductImage').removeClass('hide');
            $("#addProduct").addClass('hide');
        }else {
            if ($('#addProduct').hasClass('hide')) {
                $('#addProduct').removeClass('hide');
                $("#addProductImage").addClass('hide');
            }
        }
        //Change panel title
        setPanelTitle($(this).text());
        $navTab.find('a').removeClass('active');
        $(this).addClass('active');
        $(this).tab('show');
        Cookies.set('currentTab', $(this).attr('href'));*/
    });

    /**
     * [setPanelTitle description]
     * @author Mohan Singh
     * @param  {[type]} title [description]
     */
    var setPanelTitle = function(title) {
        if (typeof title === 'undefined') return;
        $panel = $('#pageTitle');
        $($panel).text(title);
    };

    /**
     * Set default panel title
     */
    //setPanelTitle($navTab.find('a.active').text());
   
    $(".select2").select2({
        placeholder : "Search for location",
        allowClear: false,
        ajax: {
            url: "/locations/",
            dataType: 'json',
            delay: 250,
            data: function (params) {
              return {
                q: params.term
              };
            },
            processResults: function (data, params) {
             console.log(data);
              // parse the results into the format expected by Select2
              // since we are using custom formatting functions we do not need to
              // alter the remote JSON data, except to indicate that infinite
              // scrolling can be used
              params.page = params.page || 1;
              return {
                results: data.map(function(item) {
                                return {
                                    id : item.id,
                                    text : item.name
                                };
                            }
                )};
            },
            cache: true
        },
    minimumInputLength: 3
    });

});