/* Scripts for the Thomson PR
   Author: Maggie Wachs, www.filamentgroup.com
   Date: November 2011
   Dependencies: jQuery, jQuery UI widget factory
   Notes:
      This version is customized for Thomson PR Platform.
*/


(function( $ ) {
  $.widget( "filament.table", { // need to come up with a better namespace var...
 
    options: { 
      idprefix: null,   // specify a prefix for the id/headers values
      persist: null, // specify a class assigned to column headers (th) that should always be present; the script not create a checkbox for these columns
      checkContainer: null // container element where the hide/show checkboxes will be inserted; if none specified, the script creates a menu
    },
 
    // Set up the widget
    _create: function() {
      var self = this,
            o = self.options,
            table = self.element,
            thead = table.find("thead"),
            tbody = table.find("tbody"),
            hdrCols = thead.find("th"),
            bodyRows = tbody.find("tr"),
            container = o.checkContainer ? $(o.checkContainer) : $('<div class="table-menu table-menu-hidden" />');         
      
      // add class for scoping styles - cells should be hidden only when JS is on
      table.addClass("enhanced");
      
      hdrCols.each(function(i){
         var th = $(this),
               id = th.attr("id"), 
               classes = th.attr("class");
         
         // assign an id to each header, if none is in the markup
         if (!id) {
            id = ( o.idprefix ? o.idprefix : "col-" ) + i;
            th.attr("id", id);
         };
         
         // assign matching "headers" attributes to the associated cells
         // TEMP - needs to be edited to accommodate colspans
         bodyRows.each(function(){
            var thisRow = $(this).find("th, td").eq(i);                        
            thisRow.attr("headers", id);
            if (classes) { thisRow.addClass(classes); };
         });     
         
         // create the hide/show toggles
         if ( !th.is("." + o.persist) ) {
	         var toggle = $('<div><input type="checkbox" name="toggle-cols" id="toggle-col-'+i+'" value="'+id+'" /> <label for="toggle-col-'+i+'">'+th.text()+'</label></div>');
	         
	         if (classes) { toggle.addClass(classes); };
	         
	         container.append(toggle);         
	         
	         toggle.find("input")
	            .change(function(){
	               var input = $(this), 
	                  val = input.val(), 
	                  cols = $("#" + val + ", [headers="+ val +"]");
	               
	               if (input.is(":checked")) { cols.show(); }
	               else { cols.hide(); };		
	            })
	            .bind("updateCheck", function(){
	               if ( th.css("display") ==  "table-cell") {
	                  $(this).attr("checked", true);
	               }
	               else {
	                  $(this).attr("checked", false);
	               }
	            })
	            .trigger("updateCheck");  
			};          
               
      }); // end hdrCols loop 
      
      // update the inputs' checked status
      $(window).bind("orientationchange resize", function(){
         container.find("input").trigger("updateCheck");
      });      
            
      // if no container specified for the checkboxes, create a "Display" menu      
      if (!o.checkContainer) {
         var menuWrapper = $('<div class="table-menu-wrapper" />'),
               menuBtn = $('<a href="#" class="table-menu-btn">Display</a>'),
               menuClose = $('<a href="#" class="table-menu-close">Done</a>');
               
         menuBtn.click(function(){
            container.toggleClass("table-menu-hidden");            
            return false;
         });
         
         menuClose.click(function(){
            container.toggleClass("table-menu-hidden");            
            return false;
         });
               
         container.append(menuClose);      
         menuWrapper.append(menuBtn).append(container);
         table.before(menuWrapper);
      };
      
      
              
   }, // end _create
    
   disable: function() {
		// TBD
	},

	enable: function() {
		// TBD
	}   
    
  });
}( jQuery ) );


$(function(){ // on DOM ready

   $("#tech-companies").table({
      idprefix: "co-",
      persist: "persist"
   });

});  // end DOM ready