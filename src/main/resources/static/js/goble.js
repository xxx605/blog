layui.use(['element', 'layer', 'util', 'form'], function() {
 
 
    function DrawCanvas() {
        var $ = layui.jquery;
        var canvas = document.getElementById('canvas-banner');
        canvas.width = window.document.body.clientWidth; //需要重新设置canvas宽度，因为dom加载完毕后有可能没有滚动条
        var ctx = canvas.getContext('2d');

        ctx.strokeStyle = (new Color(150)).style;

        var dotCount = 20; //圆点数量
        var dotRadius = 70; //产生连线的范围
        var dotDistance = 70; //产生连线的最小距离
        var screenWidth = screen.width;
        if (screenWidth >= 768 && screenWidth < 992) {
            dotCount = 130;
            dotRadius = 100;
            dotDistance = 60;
        } else if (screenWidth >= 992 && screenWidth < 1200) {
            dotCount = 140;
            dotRadius = 140;
            dotDistance = 70;
        } else if (screenWidth >= 1200 && screenWidth < 1700) {
            dotCount = 140;
            dotRadius = 150;
            dotDistance = 80;
        } else if (screenWidth >= 1700) {
            dotCount = 200;
            dotRadius = 150;
            dotDistance = 80;
        }
        //默认鼠标位置 canvas 中间
        var mousePosition = {
            x: 50 * canvas.width / 100,
            y: 50 * canvas.height / 100
        };
        //小圆点
        var dots = {
            count: dotCount,
            distance: dotDistance,
            d_radius: dotRadius,
            array: []
        };

        function colorValue(min) {
            return Math.floor(Math.random() * 255 + min);
        }

        function createColorStyle(r, g, b) {
            return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
        }

        function mixComponents(comp1, weight1, comp2, weight2) {
            return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
        }

        function averageColorStyles(dot1, dot2) {
            var color1 = dot1.color,
                color2 = dot2.color;

            var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
                g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
                b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
            return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
        }

        function Color(min) {
            min = min || 0;
            this.r = colorValue(min);
            this.g = colorValue(min);
            this.b = colorValue(min);
            this.style = createColorStyle(this.r, this.g, this.b);
        }

        function Dot() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.vx = -.5 + Math.random();
            this.vy = -.5 + Math.random();

            this.radius = Math.random() * 2;

            this.color = new Color();
        }

        Dot.prototype = {
            draw: function() {
                ctx.beginPath();
                ctx.fillStyle = "#fff";
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fill();
            }
        };

        function createDots() {
            for (i = 0; i < dots.count; i++) {
                dots.array.push(new Dot());
            }
        }

        function moveDots() {
            for (i = 0; i < dots.count; i++) {

                var dot = dots.array[i];

                if (dot.y < 0 || dot.y > canvas.height) {
                    dot.vx = dot.vx;
                    dot.vy = -dot.vy;
                } else if (dot.x < 0 || dot.x > canvas.width) {
                    dot.vx = -dot.vx;
                    dot.vy = dot.vy;
                }
                dot.x += dot.vx;
                dot.y += dot.vy;
            }
        }

        function connectDots1() {
            var pointx = mousePosition.x;
            for (i = 0; i < dots.count; i++) {
                for (j = 0; j < dots.count; j++) {
                    i_dot = dots.array[i];
                    j_dot = dots.array[j];

                    if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > -dots.distance && (i_dot.y - j_dot.y) > -dots.distance) {
                        if ((i_dot.x - pointx) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - pointx) > -dots.d_radius && (i_dot.y - mousePosition.y) > -dots.d_radius) {
                            ctx.beginPath();
                            ctx.strokeStyle = averageColorStyles(i_dot, j_dot);
                            ctx.moveTo(i_dot.x, i_dot.y);
                            ctx.lineTo(j_dot.x, j_dot.y);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }
            }
        }

        function drawDots() {
            for (i = 0; i < dots.count; i++) {
                var dot = dots.array[i];
                dot.draw();
            }
        }

        function animateDots() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            moveDots();
            connectDots1()
            drawDots();

            requestAnimationFrame(animateDots);
        }
        //鼠标在canvas上移动
        $('canvas').on('mousemove', function(e) {
            mousePosition.x = e.pageX;
            mousePosition.y = e.pageY;
        });

        //鼠标移出canvas
        $('canvas').on('mouseleave', function(e) {
            mousePosition.x = canvas.width / 2;
            mousePosition.y = canvas.height / 2;
        });

        createDots();

        requestAnimationFrame(animateDots);
    }

    //画canvas
    DrawCanvas();
    //监听窗口大小改变
    window.addEventListener("resize", resizeCanvas, false);

    //窗口大小改变时改变canvas宽度
    function resizeCanvas() {
        var canvas = document.getElementById('canvas-banner');
        canvas.width = window.document.body.clientWidth;
        canvas.height = window.innerHeight - 65;
    }

    //子栏目导航点击事件
    $('.child-nav span').click(function() {
        layer.msg('切换到相应栏目');
        $(this).addClass('child-nav-btn-this').siblings().removeClass('child-nav-btn-this');
    });

    //侧边导航开关点击事件
    $('.blog-navicon').click(function() {
        var sear = new RegExp('layui-hide');
        if (sear.test($('.blog-nav-left').attr('class'))) {
            leftIn();
        } else {
            leftOut();
        }
    });
    //侧边导航遮罩点击事件
    $('.blog-mask').click(function() {
        leftOut();
    });
    //blog-body和blog-footer点击事件，用来关闭百度分享和类别导航
    $('.blog-body,.blog-footer').click(function() {
        //shareOut();
        categoryOut();
    });
    //类别导航开关点击事件
    $('.category-toggle').click(function(e) {
        e.stopPropagation(); //阻止事件冒泡
        categroyIn();
    });
    //类别导航点击事件，用来关闭类别导航
    $('.article-category').click(function() {
        categoryOut();
    });
    //具体类别点击事件
    $('.article-category > a').click(function(e) {
        e.stopPropagation(); //阻止事件冒泡
    });


    function leftIn() {
        $('.blog-mask').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        $('.blog-nav-left').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');

        $('.blog-mask').removeClass('maskOut');
        $('.blog-mask').addClass('maskIn');
        $('.blog-mask').removeClass('layui-hide');
        $('.blog-mask').addClass('layui-show');

        $('.blog-nav-left').removeClass('leftOut');
        $('.blog-nav-left').addClass('leftIn');
        $('.blog-nav-left').removeClass('layui-hide');
        $('.blog-nav-left').addClass('layui-show');
    }
    //隐藏侧边导航
    function leftOut() {
        $('.blog-mask').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('.blog-mask').addClass('layui-hide');
        });
        $('.blog-nav-left').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('.blog-nav-left').addClass('layui-hide');
        });

        $('.blog-mask').removeClass('maskIn');
        $('.blog-mask').addClass('maskOut');
        $('.blog-mask').removeClass('layui-show');

        $('.blog-nav-left').removeClass('leftIn');
        $('.blog-nav-left').addClass('leftOut');
        $('.blog-nav-left').removeClass('layui-show');
    }
    //显示类别导航
    function categroyIn() {
        $('.category-toggle').addClass('layui-hide');
        $('.article-category').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');

        $('.article-category').removeClass('categoryOut');
        $('.article-category').addClass('categoryIn');
        $('.article-category').addClass('layui-show');
    }
    //隐藏类别导航
    function categoryOut() {
        $('.article-category').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('.article-category').removeClass('layui-show');
            $('.category-toggle').removeClass('layui-hide');
        });

        $('.article-category').removeClass('categoryIn');
        $('.article-category').addClass('categoryOut');
    }


});


