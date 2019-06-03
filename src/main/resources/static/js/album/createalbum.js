/*
layui-btn layui-btn-normal //上传图片
layui-btn layui-btn-primary*/ //创建相册

$(function () {
    $(".normal").click(function () {
        layui.use(["layer","form"],function () {
            var layer = layui.layer;
            var hiddencontent=$("#hiddencontent").html()
            layer.open({
                title:"上传图片",
                content:hiddencontent,
                area:['100%','95%'],
                btn:["问题反馈"],
                shadeClose : false,
                yes:function(){
                    layer.msg("已发送")
                },
                cancel:function () {
                    layer.msg("关闭了")
                    $(".fullPath").children().remove()
                    $("#morefile").prop("hidden", true)
                    $("#selectfile").prop("hidden", false)
                }
            })
        })

        layui.use('form', function(){
            var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功

            //……

            //但是，如果你的HTML是动态生成的，自动渲染就会失效
            //因此你需要在相应的地方，执行下述方法来手动渲染，跟这类似的还有 element.init();
            form.render();
        });

    })


    $(".primary").click(function () {
        layui.use(["layer","form"],function () {
            var layer = layui.layer;
            layer.open({
                title:"创建相册",
                content:"<span style='float: left;margin-left: 30px;'>相册名称:&nbsp;&nbsp;</span><input id='albumname' type='text' style='width: 50%;margin-bottom: 30px;'/><br/>"+
                    "<span style='float: left;margin-left: 30px'>相册描述:&nbsp;&nbsp;</span><textarea id='albumdesc' placeholder='说说关于相册的故事(非必填)...' style='width: 50%;height: 50%'></textarea>",
                area:["20%","35%"],
                btn:["确定","取消"],
                shadeClose : false,
                shade:0.2,
                yes:function (index, layero) {
                    var albumname=$("#albumname").val();
                    var albumdesc=$("#albumdesc").val();
                    alert(albumname)
                    if (albumname.trim()==null||albumname.trim()=="") {
                        layer.msg("相册名称不能为空")
                    }else {
                        var date=new Date();
                        date=dateFtt("yyyy-MM-dd HH:mm:ss",date);
                        var album={
                            album_title:albumname,
                            album_content:albumdesc,
                            album_time:date,
                        };
                        $.ajax({
                            type:"post",
                            url:"album2",
                            data:JSON.stringify(album),
                            contentType:"application/json;charset=utf-8",
                            success:function (data) {
                            $("#grid").html(data)
                            }
                        })
                        layer.msg("创建成功")
                    }

                },btn2:function (index, layero) {
                    layer.msg("取消创建")
                },cancel: function(index, layero){
                    layer.msg("取消创建")
                }
            })
        })
    })



})

//前端时间
function dateFtt(fmt,date) { //author: meizz
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "H+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

