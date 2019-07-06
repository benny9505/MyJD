;(function(){
    // 由于轮播图的li标签全部定位，脱标，父盒子高度为0；图片自适应布局无法设置固定高度，要用js动态设置高度
    function setBannerHeight() {
        document.querySelector('.jd-banner').style.height
        = document.querySelector('.jd-banner ul img').offsetHeight +'px';

    }
    setBannerHeight();

    // 当屏幕尺寸变化时动态设置banner高度
    window.onresize = function(){
        setBannerHeight();
        console.log('1');
    }

})();

(function(){
    //1- 开始倒计时
    downTime();
    //2-头部滚动变色
    setHeader();
    //3-京东快报无缝效果
    news();
    //4-触屏轮播图实现
    banner();

    // 倒计时
    function downTime(){
        var t = 5 * 60 * 60;
        var spans = document.querySelectorAll('.jd-seckill .time span:nth-child(odd)')

        var timer = setInterval(function(){
            //将t转化为 时分秒
            var h = Math.floor(t / 3600);
            var m = Math.floor(t % 3600 /60); //不足1小时部分算分钟
            var s = t % 60;                      //不足1分钟算秒

            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;

            //将时间设置为00：00：00格式
            spans[0].innerHTML = h;
            spans[1].innerHTML = m;
            spans[2].innerHTML = s;

            t--;

            if( t < 0 ) {
                t = 5 * 60 *60;
            }
        },1000)
    }

    // 头部滚动变色
    function setHeader(){
        var banner = document.querySelector('.jd-banner');
        var header = document.querySelector('.header');

        window.addEventListener('scroll',function(){
            var top = window.pageYOffset;
            var height = banner.offsetHeight;
            var value = top / height;

            console.log('页面下移');

            if(value >1){
                value = 1;
            }

            header.style.backgroundColor = 'rgba(222, 24, 27,'+ value +')';
        })
    }

    //京东快报无缝效果
    function news(){
        var ul = document.querySelector('.jd-news ul');
        var lis = ul.querySelectorAll('li');
        console.log(ul);
        var index = 0;
        setInterval(function(){
            index++;

            ul.style.transition = 'transform .3s';
            ul.style.webkitTransition = 'transform .3s';

            ul.style.transform = 'translateY('+ (-index *30) + 'px)';
            ul.style.webkitTransform = 'translateY('+ (-index *30) + 'px)';
        }, 1500);
        ul.addEventListener('transitionend',function() {
            if (index >= lis.length - 1) {
                index = 0; //index复位
                //移除过渡
                ul.style.transition = 'none';
                ul.style.webkitTransition = 'none';
                //ul位置复位
                ul.style.transform = 'translateY(0)';
                ul.style.webkitTransform = 'translateY(0)';
            }
        })

        }

    // 轮播图
    function banner() {
        var banner = document.querySelector('.jd-banner');
        var ul = banner.querySelector('ul');
        width = banner.offsetWidth;
        var index = 1;
        var points = document.querySelectorAll('ol li')


        var timer = setInterval(turn, 1000);

        // 1自动轮播图
        function turn() {
            index++;
            addTransition();
            setTranslateX(-index * width);
        }

        // 2判断index值是否越界
        ul.addEventListener('transitionend', function () {
            if (index >= 9) {
                index = 1;  //index 复位

                //去掉过渡
                removeTransition () ;
                //ul瞬移到真正的第一张图片,进行重合实现无缝
                setTranslateX(-index * width);
            }
            if (index <=0) {
                index = 8;
                removeTransition () ;
                setTranslateX(-index * width);
            }

            setPoints(index-1)
        });

        // 3切换小圆点
        function setPoints(index){
            points.forEach(function(v,i){
                v.classList.remove('current');

            });
            points[index].classList.add('current');
        };

        // 4封装处理兼容
            //添加过渡
            function addTransition () {
                ul.style.transition = 'transform 0.3s';
                ul.style.transition = 'transform 2s';
                ul.style.webkitTransition = 'transform 0.3s';
            }

            //删除过渡
            function removeTransition () {
                ul.style.transition = 'none';
                ul.style.webkitTransition = 'none';
            }

            //设置ul位移
            function setTranslateX(x) {
                ul.style.transform = 'translateX('+ x +'px)';
                ul.style.webkitTransform = 'translateX('+ x +'px)';
            }

        // 5触屏
        var startX = 0;
        var moveX = 0;
        var distanceX = 0;
        banner.addEventListener('touchstart',function(e){
            console.log('start');
            clearInterval(timer);//停止定时器
            startX = e.targetTouches[0].clientX;//获取起始坐标值
        })

        banner.addEventListener('touchmove',function(e){
            console.log('move');
            moveX = e.targetTouches[0].clientX;
            distanceX = moveX - startX;
            removeTransition();
            setTranslateX(-index * width + distanceX);
        })

        banner.addEventListener('touchend',function(e){
            console.log('end');
            if (Math.abs(distanceX) > width / 3){
                if (distanceX > 0 ) {
                    index--;
                }
                if(distanceX < 0) {
                    index++;
                }
            }
            addTransition();
            setTranslateX(-index * width);
            startX = 0;
            moveX = 0;
            distanceX = 0;
            timer = setInterval(turn,1000);
        })

        //当浏览器窗口尺寸变化后，重新获取屏幕的宽度 ，让轮播图基于新的宽度进行移动；
        window.addEventListener('resize', function () {
            width = banner.offsetWidth; //重新获取banner宽度
            //让ul重新移动一下
            removeTransition(); //去掉过渡效果
            setTranslateX(-index * width); //ul位移
        })
    }
})();