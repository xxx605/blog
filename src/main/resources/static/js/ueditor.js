$("button").click(function () {
    layui.use("layer", function () {
        var layer = layui.layer;
        layer.open({
            closeBtn :0,
            title:0,
            content:"确定发表文章吗",
            btn:['确定','取消'],
            area:['240px','160px'],
            shadeClose : false,
            btnAlign: 'c',
            yes:function (index, layero) {
                var context = UE.getEditor('container');
                var articletitle=$("#articleTitle").val();
                var classify=$(".classfiy").val()
                if (articletitle==null||articletitle.trim()==""){
                    layer.msg("标题不能为空")
                }else if(classify==""||classify==null){
                    layer.msg("你没有选择文章类型")
                }
                else {
                    var classify=$("option").eq(classify).text();
                    var author=$("#author").text()
                    if (context.getContent() != null) {
                        var path=imgUrlFun(context.getContent());
                        var text=context.getContentTxt();
                        console.info(text);
                        var date=new Date();
                        date=dateFtt("yyyy-MM-dd HH:mm:ss",date);
                        var articles={
                            a_context: context.getContent(),
                            a_title:articletitle,
                            a_time:date,
                            a_author:author,
                            a_classify:classify,
                            a_path:path,
                            a_text:text
                        }
                        $.ajax({
                            type: "post",
                            url: "issue",
                            data: JSON.stringify(articles),
                            contentType:"application/json;charset=utf-8",
                            success: function (data) {
                                if (data.issue == 1) {
                                    layer.msg("发表成功")
                                    context.setContent("请输入内容")
                                    $("#articleTitle").val("");
                                    $(".layui-input").val(null)
                                } else {
                                    layer.msg("你还没有登录")
                                }

                            },
                            dataType: "json",
                        })
                    } else {
                        layer.msg("你发表的内容为空")
                    }
                }
            },
            btn2:function (index, layero) {
                layer.msg("取消发表")
            }
        });
    });
})

function dateFtt(fmt,date)
{ //author: meizz
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "H+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

function imgUrlFun(str){
    var data = '';
    str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
        data =  capture;
    });
    return data
}