//首页分页
var HomeGetPage = function(index, rows, value) {
    var $ = layui.jquery;
    var laypage = layui.laypage;
    if (value) {
        var url = '/api/ArticlePage?value=' + value;
    } else {
        var url = '/api/ArticlePage';
    }
    $.ajax({
        type: 'get',
        url: url,
        contentType: 'application/json',
        data: { "index": index, "rows": rows },
        datatype: 'json',
        success: function(res) {
            if (res.code == 0) {
                var html = '';
                for (var i = 0; i < res.result.length; i++) {
                    html += '<div class="article shadow animated fadeInLeft">\
                                    <div class="article-left">\
                                        <img src="' + res.result[i].coverImg + '" alt="' + res.result[i].title + '" />\
                                    </div>\
                                    <div class="article-right">\
                                        <div class="article-title">'
                    if (res.result[i].stick) {
                        html += '<i class="icon-stick">顶</i>'
                    }

                    if (res.result[i].recommend) {
                        html += '<i class="icon-stick">推荐</i>'
                    }

                    html += '<a href="/detail/' + res.result[i]._id + '">' + res.result[i].title + '</a>\
                                        </div>\
                                        <div class="article-abstract">\
                                            ' + res.result[i].abstract + '\
                                        </div>\
                                    </div>\
                                    <div class="clear"></div>\
                                    <div class="article-footer">\
                                        <span><i class="fa fa-clock-o"></i>&nbsp;&nbsp;' + new Date(parseInt(res.result[i].addtime)).format("yyyy-MM-dd HH:mm:ss") + '</span>\
                                        <span class="article-author"><i class="fa fa-user"></i>&nbsp;&nbsp;' + res.result[i].username + '</span>\
                                        <span><i class="fa fa-tag"></i>&nbsp;&nbsp;<a href="/article/' + res.result[i].categoryvalue + '">' + res.result[i].categoryname + '</a></span>\
                                        <span class="article-viewinfo"><i class="fa fa-eye"></i>&nbsp;' + res.result[i].look + '</span>\
                                        <span class="article-viewinfo"><i class="fa fa-commenting"></i>&nbsp;' + res.result[i].msgleng + '</span>\
                                    </div>\
                                </div>'
                }
                $('#HomeConten').html('').append(html);
                var pageSize = res.pagesize;
                laypage({
                    cont: 'HomePage',
                    pages: pageSize,
                    groups: res.rows,
                    skip: true,
                    curr: res.index,
                    jump: function(obj, first) {
                        var index = obj.curr;
                        if (!first) {
                            if (value) {
                                HomeGetPage(index, res.rows, value);
                            } else {
                                HomeGetPage(index, res.rows);
                            }

                        }
                    }
                });


            } else {
                layer.msg(res.msg, { icon: 2 });
            }
        },
        error: function(e) {
            layer.msg(e.responseText);
        }
    });
}


