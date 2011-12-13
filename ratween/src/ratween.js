/*
 * ratween jQuery plugin
 * http://en.kuma-de.com/
 * css3 transition by javascript
 *
 * Copyright 2011, Tasuku Maeda @enKinkumaDesign
 * MIT license
 * ver 0.2
 */

(function($){
	var prefixes = ['webkit', 'moz', 'o', 'MS'];
	var i;
	
	var callbackEvent = [];
	for(i = -1; i < prefixes.length; i++){
		if(i == -1){
			callbackEvent.push('transitionend');
		}else{
			if(prefixes[i] != 'moz'){
				callbackEvent.push(prefixes[i] + 'TransitionEnd');
			}
		}
	}
	
	var easingsBezier = {
		lenear:			'0.00,0.00,1.00,1.00',
		easeinsine:		'0.42,0.00,1.00,1.00',
		easeoutsine:	'0.00,0.00,0.58,1.00',
		easeinoutsine:	'0.42,0.00,0.58,1.00',
		easeinquad:		'0.62,0.12,1.00,1.00',
		easeoutquad:	'0.00,0.00,0.48,0.88',
		easeinoutquad:	'0.62,0.12,0.48,0.88',
		easeincubic:	'0.80,0.00,1.00,1.00',
		easeoutcubic:	'0.00,0.00,0.20,1.00',
		easeinoutcubic:	'0.80,0.00,0.20,1.00',
		easeinquart:	'1.00,0.00,1.00,0.84',
		easeoutquart:	'0.00,0.17,0.00,1.00',
		easeinoutquart:	'0.50,0.00,0.50,0.00',
		easeinquint:	'1.00,0.00,1.00,0.46',
		easeoutquint:	'0.00,0.54,0.00,0.00',
		easeinoutquint: '0.83,0.00,0.17,0.00',
		easeinexpo:		'1.00,0.00,1.00,0.00',
		easeoutexpo:	'0.00,1.00,0.00,1.00',
		easeinoutexpo:	'1.00,0.00,1.00,0.00'
	};
	
	var removeTransition = function(target){
		var removeprop = {};
		var prefix;
		for(i = -1; i < prefixes.length; i++){
			if(i == -1){
				prefix = '';
			}else{
				prefix = '-' + prefixes[i].toLowerCase() + '-';
			}
			removeprop[prefix + 'transition-property'] = 'none';
		}
		target.css(removeprop);
	};
	
	var methods = {
		start:function(props, options){
			var settings = $.extend({
				'time': 1,
				'easing': 'lenear',
				'delay': 0,
				'callback':function(){}
			}, options);
			
			settings.bezier = 'cubic-bezier(' + easingsBezier[settings.easing.toLowerCase()] +')';
			
			var propsKeys = [];
			for(var key in props){
				if(props[key] != this.css(key)){
					propsKeys.push(key);
				}
			}
			
			var prefix;
			for(i = -1; i < prefixes.length; i++){
				if(i == -1){
					prefix = "";
				}else{
					prefix = '-' + prefixes[i].toLowerCase() + '-';
				}
				props[prefix + 'transition-property'] = propsKeys.join(',');
				props[prefix + 'transition-duration'] = settings.time + 's';
				props[prefix + 'transition-timing-function'] = settings.bezier; 
				props[prefix + 'transition-delay'] = settings.delay + 's';
			}
			
			var self = this;
			var callbackEvents = callbackEvent.join(' ');
			var finishCnt = 0;
			return this.each(function(){	
				$(this).bind(callbackEvents, function(){
					finishCnt++;
					if(finishCnt == propsKeys.length){
						self.unbind(callbackEvents);
						removeTransition(self);
						settings.callback();
					}
				}).css(props);
			});
		},
		stop:function(){
			return this.each(function(){
				removeTransition($(this));
			});
		},
		pause:function(){
			return this.each(function(){
				var propNameStr;
				var prefix;
				var target = $(this);
				for(i = -1; i < prefixes.length; i++){
					if(i == -1){
						prefix = '';
					}else{
						prefix = '-' + prefixes[i].toLowerCase() + '-';
					}
					propNameStr = target.css(prefix + 'transition-property');
					if(propNameStr){
						break;
					}
				}
				var propNames = propNameStr.split(',');
				var currentProps = {};
				var key;
				for(i = 0; i < propNames.length; i++){
					key = propNames[i].replace(/\s/i, '');
					currentProps[key] = target.css(key);
				}
				removeTransition(target);
				target.css(currentProps);
			});
		}
	};
	$.fn.ratween = function(method){
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof method == 'object'){
			return methods.start.apply(this, arguments);
		}else{
			$.error('Method ' + method + ' does not exist on jQury.ratween');
		}
	};
})(jQuery);
