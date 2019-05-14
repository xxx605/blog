$(function () {
    $(".atitle").click(function () {
       var id =$(this).parents(".article").prop("id");
       $.ajax({
           type:"post",
           url:"detail",
           data:{
               aid:id
           },
           success:function () {
                location.href="detail?aid="+id;
           }
       })
    })
})