/*热帖*/
var hotarticles = function(obj) {
    var $ = layui.jquery;
    $.ajax({
        type: 'get',
        url: '/api/hotarticles',
        contentType: 'application/json',
        datatype: 'json',
        success: function(res) {
            if (res.code == 0) {
                var html = '';
                for (var i = 0; i < res.result.length; i++) {
                    if (i < 3) {
                        html += '<li><i class="fa-li fa fa-hand-o-right"></i><a href="detail/' + res.result[i]._id + '" style="color:#FF5722;">' + res.result[i].title + '</a></li>'
                    } else {
                        html += '<li><i class="fa-li fa fa-hand-o-right"></i><a href="detail/' + res.result[i]._id + '">' + res.result[i].title + '</a></li>'
                    }
                }
                $(obj).html('').append(html);

            } else {
                layer.msg(res.msg, { icon: 2 });
            }
        },
        error: function(e) {
            layer.msg(e.responseText);
        }
    })
}

/*热门评论*/
var HotComment = function(obj) {
    var $ = layui.jquery;
    $.ajax({
        type: 'get',
        url: '/api/gethot',
        contentType: 'application/json',
        datatype: 'json',
        data: { 'rows': '6' },
        success: function(res) {
            if (res.code == 0) {
                var html = '';
                if (res.result.length > 0) {
                    for (var i = 0; i < res.result.length; i++) {

                        html += '<li class="list-item cl">\
                                        <div class="reping-avatar">\
                                            <img width="50px" height="50px" src="' + res.result[i].UserImg + '" title="' + res.result[i].ReplyTitle + '">\
                                        </div>\
                                        <div class="contavatar">\
                                            <span class="reping-nickname">' + res.result[i].UserName + '</span>';
                        if (typeof res.result[i].ip != 'string' && typeof res.result[i].ip != undefined) {
                            html += '<span class="reping-content">' + res.result[i].ip.city + '--' + res.result[i].ip.isp + '</span>';
                        }
                        html += '<span class="reping-title"><a href="http://blog.jczxw.cn/detail/' + res.result[i].Replyid + '" target="_blank" title="' + res.result[i].ReplyTitle + '">评:' + res.result[i].ReplyTitle + '</a></span>\
                                        </div>\
                                    </li>'

                    }
                }
                $(obj).html('').append(html);


            } else {
                layer.msg(res.msg, { icon: 2 });
            }
        },
        error: function(e) {
            layer.msg(e.responseText);
        }
    })
}

