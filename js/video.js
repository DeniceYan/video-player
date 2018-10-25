/**
 * Created by Administrator on 2018/10/22.
 */

    function VideoPlayer(options){
        this.config = {
            myVideo: document.getElementById('myVideo'),
            videoBox: '.videoBox',  // 视频box
            video0: '#myVideo',
            pre: '.pre', // 播放上一个按钮
            play: '.play', // 播放按钮
            next: '.next', // 播放下一个按钮
            progressBar: '#progressBar', // 进度框
            progress: '#progress', // 进度条
            bar: '#barPoint', // 进度条点
            currentTime: '#currentTime', // 当前时间
            duration: '#duration', // 总时长
            volumeMain: '.volumeBox', // 音量container
            volume: '.volume', // 音量按钮
            volumeBox: '.volume-main', // 音量盒子
            volumeProgress: '#volumeProgress', // 音量调节框
            volumeBar: '#volumeBar', // 音量调节钮
            playRateBox: '.playRate', // 播放速度
            currentRate: '.current-rate',
            rateBox: '.rateBox',
            fullscreen: '.fullscreen', // 全屏按钮
            loadingGif: '.waiting-gif',
            durationTime: '',
            playState: false,
            volumeDirection: true, // 音量方向，true为横向，false为竖向
            playRate: 1
        }

        this.init(options);
    }

    VideoPlayer.prototype = {
        init: function(options){
            this.config = $.extend(this.config, options || {});

            var self = this,
                _config = self.config;

            _config.myVideo.load(); // 一开始进入页面video不白屏

            // 监听视频的元数据已加载
            self._bindEvent(_config.myVideo, 'loadstart', function(){
                $('.waiting-gif').show();
            });
            // 监听视频的元数据已加载
            self._bindEvent(_config.myVideo, 'loadedmetadata', function(){
                $(_config.loadingGif).hide();
                _config.durationTime =  _config.myVideo.duration; // 秒数
                $(_config.duration).text(self._handlerTime(_config.durationTime));
                self._play();
            });
            // 进度条事件
            self._progress();
            // 点击进度条
            self._clickProgress();
            // 拖动进度条
            self._dragProgress();
            // 缓冲进度条
            self._bufferProgress();

            // 点击播放按钮事件
            self._clickPlayBtn();

            // 视频播放结束
            self._end();

            // 音量方向判断
            if(_config.volumeDirection){
                // 音量横向
                $(_config.progressBar).removeClass('more-progress');
                $(_config.volumeProgress).addClass('volume-progress');
                $(_config.volumeBar).addClass('volume-bar');
            }else{
                // 音量竖排
                $(_config.progressBar).addClass('more-progress');
                $(_config.volumeBox).addClass('l-box hide');
                $(_config.volumeProgress).addClass('volume-up');
                $(_config.volumeBar).addClass('bar-up');
            }

            // 音量大小初始化
            _config.myVideo.volume = 0.5;
            // 点击音量按钮事件
            self._clickVolumeBtn();
            // 点击音量条改变音量大小事件
            self._clickVolume();
            // 音量竖向条隐藏
            self._mouseLeave();

            // 设置视频播放速度
            _config.myVideo.playbackRate = _config.playRate;
            // 改变播放速度事件
            self._clickPlayRate();
            self._mouseLeaveRate();
            self._changePlayRate();

            // 点击全屏按钮事件
            self._clickFScreenBtn();

            // 退出全屏事件，监听keydown事件，ESC键值27
            self._bindEvent(document, 'keydown', function(e){
                if(e.which == 27){
                    $(_config.videoBox).removeClass('video-full');
                }
            });

        },
        /*
         * 播放视频
         */
        _play: function(){
            var self = this,
                _config = self.config;

            _config.myVideo.play();
            $(_config.play).attr('src','img/play.png');
        },
        /*
         * 暂停视频
         */
        _pause: function(){
            var self = this,
                _config = self.config;

            _config.myVideo.pause();
            $(_config.play).attr('src','img/noplay.png');
        },
        /*
         * 视屏开启关闭状态
         */
        _playState: function(){
            var self = this,
                _config = self.config;

            if(_config.myVideo.paused){
                self._play();
            }else{
                self._pause();
            }
            _config.playState = !_config.myVideo.paused;
        },
        // 点击播放按钮
        _clickPlayBtn: function(){
            var self = this,
                _config = self.config;

            $(_config.play).click(function(){
                self._playState();
            });
        },
        /*
         * 视频播放结束
         */
        _end: function(){
            var self = this,
                _config = self.config;

            self._bindEvent(_config.myVideo, 'ended', function(){
                $(_config.play).attr('src','img/noplay.png');
            });
        },
        /*
         * 视频缓冲
         */
        _waiting: function(){
            var self = this,
                _config = self.config;

            // $('.waiting-gif').show();
            // console.log(_config.myVideo.bubbles);
        },
        /*
         * 进度条缓冲进度
         */
        _bufferProgress: function(){
            var self = this,
                _config = self.config;

            self._bindEvent(_config.myVideo, 'progress', function(){

            });
        },
        /*
         * 进度条变化
         */
        _progress: function(){
            var self = this,
                _config = self.config;

            self._bindEvent(_config.myVideo, 'timeupdate', function(e){
                var currentTime = _config.myVideo.currentTime;
                $(_config.currentTime).text(self._handlerTime(currentTime));
                var progressBar_width = $(_config.progressBar).width();
                var progress_width = progressBar_width * (currentTime / _config.durationTime);
                var bar_width = progress_width - $(_config.bar).width()/2;
                $(_config.progress).animate({'width': progress_width},20);
                $(_config.bar).animate({'left': bar_width}, 20);
            });
        },
        /*
         * 点击进度条
         */
        _clickProgress: function(){
            var self = this,
                _config = self.config;

            $(_config.progressBar).click(function(e){
                var disX = e.pageX - $(_config.progressBar).offset().left;
                var progressBar_width = $(_config.progressBar).width();
                var dis_currentTime = _config.durationTime * (disX / progressBar_width);
                _config.myVideo.currentTime = dis_currentTime;
                if(_config.myVideo.paused){
                    self._pause();
                }else{
                    self._play();
                }
            });
        },
        /*
         * 点击进度条
         */
        _dragProgress: function(){
            var self = this,
                _config = self.config;

            $(_config.bar).mousedown(function(e){
                e = window.event || e;
                var disX = e.pageX - $(this).position().left;
                _config.playState = _config.myVideo.paused; // 解决mousemove会闪动问题，只要拖动视频播放就禁止.
                _config.myVideo.pause();
                if(this.setCapture){
                    $(this).mousemove(function(event){
                        var disX_move = event.pageX - disX;
                        var progressBar_width = $(_config.progressBar).width();
                        if(disX_move <= progressBar_width && disX_move > 0){
                            var dis_currentTime = _config.durationTime * (disX_move / progressBar_width);
                            var bar_width = disX_move - $(_config.bar).width()/2;
                            $(_config.progress).css({'width': disX_move});
                            $(_config.bar).css({'left': bar_width});
                            _config.currentTime = dis_currentTime;
                        }
                    });

                    this.setCapture();

                    $(this).mouseup(function(){
                        if(_config.playState){
                            self._pause();
                        }else{
                            self._play();
                        }
                       $(this).unbind('mousemove mouseup');
                       this.releaseCapture();
                    });
                }else{
                    $(document).mousemove(function(event){
                        var disX_move = event.pageX - disX;
                        var progressBar_width = $(_config.progressBar).width();
                        if(disX_move <= progressBar_width && disX_move > 0){
                            var dis_currentTime = _config.durationTime * (disX_move / progressBar_width);
                            var bar_width = disX_move - $(_config.bar).width()/2;
                            $(_config.progress).css({'width': disX_move});
                            $(_config.bar).css({'left': bar_width});
                            _config.myVideo.currentTime = dis_currentTime;
                        }
                    });

                    $(document).mouseup(function(){
                        if(_config.playState){
                            self._pause();
                        }else{
                            self._play();
                        }
                        $(document).unbind('mousemove mouseup');
                    });
                }
                return false;
            });
        },
        /*
         * 点击音量按钮
         */
        _clickVolumeBtn: function(){
            var self = this,
                _config = self.config;

            $(_config.volume).click(function(){
                self._muted();
            });
        },
        /*
         * 音量控制
         */
        _muted: function(){
            var self = this,
                _config = self.config;

            // muted 为 true表示静音，为false表示有声音
            if(_config.volumeDirection){
                // 横排音量
                var v_width = $(_config.volumeProgress).width();
                if(_config.myVideo.muted){
                    $(_config.volume).attr('src','img/volume.png');
                    $(_config.volumeBar).animate({'width': v_width/2}, 20);
                    _config.myVideo.volume = 0.5;
                }else{
                    $(_config.volume).attr('src','img/novolume.png');
                    $(_config.volumeBar).animate({'width': 0}, 20);
                    _config.myVideo.volume = 0;
                }
            }else{
                // 竖排音量
                var v_height = $(_config.volumeProgress).height();
                if(_config.myVideo.muted){
                    $(_config.volume).attr('src', 'img/volume.png');
                    $(_config.volumeBar).animate({'top': v_height/2}, 20);
                    _config.myVideo.volume = 0.5;
                }else {
                    $(_config.volume).attr('src','img/novolume.png');
                    $(_config.volumeBar).animate({'top': v_height}, 20);
                    _config.myVideo.volume = 0;
                }
                $(_config.volumeBox).fadeIn();
            }
            _config.myVideo.muted = !_config.myVideo.muted;
        },
        /*
         * 点击改变音量控制
         */
        _clickVolume: function(){
            var self = this,
                _config = self.config;

            $(_config.volumeProgress).click(function(e){
                e = window.event || e;
                _config.myVideo.muted=false;
                if(_config.volumeDirection){
                    // 音量横向
                    var v_disX = e.pageX - $(_config.volumeProgress).offset().left;
                    var v_width = $(_config.volumeProgress).width();
                    var v_volume = (parseInt((v_disX / v_width)*100))/100;

                    if(v_volume >= 0.95){
                        $(_config.volumeBar).animate({'width': v_width}, 20);
                        _config.myVideo.volume = 1;
                        $(_config.volume).attr('src', 'img/volume.png');
                    }else if(v_volume <= 0.05){
                        $(_config.volumeBar).animate({'width': 0}, 20);
                        _config.myVideo.volume = 0;
                        $(_config.volume).attr('src', 'img/novolume.png');
                    }else{
                        $(_config.volumeBar).animate({'width': v_disX}, 20);
                        _config.myVideo.volume = v_volume;
                        $(_config.volume).attr('src', 'img/volume.png');
                    }
                }else{
                    // 音量竖向
                    var v_disY = e.pageY - $(_config.volumeProgress).offset().top;
                    var v_height = $(_config.volumeProgress).height();
                    var v_volume = (parseInt((v_disY / v_height)*100))/100;

                    if(v_volume >= 0.95){
                        $(_config.volumeBar).animate({'top': v_height}, 20);
                        _config.myVideo.volume = 0;
                        $(_config.volume).attr('src', 'img/novolume.png');
                    }else if(v_volume <= 0.05){
                        $(_config.volumeBar).animate({'top': 0}, 20);
                        _config.myVideo.volume = 1;
                        $(_config.volume).attr('src', 'img/volume.png');
                    }else{
                        $(_config.volumeBar).animate({'top': v_disY}, 20);
                        _config.myVideo.volume = (1-v_volume);
                        $(_config.volume).attr('src', 'img/volume.png');
                    }
                }
            });
        },
        /*
         * 竖向音量条隐藏
         */
        _mouseLeave: function(){
            var self = this,
                _config = self.config;

            if(!_config.volumeDirection){
                // 音量竖向
                var timer;
                $(_config.volumeMain).mouseleave(function(){
                    clearTimeout(timer);
                    timer=setTimeout(function(){
                       $(_config.volumeBox).fadeOut();
                   },1500);
                });
            }
        },
        /*
         * 处理视频时间戳，得到格式00:00格式的时间
         */
        _handlerTime: function(second){
            var t_time = parseInt(second);
            var t_second = t_time % 60;
            var t_minite = parseInt(t_time / 60);
            return (t_minite<10?'0'+t_minite:t_minite)+':'+(t_second<10?'0'+t_second:t_second);
        },
        /*
         * 点击视频播放速度变化
         */
        _clickPlayRate: function(){
            var self = this,
                _config = self.config;

            $(_config.currentRate).click(function(){
                 $(_config.rateBox).toggle();
            });
        },
        _mouseLeaveRate: function(){
            var self = this,
                _config = self.config;

            var timer;
            $(_config.rateBox).mouseenter(function(){
                clearTimeout(timer);
            });

            $(_config.playRateBox).mouseleave(function(){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    $(_config.rateBox).fadeOut();
                },1500);
            });
        },
        _changePlayRate: function(){
            var self = this,
                _config = self.config;

            $(_config.rateBox).on('click', 'li', function(){
               var rate = $(this).attr('rate');
                _config.myVideo.playbackRate = rate;
                $(_config.currentRate).text($(this).text());
                $(_config.rateBox).hide();
            });
        },
        /*
         * 进入全屏
         */
        _clickFScreenBtn: function(){
            var self = this,
                _config = self.config;

            $(_config.fullscreen).click(function(){
               self._fullScreen(_config.myVideo);
            });
        },
        /*
         * 进入全屏
         */
        _fullScreen: function(el){
            var self = this,
                _config = self.config;

            if(el.requestFullscreen){
                // video api全屏
                el.requestFullscreen();
            }else if(el.mozRequestFullScreen){
                // 火狐全屏
                el.mozRequestFullScreen();
            }else if(el.webkitRequestFullScreen){
                // 谷歌全屏
                el.webkitRequestFullScreen();
            }else if(el.oRequestFullscreen){
                // 欧朋
                el.oRequestFullscreen();
            }else{
                if(el.msRequestFullscreen){
                    // IE浏览器，但IE10及以下都不支持
                    el.msRequestFullscreen();
                }else{
                    $(_config.videoBox).addClass('video-full');
                }
            }
        },
        /*
         * 退出全屏
         */
        _exitScreen: function(de){
            var self = this,
                _config = self.config;

            if(de.exitFullscreen) {
                de.exitFullscreen();
            }else if(de.mozCancelFullScreen){
                de.mozCancelFullScreen();
            }else if(de.webkitCancelFullScreen){
                de.webkitCancelFullScreen();
            }else if(el.oCancelFullScreen){
                // 欧朋
                el.oCancelFullScreen();
            }else{
                if(el.msCancelFullScreen){
                    // IE浏览器，但IE10及以下都不支持
                    el.msCancelFullScreen();
                }else{
                    $(_config.videoBox).removeClass('video-full');
                }
            }
        },
        /*
         * 事件绑定兼容方法
         */
        _bindEvent: function(dom, type, fn){
            if(dom.addEventListener){
                dom.addEventListener(type, fn, false);
            }else if(dom.attachEvent){
                dom.attachEvent('on'+type, fn);
            }else{
                dom['on'+type] = fn;
            }
        }
    }
