
# [Player]

Player is video player for youtube.com and so on...


## Caution!!

I don't test this yet. wait a while...

## Quick start

```html
<script src="/js/player.js"></script>
```

```javascript
var player = Player({'$el':$('.player'), url:'http://www.youtube.com/watch?v=yb512wSjyVs'});
player.play();
$('.player').on('end', function(player){
	alert('ended!');
});
```

## Supported players

* Youtube 
* Vimeo()

## Events

### stop
### clear
### ready
### error
### end
### playing
### paused
### buffering
### cued

## Options

## Methods

### play(options)

play a loaded video.options are:

* $el: jQuery object 
* url: video's url(ex:http://www.youtube.com/watch?v=yb512wSjyVs)
* seek: seek time

### stop()

start a video.

### seek(seekTime)

seek a video to seekTime.

## Author

**Shishido Soichiro**

+ [http://twitter.com/shishidohinata](http://twitter.com/shishidohinata)
+ [http://github.com/shishidosoichiro](http://github.com/shishidosoichiro)



## License

deferred available under MIT license
