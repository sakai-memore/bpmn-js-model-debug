/*
Usages: 
$(selector).classList() //returns an array of classnames
$(selector).classList('newclass') //replaces the current element's classes
$(selector).classList(['new', 'class', 'names']) //replaces the current element's classes
*/
import jQuery from 'jquery';

jQuery.fn.extend({
  classList: function( value ) {
    if( value ){
      if( jQuery.isArray(value)){
        this.attr('class', '')
        for(var i in value){
          this.addClass(value[i])
        }
        return this;
      }
      if( typeof value == 'string'){	      
        this.attr('class', '').addClass(value);
        return this;
      }
    }
    return this.attr('class').split(/\s+/)
  }
});

export default jQuery
