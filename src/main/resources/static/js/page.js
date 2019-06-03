layui.use(['jquery', 'laypage'], function() {
    var $ = layui.jquery;
    var flow = layui.flow;
    var laypage = layui.laypage;
    $(function() {
        //播放公告
        playAnnouncement(3000);
    });

    function playAnnouncement(interval) {
        var index = 0;
        var $announcement = $('.home-tips-container>span');
        //自动轮换
        setInterval(function() {
            index++; //下标更新
            if (index >= $announcement.length) {
                index = 0;
            }
            $announcement.eq(index).stop(true, true).fadeIn().siblings('span').fadeOut(); //下标对应的图片显示，同辈元素隐藏
        }, interval);
    }
});

layui.use(['carousel', 'form'], function(){
    var carousel = layui.carousel
        ,form = layui.form;


    //图片轮播
    carousel.render({
        elem: '#test10'
        ,width: '100%'
        ,height: '30vh'
        ,interval: 3000
    });

    //事件
    carousel.on('change(test4)', function(res){
        console.log(res)
    });

    var $ = layui.$, active = {
        set: function(othis){
            var THIS = 'layui-bg-normal'
                ,key = othis.data('key')
                ,options = {};

            othis.css('background-color', '#5FB878').siblings().removeAttr('style');
            options[key] = othis.data('value');
            ins3.reload(options);
        }
    };

    //监听开关
    form.on('switch(autoplay)', function(){
        ins3.reload({
            autoplay: this.checked
        });
    });

    $('.demoSet').on('keyup', function(){
        var value = this.value
            ,options = {};
        if(!/^\d+$/.test(value)) return;

        options[this.name] = value;
        ins3.reload(options);
    });

    //其它示例
    $('.demoTest .layui-btn').on('click', function(){
        var othis = $(this), type = othis.data('type');
        active[type] ? active[type].call(this, othis) : '';
    });
});


