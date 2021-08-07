$(function(){

	$('.services label.tree-toggler').on('click',function () {
		$(this).parent().parent().children('ul.tree').show(300);
		var _icon =  $(this).siblings('.collapse-icon').find('i');
		_icon.removeClass( "fa-plus-circle" ).addClass( "fa-minus-circle" )

	});

	$('.services .collapse-icon').on('click',function () {
		$(this).parent().parent().children('ul.tree').slideToggle(300);
		var _icon = $(this).find('i');
		_icon.toggleClass( "fa-plus-circle" ).toggleClass( "fa-minus-circle" )
	});
});