var audio = $('audio').get(0)
var img = $('img').get(0)
var current = 0;
var length
var loop = false;
var $dom = {
    h1: $('h1'),
    h2: $('h2'),
    control_btn: $('#control-btn')
}
// 初始化
function init() {
    getMusic()
    eventHanlder()
}

// 事件绑定
function eventHanlder() {
    // play/pause按钮事件
    $dom.control_btn.on('click', function() {
        $this = $(this)
        if (audio.paused) {
            play()
        } else {
            pause()
        }
    });
    // 上一曲
    $('#pre-btn').on('click', function() {
        current <= 0 ? current =99 : current -= 1
        getMusic()

    })
    // 下一曲
    $('#next-btn').on('click', function() {
        current >= 99 ? current = 0 : current += 1

        getMusic()
    })
    // 单曲循环
    $('#repeat-btn').on('click', function() {
        $this = $(this)
        $this.addClass('active').next().removeClass('active')
        loop = true;
    })
    // 顺序播放
    $('#order-btn').on('click', function() {
        $this = $(this)
        $this.addClass('active').prev().removeClass('active')
        loop = false;
    })
    // 歌曲切换模式
    audio.onended = function() {
        if (loop) {
            getMusic();
        } else {
            current >= 99 ? current = 0 : current += 1
            
            getMusic()
        }
    }
    // 更新进度条,每50ms刷新一次
    setInterval(setProgressWidth,100)
    // 进度条控制
    $('.progress-wrap').on('mousedown',function(e){
      var mouseX=e.clientX
      // console.log(mouseX)
      var targetX=$(this).offset().left
      // console.log(targetX)
      var percentage = (mouseX - targetX)/$(this).width()*100
      console.log(audio.currentTime)
      console.log(audio.duration)
      audio.currentTime=audio.duration*percentage/100
    })
    // 进度条长度
    function setProgressWidth(){
      var length = audio.currentTime/audio.duration*100 //进度条长度
      // console.log(length)
	    $('.progress').width(length+'%')
      // console.log($('.progress').width())
    }
}


// 获得音乐数据
function getMusic() {
    var songData = {};
    $.ajax({
        type: "get",
        url: "https://music.qq.com/musicbox/shop/v3/data/hit/hit_all.js",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "JsonCallback",
        scriptCharset: 'GBK',
    }).done(function(data) {
        length=data.songlist.length;
        songData.singerName = data.songlist[current].singerName;
        songData.songName = data.songlist[current].songName
        songData.songId = data.songlist[current].id
        songData.imgId = data.songlist[current].albumId
        renderData(songData)
        audio.onerror = function() {
          $('.progress').width(0)
            alert('歌曲出错了，请换一首试试吧')
        }
        play()
    })
}
// 渲染数据到UI层
function renderData(data) {
    audio.src = 'http://ws.stream.qqmusic.qq.com/' + data.songId + '.m4a?fromtag=46';
    img.src = 'http://imgcache.qq.com/music/photo/album_500/' + data.imgId % 100 + '/500_albumpic_' + data.imgId + '_0.jpg'
    $dom.h1.html(data.songName)
    $dom.h2.html(data.singerName)
}


// 播放音乐
function play() {
    $dom.control_btn.removeClass('icon-play').addClass('icon-pause')
    audio.play()
}
// 暂停音乐
function pause() {
    $dom.control_btn.addClass('icon-play').removeClass('icon-pause')
    audio.pause();
}

init()
