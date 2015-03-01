/**
 * Created by li.lli on 2015/2/26.
 */
$(function(){
    //variable to be configed!!
    var url = "/login";
    //tooltip
    $('.yhelp').popover({trigger:'hover'});

    var userName = $("#userName"),
        password = $("#password"),
        verifyCode = $("#verifycode"),
        tip = $(".error-tip"),
        loginBtn = $("#loginBtn"),
        refCode = $(".refcode");

    //event define
    userName.on("blur",checkUserName);
    password.on("blur",checkPassword);
    verifyCode.on("blur",checkVerifyCode);
    loginBtn.on("click",loginSubmit);
    refCode.on("click",refreshCode);

    function checkVerifyCode() {
        if (!verifyCode || verifyCode.val().length < 4) {
            tip.html("请输入验证码").show();
            return false;
        }
        tip.hide();
        return true;
    }

    function checkUserName() {
        if (!userName || userName.val().length === 0) {
            tip.html("请输入用户名").show();
            return false;
        }
        tip.hide();
        return true;
    }

    function refreshCode(){
        refCode.src = '/verify.php?w=89&h=39rand=' + Math.random();
        return false;
    }

    function checkPassword() {
        if ( !password || password.val().length === 0) {
            tip.html("请输入密码").show();
            return false;
        } else if ( password.val().length < 6) {
            tip.html("密码过短").show();
            return false;
        }
        tip.hide();
        return true;
    }

    // 登录按钮操作
    function loginSubmit(){
        if(!checkUserName() || !checkPassword() || !checkVerifyCode()){
            return;
        }
        var isAutoLogin = $("#checkWeekly").is(":checked");
        $(".login-entry :input").attr("disabled", true);
        loginBtn.val("验证中...").addClass("disabled");
        //send data to server
        $.post(url,
            {
                "name" : userName.val(),
                "pwd" : md5(password.val()),
                "verify" : verifyCode.val(),
                "autoLogin" : isAutoLogin
            },
            function(result){
                if (result.code != 0) {
                    alert(result.msg);
                    return;
                }

                switch (result.data){
                    case 0:
                        window.location.href="/";
                    case -1:
                        tip.html("验证码错误").show();
                        break;
                    case -2:
                        tip.html("用户名不存在").show();
                        break;
                    case -3:
                        tip.html('您输入的用户名或密码有误').show();
                        break;
                    case -4:
                        tip.html('您已多次输入错误用户名或密码，错误超过10次后账户将被锁定.').show();
                        refreshCode(); //刷新验证码
                        break;
                    case -5:
                        tip.html("账户已被锁定，24小时后将会自动解锁，您也可以联系客服申请人工解锁").show();
                        break;
                    default :
                        tip.html("服务器错误,请稍后再试").show();
                }
                $(".login-entry :input").removeAttr('disabled');
                loginBtn.val("登录").removeClass("disabled");
            }
        );
    }
});