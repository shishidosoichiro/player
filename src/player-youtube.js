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