/*热评用户*/
var Userqq = function(obj) {
    var $ = layui.jquery;
    $.ajax({
        type: 'get',
        url: '/api/getqqhot',
        contentType: 'application/json',
        data: { 'rows': '6' },
        datatype: 'json',
        success: function(res) {
            if (res.code == 0) {
                var html = '';
                for (var i = 0; i < res.result.length; i++) {

                    html += '<li class="hotusers-list-item">\
                                        <div class="hotusers-top hotusers-num">' + (parseInt(i) + 1) + '</div>\
                                        <div class="hotusers-avator"><img src="' + res.result[i].figureurl_2 + '" width="45" height="45"></div>\
                                        <div>\
                                            <div class="hotusers-nick">' + res.result[i].nickname + '</div>\
                                            <span class="hotusers-level" title="等级' + (parseInt(i) + 1) + '" style=" background-image: url(https://changyan.itc.cn/v2/asset/scs/imgs/p-lv0' + (parseInt(i) + 1) + '.png);">\
                                            <i style=" background-image:url(https://changyan.itc.cn/v2/asset/scs/imgs/p-lv01-04.png);">冒泡</i></span>\
                                            <span class="hotusers-totalcmt">本站评论数：' + res.result[i].speak * 1 + ' </span>\
                                        </div>\
                                        <span class="hotusers-icons"></span>\
                                    </li>'

                }
                $(obj).html('').append(html);

            } else {
                layer.msg(res.msg, { icon: 2 });
            }
        },
        error: function(e) {
            layer.msg(e.responseText);
        }
    })
}


//时间格式化
Date.prototype.format = function(pattern) {
    /*初始化返回值字符串*/
    var returnValue = pattern;
    /*正则式pattern类型对象定义*/
    var format = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "S": this.getMilliseconds(),
        "h+": (this.getHours() % 12),
        "a": (this.getHours() / 12) <= 1 ? "AM" : "PM"
    };
    /*遍历正则式pattern类型对象构建returnValue对象*/
    for (var key in format) {
        var regExp = new RegExp("(" + key + ")");
        if (regExp.test(returnValue)) {
            var zero = "";
            for (var i = 0; i < RegExp.$1.length; i++) { zero += "0"; }
            var replacement = RegExp.$1.length == 1 ? format[key] : (zero + format[key]).substring((("" + format[key]).length));
            returnValue = returnValue.replace(RegExp.$1, replacement);
        }
    }
    return returnValue;
};


