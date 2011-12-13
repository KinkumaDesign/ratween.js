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
		
		easeinsine:		'0.44,0,0.99,0.98', 
		easeoutsine:	'0,0.44,0.98,0.99', 
		easeinoutsine:	'0.36,0,0.64,1',
		easeoutinsine:	'0,0.36,1,0.64',
		
		easeinquad:		'0.51,0,0.96,0.9',
		easeoutquad:	'0,0.51,0.9,0.96',
		easeinoutquad:	'0.43,0,0.57,1',
		easeoutinquad:	'0,0.43,1,0.57',
		
		easeincubic:	'0.55,0,0.7,0.19',
		easeoutcubic:	'0,0.55,0.19,0.7',
		easeinoutcubic:	'0.7,0,0.3,1',
		easeoutincubic:	'0,0.7,1,0.3',
		
		easeinquart:	'0.74,0,0.74,0.19',
		easeoutquart:	'0,0.74,0.19,0.74',
		easeinoutquart:	'0.85,0,0.13,0.99',
		easeoutinquart:	'0,0.85,0.99,0.13',
		
		easeinquint:	'0.79,0,0.75,0.1',
		easeoutquint:	'0,0.79,0.1,0.75',
		easeinoutquint: '0.9,0,0.09,1',
		easeoutinquint:	'0,0.9,1,0.09',
		
		easeinexpo:		'0.81,0,0.83,0.11',
		easeoutexpo:	'0,0.81,0.11,0.83',
		easeinoutexpo:	'0.97,0,0.02,0.99',
		easeoutinexpo:	'0,0.97,0.99,0.02',
		
		easeincirc:		'0.67,0,0.99,0.57',
		easeoutcirc:	'0,0.67,0.57,0.99',
		easeinoutcirc:	'0.92,0.15,0.08,0.82',
		easeoutincirc:	'0.15,0.92,0.82,0.08'
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
