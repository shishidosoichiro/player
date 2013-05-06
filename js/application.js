$(function(){
	var source = [
		'http://vimeo.com/59361603'
		,'http://www.youtube.com/watch?v=yb512wSjyVs'
	];
	$('.url').typeahead({'source':source});
	
	var $el = $('.player');
	$('.inject .dropdown-menu a').on('click', function(e){
		e.preventDefault();
		$('.inject .url').val($(e.target).text());
	});
	$('.inject').on('submit', function(e){
		e.preventDefault();
		$el.player({url:$('.url').val()});
	});
	
	$('.stop').on('click', function(e){
		$el.player('stop');
	});
	$('.play').on('click', function(e){
		$el.player('play');
	});
	$('.pause').on('click', function(e){
		$el.player('pause');
	});
	$('.seek').on('click', function(e){
		$el.player('seek', $(this).siblings('.degree').val());
	});
	$('.volume').on('click', function(e){
		$el.player('volume', $(this).siblings('.degree').val());
	});

	$('.player').height($('.player').width() * 9/16);
	$el.on('ready', function(event, player){
		log('ready');
		$('.player iframe').height($('.player').width() * 9/16);
		if ($('.inject .auto').prop('checked')) player.play();
	});
	$el.on('play', function(){
		log('play');
	});
	$el.on('paused', function(){
		log('pause');
	});
	$el.on('playing', function(){
		log('playing');
	});
	$el.on('playing', function(){
		log('pause');
	});
	$el.on('error', function(){
		log('error');
	});
	
	function log(text, detail) {
		detail = detail ? detail : '';
		$('.log').append($('<tr><td>' + text + '</td><td>' + detail + '</td></tr>'));
	}
	
});
