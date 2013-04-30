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
			if (typeof option == 'object') $this.data('player', (data = Player.create($this, option)))
			if (typeof option == 'string') data[option](option2)
		})
	}

})(window, window.jQuery);

/**
 * Vimeo
 */
(function(window, $){

	"use strict";
	var util = window.Player.util;
	var libraryUrl = 'http://a.vimeocdn.com/js/froogaloop2.min.js';
	var playerUrl = 'http://player.vimeo.com/video{{videoId}}?api=1&player_id={{id}}';
	var Player = function($el, options){
		this.$el = $el;
		this.options = options;
		this.deferred = $.Deferred();
		this.promise = this.deferred.promise();

		var that = this;
		var id = util.id();
		var url = util.url(options.url);
		var src = playerUrl.replace('{{videoId}}', url.pathname).replace('{{id}}', id);
		// load library
		$.getScript(libraryUrl).then(function(){
			var iframe = $('<iframe />').attr({'id': id, 'src': src, 'width': '100%', 'height': '100%', 'frameborder': '0'}).appendTo($el.empty())[0];
			that.inner = $f(iframe);
			that.inner.addEvent('ready', function(id){that.ready(id)});
		});
	};
	Player.host = 'vimeo.com';
	Player.prototype = {
		play: function() {return this.then(this._play, arguments)}
		,pause: function() {return this.then(this._pause, arguments)}
		,seek: function() {return this.then(this._seek, arguments)}
		,stop: function() {return this.then(this._stop, arguments)}
		,volume: function() {return this.then(this._volume, arguments)}
		,then: function(callback, args) {
			var that = this;
			return this.promise.then(function(){callback.apply(that, args)});
		}
		,_play: function(seek) {
			if (seek) {
				this.inner.api('play');
				this.inner.api('seekTo', seek);
			}
			else {
				this.inner.api('play');
			}
		}
		,_pause: function() {
			this.inner.api('pause');
		}
		,_seek: function(seek) {
			this.inner.api('seekTo', seek);
			this.$el.trigger('seek', this);
		}
		,_stop: function() {
			this.inner.api('unload');
			this.$el.trigger('clear', this);
		}
		,_volume: function(volume) {
			var volume = volume / 100;
			this.inner.api('setVolume', volume);
		}
		,ready: function(id) { 

			var that = this;
			this.inner.addEvent('finish', function(){that.$el.trigger('end', that)});
			this.inner.addEvent('play', function(){that.$el.trigger('play', that)});
			this.inner.addEvent('pause', function(){that.$el.trigger('paused', that)});
			this.inner.addEvent('loadProgress', function(){that.$el.trigger('buffering', that)});
			this.inner.addEvent('playProgress', function(){that.$el.trigger('playing', that)});

			this.$el.trigger('ready', this);
			this.deferred.resolve();
			if(this.options.seek) this.play(this.options.seek);
		}
		,error: function(e) { 
			this.$el.trigger('error', this, e);
		}
	};
	window.Player.register(Player);

})(window, window.jQuery);


/**
 * Youtube
 */
(function(window, $){

	"use strict";
	var util = window.Player.util;
	var libraryUrl = 'https://www.youtube.com/iframe_api';
	var Player = function($el, options){
		this.$el = $el;
		this.options = options;
		this.deferred = $.Deferred();
		this.promise = this.deferred.promise();

		var that = this;
		var id = util.id();
		var url = util.url(options.url);
		var $container = $("<div />").attr({"id": id, 'width': "100%", 'height': '100%'}).appendTo($el.empty());

		$.getScript(libraryUrl);
		Player.libraryDeferred.then(function(){
			var options = util.overwrite(defaults, that.options);
			options = util.overwrite(options, {
				videoId: url.query.v
				,events: { 
					'onReady': function(e){that.ready(e)}
					,'onStateChange': function(e){that.change(e)}
					,'onError': function(e){that.error(e)}
				} 
			});
			that.inner = new window.YT.Player(id, options);
		});
	};
	Player.host = 'www.youtube.com';
	Player.libraryDeferred = $.Deferred();
	var defaults = {
		playerVars: {
			'enablejsapi': 1
			,'wmode': 'transparent'
		}
	};
	Player.prototype = {
		play: function() {return this.then(this._play, arguments)}
		,pause: function() {return this.then(this._pause, arguments)}
		,seek: function() {return this.then(this._seek, arguments)}
		,stop: function() {return this.then(this._stop, arguments)}
		,volume: function() {return this.then(this._volume, arguments)}
		,then: function(callback, args) {
			var that = this;
			return this.promise.then(function(){callback.apply(that, args)});
		}
		,_play: function(seek) {
			if(seek) { 
				this.inner.seekTo(seek, false);
			}
			else {
				this.inner.playVideo();
			}
			this.$el.trigger('play', this);
		}
		,_pause: function() {
			this.inner.pauseVideo();
		}
		,_seek: function(seek) {
			this.inner.seekTo(seek, false);
			this.$el.trigger('seek', this);
		}
		,_stop: function() {
			this.inner.stopVideo();
			this.$el.trigger('stop', this);
		}
		,_volume: function(volume) {
			this.inner.setVolume(volume);
		}
		,ready: function(e) { 
			this.$el.trigger('ready', this);
			this.deferred.resolve();
			if(this.options.seek) this.play(this.options.seek);
		}
		,error: function(e) { 
			this.$el.trigger('error', this, e);
		}
		,change: function(e) {
			if ( e.data == window.YT.PlayerState.ENDED ) this.$el.trigger('end', this);
			else if ( e.data == window.YT.PlayerState.PLAYING ) this.$el.trigger('playing', this);
			else if ( e.data == window.YT.PlayerState.PAUSED ) this.$el.trigger('paused', this);
			else if ( e.data == window.YT.PlayerState.BUFFERING ) this.$el.trigger('buffering', this);
			else if ( e.data == window.YT.PlayerState.CUED ) this.$el.trigger('cued', this);
		}
	};
	window.Player.register(Player);
})(window, window.jQuery);

function onYouTubeIframeAPIReady() {
	window.Player.get('www.youtube.com').libraryDeferred.resolve();
}
