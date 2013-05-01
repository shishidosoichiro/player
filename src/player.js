/**
 *
 * Player jQuery plugin
 *
 * Player jQuery plugin provides a common interface to Youtube and Vimeo Player API.
 * 
 *
 * Version : 0.0.1
 * Author : Shishido Soichiro
 *
 */
(function(window, $){
	"use strict";
	var Player = (function(){
		var util = {
			_reg: /(?:^|&)([^&=]*)=?([^&]*)/g
			,_parser: window.document.createElement('a')
			,url: function(url){
				if (url.parsed) return url.parsed;
				this._parser.href = url;
				
				var parsed = {
					protocol: this._parser.protocol,
					hostname: this._parser.hostname,
					port: this._parser.port,
					pathname: this._parser.pathname,
					search: this._parser.search.substr(1),
					hash: this._parser.hash,
					host: this._parser.host  
				};

				parsed.query = {};
				parsed.search.replace(this._reg, function ($0, $1, $2) {
					if ($1) parsed.query[$1] = $2;
				});
				return parsed;
			}
			,overwrite: function(target, by){
				var merged = {};
				for (var key in target) merged[key] = target[key];
				for (key in by) merged[key] = by[key];
				return merged;
			}
			,id: function() {return 'player-' + Math.floor(Math.random() * 100000)}
		};
		var factory = function($el, options){
			return factory.create($el, options);
		};
		factory.classes = {};
		factory.create = function($el, options){
			var url = util.url(options.url);
			var Class = this.get(url.host) 
			return new Class($el, options);
		};
		factory.get = function(host){
			var cls = this.classes[host];
			if (!cls) throw {message:'unknown host'};
			return cls;
		};
		factory.register = function(cls){this.classes[cls.host] = cls};
		factory.util = util;
		
		return factory;
	})();
	window.Player = Player;

 /* ALERT PLUGIN DEFINITION
	* ======================= */

	var old = $.fn.player

	$.fn.player = function (option, option2) {
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('player')
			if (!data) $this.data('player', (data = Player.create($this, option)))
			else if (typeof option == 'object') $this.data('player', (data = Player.create($this, option)))
			if (typeof option == 'string') data[option](option2)
		})
	}

})(window, window.jQuery);
