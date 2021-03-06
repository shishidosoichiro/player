# [Player jQuery plugin]

Player jQuery plugin provides a common interface to Youtube and Vimeo Player API. Demo page is [here](http://shishidosoichiro.github.com/player).


## Quick start

```html
<script src="/js/player.js"></script>
```

```javascript
$('.player').player({url:'http://www.youtube.com/watch?v=yb512wSjyVs'});
$('.player').on('end', function(player){
	alert('ended!');
});
```

## Supported players

* Youtube 
* Vimeo

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

### stop()

### seek(seekTime)

## Author

**Shishido Soichiro**

+ [http://twitter.com/shishidohinata](http://twitter.com/shishidohinata)
+ [http://github.com/shishidosoichiro](http://github.com/shishidosoichiro)



## License

Player jQuery plugin available under MIT license
