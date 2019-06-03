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
                            a_nickname:author,
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


