layui.use(['laypage', 'layer'], function(){
  var laypage = layui.laypage
  ,layer = layui.layer;
  /*var urlpath="";

    if ($(".layui-nav-item").eq(0).hasClass("layui-this")){
      urlpath="/";
    } else if ($(".layui-nav-item").eq(1).hasClass("layui-this")) {
      urlpath="article";
    }*/
if (counts>0) {
    laypage.render({
        elem: 'HomePage'
        , limit: 8
        , count: counts
        , layout: ['prev', 'page', 'next', "count", 'skip']
        , jump: function (obj, first) {
            var curr = parseInt(obj.curr);
            if (!first) {
                $.ajax({
                    type: "post",
                    url: "page",
                    async: false, //同步请求
                    data: {
                        curr: curr
                    },
                    success: function (data) {
                        $("#HomeConten").html(data);
                    },
                })

            }

        }
    });
}
})



