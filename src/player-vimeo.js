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

