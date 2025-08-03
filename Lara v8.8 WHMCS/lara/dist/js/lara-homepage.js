/*
 * @package    WHMCS
 * @author     Amr M. Ibrahim <mailamr@gmail.com>
 * @copyright  Copyright (c) WHMCSAdminTheme 2016
 * @link       http://www.whmcsadmintheme.com
 */

(function() {
	
$(document).ready(function(){
	var lrDebug     = false;

	
	function lrIsTablet(){
		var isTablet = false;
		if ($(".lara-tablet-size-detector").is(":visible")){
			isTablet = true;
		}
		if (lrDebug){console.log("isTablet: "+isTablet);}
		return isTablet;
	}
	
	function toggleWidgetResizeButtons(){
		var isTablet = lrIsTablet();
		$(".lr-dashboard-panel-item .widget-tools .lara-show-resize").each(function( index ) {
			var cSize = $(this).parents('div.lr-dashboard-panel-item').attr("data-item-columns");
			var expandObj   = $( this ).children(".lrgawidget-expand");
			var compressObj = $( this ).children(".lrgawidget-compress");
			cSize = parseInt(cSize);
			if (isTablet){
				if (cSize < 3 ){ expandObj.show(); compressObj.hide();}
				else { compressObj.show(); expandObj.hide();}	
			}else{
				if (cSize < 4 ){ expandObj.show(); }else{ expandObj.hide();}
				if (cSize > 1 ){ compressObj.show();}else{compressObj.hide();}
			}
		});		
	}
	toggleWidgetResizeButtons();
	
	function doWidgetResizeAction(obj){
		var isTablet = lrIsTablet();
		var wObj  = $( obj ).parents("[data-larawidget]");
		var cAction = $( obj ).data('lrwidgetools');
		var cSize = parseInt(wObj.attr("data-item-columns"));
		var nSize = 0;
		if (isTablet){
			if (cAction == "expand" ){ nSize = 4;}
			if (cAction == "compress" ){ nSize = 2;}
		}else{
			if (cAction == "expand" ){ nSize = cSize + 1;}
			else if (cAction == "compress" ){ nSize = cSize - 1;}
		}
		wObj.removeClass('lr-dashboard-panel-item-columns-'+cSize).addClass('lr-dashboard-panel-item-columns-'+nSize);
		wObj.attr("data-item-columns", nSize);
		toggleWidgetResizeButtons();
		lrpckry.layout();
	}

	function lrSaveHomeWidgets(){
	  if (lrDebug){console.log("Saving");}
	  var positions = lrpckry.getShiftPositions('data-item-id');
	  setThemeSettings({'mode': 'update', 'widgets_order': JSON.stringify(positions)});
	  isSavinglayoutComplete = false;
	  
	}	
	
	$(".lr-home-widgets-container").on('click', "[data-lrwidgetools='expand']", function (e){
		e.preventDefault();
		doWidgetResizeAction(this);
	});	
	
	$(".lr-home-widgets-container").on('click', "[data-lrwidgetools='compress']", function (e){
		e.preventDefault();
		doWidgetResizeAction(this);
	});	
	
	Packery.prototype.getShiftPositions = function( attrName ) {
	  var _this = this;
	  return this.items.map( function( item ) {
		return {
		  id: item.element.getAttribute( attrName ).replace("key_",""),
		  name: item.element.getAttribute( "data-larawidget" ),
		  size: item.element.getAttribute( "data-item-columns" )
		}		  
	  });
	};

	// init Packery
	var lrgrid = document.querySelector('.lr-home-widgets-container');
	var lrpckry = new Packery( lrgrid, {
		itemSelector: '.lr-dashboard-panel-item',
		columnWidth: '.lr-dashboard-panel-sizer',
		percentPosition: true,
	});

	// init draggable
	var items = lrgrid.querySelectorAll('.lr-dashboard-panel-item');
	for ( var i=0; i < items.length; i++ ) {
	  var itemElem = items[i];
	  var draggie = new Draggabilly( itemElem, {handle: '.panel-title'} );
	  lrpckry.bindDraggabillyEvents( draggie );
	}


	// Listeners
	lrpckry.on( 'dragItemPositioned', function() {
		lrpckry.layout();
	});
	
	lrpckry.on( 'removeComplete', function() {
		lrpckry.layout();
	});
	
	var isSavinglayoutComplete = false;
	lrpckry.on( 'layoutComplete', function( laidOutItems ) {
		if (!$(".lr-home-widgets-container").children("div.lr-dashboard-panel-item").hasClass('is-dragging')){
			if (lrDebug){console.log("layoutComplete");}
			if (!isSavinglayoutComplete) {
				isSavinglayoutComplete = true;
				setTimeout(function () {
					lrSaveHomeWidgets();
					
				}, 1000);			
			}			
		}
	});

	$("[data-lrwidgetools='remove']").on('click', function (e) {
		e.preventDefault();
		var wObj = $( this ).parents("[data-larawidget]");
		var containerType = wObj.parents("[data-laracontainer]").data("laracontainer");
		var wID = wObj.data("larawidget");
		var sArr = {mode: 'update'};
		sArr[wID+'_state']= 'closed';
		if (containerType == "flex"){
			lrpckry.remove(wObj);
		}else{
			wObj.slideUp("slow", function() { $(this).remove(); } );
		}
		$("input[data-widget-state='"+wID+"']").attr("checked", false);
		setThemeSettings(sArr);
	});
	
    $("[data-widget-state]").on('click', function () {
		var sArray = {mode: 'update'};
		var wID = $(this).data('widget-state');
		var wObj = $("[data-larawidget='"+wID+"']");
		var containerType = wObj.parents("[data-laracontainer]").data("laracontainer");
		if ($(this).is(":checked")){
			sArray[wID+'_state']= 'open';
			$('[data-widgets-settings="save"]').prop('disabled', false);
		}else{
			if (containerType == "flex"){
				lrpckry.remove(wObj);
			}else{
				wObj.slideUp("slow", function() { $(this).remove(); } );
			}
			sArray[wID+'_state']= 'closed';
		}
		setThemeSettings(sArray);		
    });	
	
	$("[data-widgets-settings]").on('click', function () {
		location.reload();
    });	



});
})();