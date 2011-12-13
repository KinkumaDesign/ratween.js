/*
 * ratween jQuery plugin
 * http://en.kuma-de.com/
 * css3 transition tween by javascript
 *
 * Copyright 2011, Tasuku Maeda @enKinkumaDesign
 * MIT license
 * ver 0.1
 */

(function($){
	$.fn.ratween = function(props, options){
		var settings = $.extend({
			'time': 1,
			'easing': 'lenear', //ease, ease-in, ease-out, ease-in-out
			'delay': 0,
			'callback':function(){}
		}, options);
		
		var propsKeys = [];
		for(var key in props){
			if(props[key] != this.css(key)){
				propsKeys.push(key);
			}
		}
		
		var prefix = ['webkit', 'moz', 'o', 'MS'];
		
		var callbackEvent = [];
		var prefix2;
		for(i = -1; i < prefix.length; i++){
			if(i == -1){
				prefix2 = "";
				callbackEvent.push('transitionend');
			}else{
				prefix2 = '-' + prefix[i].toLowerCase() + '-';
				if(prefix[i] != 'moz'){
					callbackEvent.push(prefix[i] + 'TransitionEnd');
				}
			}
			props[prefix2 + 'transition-property'] = propsKeys.join(',');
			props[prefix2 + 'transition-duration'] = settings.time + 's';
			props[prefix2 + 'transition-timing-function'] = settings.easing; 
			props[prefix2 + 'transition-delay'] = settings.delay + 's';
		}
		
		var self = this;
		var callbackEvents = callbackEvent.join(' ');
		var finishCnt = 0;	
		this.bind(callbackEvents, function(){
			finishCnt++;
			if(finishCnt == propsKeys.length){
				self.unbind(callbackEvents);
				var removeprop = {};
				var prefix2;
				for(i = -1; i < prefix.length; i++){
					if(i == -1){
						prefix2 = '';
					}else{
						prefix2 = '-' + prefix[i].toLowerCase() + '-';
					}
					removeprop[prefix2 + 'transition-property'] = 'none';
				}
				self.css(removeprop);
				settings.callback();
			}
		}).css(props);
		
		return this;
	}
})(jQuery);
