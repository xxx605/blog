
$(document).ready(function(){

		
		
	var j=true;
	$(".eye").click(function(){
		if(j==true){
			$("#password").attr("type","text");
			$(".eye").attr("src","../../img/eyeh.png");
			j=false;
		}else{
			$("#password").attr("type","password");
			$(".eye").attr("src","../../img/eyes.png");
			j=true;
		}
	})




	$("#login").focus(function () {
		$("#sp1").html("&nbsp")
	})
	$("#login").blur(function () {
		if ($("#login").val().trim()==""||$("#login").val()==null){
			$("#sp1").text("用户名不能为空")
		}
	})

	$("#password").focus(function () {
		$("#sp2").html("&nbsp")
	})
	$("#password").blur(function () {
		if ($("#password").val().trim()==""||$("#password").val()==null){
			$("#sp2").text("密码不能为空")
		}
	})

	$("#code").focus(function () {
		$("#sp3").html("&nbsp")
	})
	$("#code").blur(function () {
		if ($("#code").val().trim()==""||$("#code").val()==null){
			$("#sp3").text("验证码不能为空")
		}
	})

	var flag=false;
	$("#btn").on("click",function(){
		var name=$("#login").val();
		var pwd=$("#password").val();
		var code=$("#code").val();

		if (name.trim()==""||name.trim()==null){
			$("#sp1").text("用户名不能为空")
			flag=false;
		}
		if (pwd.trim()==""||pwd.trim()==null){
			$("#sp2").text("密码不能为空")
			flag=false;
		}
		if (code.trim()==""||code.trim()==null){
			$("#sp3").text("验证码不能为空")
			flag=false;
		}
		if (name.trim()!=""&&name.trim()!=null&&pwd.trim()!=""&&pwd.trim()!=null&&code.trim()!=""&&code.trim()!=null){
				flag=true;
		}
		if(flag==true) {
		var user={username: name,
				password: pwd,
				code:code}
			$.ajax({
				type: "post",
				url: "/logincode",
				data: JSON.stringify(user),
				contentType:"application/json;charset=utf-8",
				success:function (data) {
					if(data.info=="1"){
						$("#sp3").text("验证码有误!")
					}else if(data.info=="2"){
						$("#sp1").text("用户名有误!")
					}
					else if(data.info=="3"){
						$("#sp2").text("密码有误!")
					}else{
						alert("登陆成功!")
						location.href="/";
					}
				},
				dataType: "json",
			})
		}
	})

	


})