var face = { "[微笑]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/5c/huanglianwx_thumb.gif", "[嘻嘻]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/tootha_thumb.gif", "[哈哈]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6a/laugh.gif", "[可爱]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/tza_thumb.gif", "[可怜]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/kl_thumb.gif", "[挖鼻]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/wabi_thumb.gif", "[吃惊]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f4/cj_thumb.gif", "[害羞]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/shamea_thumb.gif", "[挤眼]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c3/zy_thumb.gif", "[闭嘴]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/bz_thumb.gif", "[鄙视]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/bs2_thumb.gif", "[爱你]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/lovea_thumb.gif", "[泪]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/sada_thumb.gif", "[偷笑]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/19/heia_thumb.gif", "[亲亲]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/qq_thumb.gif", "[生病]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b6/sb_thumb.gif", "[太开心]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_thumb.gif", "[白眼]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/landeln_thumb.gif", "[右哼哼]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/98/yhh_thumb.gif", "[左哼哼]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/zhh_thumb.gif", "[嘘]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a6/x_thumb.gif", "[衰]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/cry.gif", "[委屈]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/73/wq_thumb.gif", "[吐]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/t_thumb.gif", "[哈欠]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cc/haqianv2_thumb.gif", "[抱抱]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/bba_thumb.gif", "[怒]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/angrya_thumb.gif", "[疑问]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/5c/yw_thumb.gif", "[馋嘴]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/cza_thumb.gif", "[拜拜]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/70/88_thumb.gif", "[思考]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/sk_thumb.gif", "[汗]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/24/sweata_thumb.gif", "[困]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/kunv2_thumb.gif", "[睡]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/huangliansj_thumb.gif", "[钱]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/90/money_thumb.gif", "[失望]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0c/sw_thumb.gif", "[酷]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/cool_thumb.gif", "[色]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/20/huanglianse_thumb.gif", "[哼]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/hatea_thumb.gif", "[鼓掌]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/36/gza_thumb.gif", "[晕]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/dizzya_thumb.gif", "[悲伤]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1a/bs_thumb.gif", "[抓狂]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/crazya_thumb.gif", "[黑线]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/h_thumb.gif", "[阴险]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/yx_thumb.gif", "[怒骂]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/numav2_thumb.gif", "[互粉]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/89/hufen_thumb.gif", "[心]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/hearta_thumb.gif", "[伤心]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ea/unheart.gif", "[猪头]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/pig.gif", "[熊猫]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/panda_thumb.gif", "[兔子]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/81/rabbit_thumb.gif", "[ok]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/ok_thumb.gif", "[耶]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/ye_thumb.gif", "[good]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/good_thumb.gif", "[NO]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/buyao_org.gif", "[赞]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/z2_thumb.gif", "[来]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/come_thumb.gif", "[弱]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/sad_thumb.gif", "[草泥马]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/shenshou_thumb.gif", "[神马]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/horse2_thumb.gif", "[囧]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/j_thumb.gif", "[浮云]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bc/fuyun_thumb.gif", "[给力]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/geiliv2_thumb.gif", "[围观]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f2/wg_thumb.gif", "[威武]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/70/vw_thumb.gif", "[奥特曼]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bc/otm_thumb.gif", "[礼物]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c4/liwu_thumb.gif", "[钟]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d3/clock_thumb.gif", "[话筒]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9f/huatongv2_thumb.gif", "[蜡烛]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/lazhuv2_thumb.gif", "[蛋糕]": "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3a/cakev2_thumb.gif" };

gather = {
    faces: face,
    escape: function(html) {
        return String(html || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }

    //内容转义
    ,
    content: function(content) {
        //支持的html标签
        var html = function(end) {
            return new RegExp('\\n*\\[' + (end || '') + '(pre|hr|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
        };
        content = gather.escape(content || '') //XSS
            .replace(/img\[([^\s]+?)\]/g, function(img) { //转义图片
                return '<img src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
            }).replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;" class="fly-aite">$1</a>$2') //转义@
            .replace(/face\[([^\s\[\]]+?)\]/g, function(face) { //转义表情
                var alt = face.replace(/^face/g, '');
                return '<img alt="' + alt + '" title="' + alt + '" src="' + gather.faces[alt] + '">';
            }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str) { //转义链接
                var href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
                var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
                if (!href) return str;
                var rel = /^(http(s)*:\/\/)\b(?!(\w+\.)*(sentsin.com|layui.com))\b/.test(href.replace(/\s/g, ''));
                return '<a href="' + href + '" target="_blank"' + (rel ? ' rel="nofollow"' : '') + '>' + (text || href) + '</a>';
            }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
            .replace(/\n/g, '<br>') //转义换行   
        return content;
    }
}


///*********LayIm***********/
//layui.use(['element', 'layer', 'layim'], function(element, layer, layim) {
//  var $ = layui.jquery;
//  var socket = io.connect('https://ws.jczxw.cn');
//
//  //基础配置
//  layim.config({
//
//      //初始化接口
//      init: {
//          url: '/api/getList.json',
//          data: {}
//      }
//      //查看群员接口
//      ,
//      members: {
//          url: '/api/getMembers.json',
//          data: {}
//      }
//      //上传图片接口
//      ,
//      uploadImage: {
//          url: '/api/file/uploadImage' //（返回的数据格式见下文）
//              ,
//          type: '' //默认post
//      }
//      //上传文件接口
//      ,
//      uploadFile: {
//          url: '/api/file/uploadFile' //（返回的数据格式见下文）
//              ,
//          type: '' //默认post
//      },
//      isAudio: true //开启聊天工具栏音频
//          ,
//      isVideo: true //开启聊天工具栏视频
//          //扩展工具栏
//          ,
//      tool: [{
//              alias: 'code',
//              title: '代码',
//              icon: '&#xe64e;'
//          }]
//          //,brief: true //是否简约模式（若开启则不显示主面板）
//          ,
//      title: 'WebIM' //自定义主面板最小化时的标题
//          //,right: '100px' //主面板相对浏览器右侧距离
//          //,minRight: '90px' //聊天面板最小化时相对浏览器右侧距离
//          ,
//      initSkin: '5.jpg' //1-5 设置初始背景
//          //,skin: ['aaa.jpg'] //新增皮肤
//          //,isfriend: false //是否开启好友
//          //,isgroup: false //是否开启群组
//          //,min: true //是否始终最小化主面板，默认false
//          ,
//      notice: true //是否开启桌面消息提醒，默认false
//          //,voice: false //声音提醒，默认开启，声音文件为：default.mp3
//          ,
//      msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
//          ,
//      find: layui.cache.dir + 'css/modules/layim/html/find.html' //发现页面地址，若不开启，剔除该项即可
//          ,
//      chatLog: layui.cache.dir + 'css/modules/layim/html/chatLog.html' //聊天记录页面地址，若不开启，剔除该项即可
//  });
//
//
//  //监听在线状态的切换事件
//  layim.on('online', function(data) {
//      //socket.emit('message', d); //向服务器发送消息
//  });
//
//  //监听签名修改
//  layim.on('sign', function(value) {
//      $.ajax({
//          url: '/api/updateSign',
//          type: 'post',
//          data: {
//              sign: value,
//          },
//          success: function(res) {
//              layer.msg(res.msg, { icon: 1 });
//          }
//      })
//  });
//
//  //监听自定义工具栏点击，以添加代码为例
//  layim.on('tool(code)', function(insert) {
//      layer.prompt({
//          title: '插入代码',
//          formType: 2,
//          shade: 0
//      }, function(text, index) {
//          layer.close(index);
//          insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器
//      });
//  });
//
//  //监听layim建立就绪
//  layim.on('ready', function(res) {
//      //向服务器发送消息
//      var data = {
//          type: 'reg',
//          content: res.mine,
//      };
//      socket.emit('message', data);
//      //layim.msgbox(5); //模拟消息盒子有新消息，实际使用时，一般是动态获得
//
//      //添加好友（如果检测到该socket）
//      // layim.addList({
//      //   type: 'group'
//      //   ,avatar: "http://tva3.sinaimg.cn/crop.64.106.361.361.50/7181dbb3jw8evfbtem8edj20ci0dpq3a.jpg"
//      //   ,groupname: 'Angular开发'
//      //   ,id: "12333333"
//      //   ,members: 0
//      // });
//      // layim.addList({
//      //   type: 'friend'
//      //   ,avatar: "http://tp2.sinaimg.cn/2386568184/180/40050524279/0"
//      //   ,username: '冲田杏梨'
//      //   ,groupid: 2
//      //   ,id: "1233333312121212"
//      //   ,remark: "本人冲田杏梨将结束AV女优的工作"
//      // });
//
//      // setTimeout(function(){
//      //   //接受消息（如果检测到该socket）
//      //   layim.getMessage({
//      //     username: "Hi"
//      //     ,avatar: "http://qzapp.qlogo.cn/qzapp/100280987/56ADC83E78CEC046F8DF2C5D0DD63CDE/100"
//      //     ,id: "10000111"
//      //     ,type: "friend"
//      //     ,content: "临时："+ new Date().getTime()
//      //   });
//
//      /*layim.getMessage({
//        username: "贤心"
//        ,avatar: "http://tp1.sinaimg.cn/1571889140/180/40030060651/1"
//        ,id: "100001"
//        ,type: "friend"
//        ,content: "嗨，你好！欢迎体验LayIM。演示标记："+ new Date().getTime()
//      });*/
//
//      //}, 3000);
//
//
//
//  });
//
//  //获取日志数据
//  socket.on('logs', function(data) {
//      console.log('当前在线人数' + data.userList.length + '人');
//      console.log(data.userList);
//  });
//
//
//  //获取数据插入列表
//  socket.on('chatMessage', function(data) {
//      layim.getMessage(data);
//  });
//

//});