/**
 * Created by li.lli on 2015/2/26.
 */
$(function () {
    //config infos 注册登录建议用https保证密码安全
    var NAME_URL = "mock/user-docheck_username.json",//验证用户名可用ajax url
        REGISTER_URL = "/user-doregister",//注册页面数据ajax url
        AUTHENTICATE_URL = "/user-authenticate",//注册成功页面 认证用户名身份证ajax url
        USER_VERYFY_URL = "/user-active_Mobile",//验证按钮ajax url
        USER_SEND_MSG_URL = "/index.php?ctl=user&act=send_checkPhone",//发送验证短信ajax url
        REGISTER_NEXT_URL = "/user-rverify",//注册页面下一步url
        USER_ACTIVE_SUCCESS = "/user-active_success",

        SEND_PHONE_MSG_TYPE = 1, //发送验证码时发送的类型
        PWD_RULE = new RegExp("^.*[A-Za-z0-9\\w_-]+.*$"),//密码正则表达式
        ID_CARD_RULE = new RegExp("(^\\d{15}$)|(^\\d{18}$)|(^\\d{17})(\\d|X|x)$"),//身份证正则表达式
        MOBILE_RULE = new RegExp("^((13[0-9])|(15[^4,\\D])|(17[0-9])|(18[0-9]))\\d{8}$");//手机号正则表达式
    //variables
    var nameEle = $('#username'),
        mobileEle = $('#mobile'),
        pwdEle = $('#signPwd'),
        repwdEle = $('#signPwdRepeat'),
        verifyCodeEle = $('#authCode'),
        registerBtn = $('#registerBtn'),
        refreshBtn = $(".refcode"),
        successIcon = "<i class='icons green-proper'></i>",
    //verify page
        sendMsgBtn = $("#msgCode"),
        verifyBtn = $("#verifyBtn"),
        codeInput = $("#mobileValidateCode"),
    //register success page
        realNameEle = $("#realName"),
        idNumberEle = $("#idNumber"),
        authenticateBtn = $("#authenticate");

    //input correct tag to use in register btn event
    var isNameRight = false,
        isPwdRight = false,
        isRePwdRight = false,
        isMobileRight = false,
        isVeriCodeRight = false,
        isIdNumberRight = false;

    //bind event
    pwdEle.on('blur', checkPwd);
    nameEle.on('blur', checkName);
    mobileEle.on('blur', checkMobile);
    repwdEle.on('blur', checkReinputPwd);
    verifyCodeEle.on('blur', checkVerifyCode);
    refreshBtn.on('click', refreshCode);
    registerBtn.on('click', register);
    //verify page
    sendMsgBtn.on('click', sendVerifycode);
    verifyBtn.on('click', verifyBtnEvent);
    //register success page
    realNameEle.on('blur', checkRealName);
    idNumberEle.on('blur', checkIdCard);
    authenticateBtn.on('click', authenticate);


    //verify page msg code input blur
    codeInput.on('click', function () {
        $(this).parent().find('.tip').html("");
    });
    //protocol checkbox event
    $("#protocol").on('click', function () {
        if ($(this).is(":checked")) {
            $(this).next('.tip').html("");
        }
    });

    /**refresh verify code **/
    function refreshCode() {
        $("#verifycode").src = '/verify.php?w=89&h=39rand=' + Math.random();
        return false;
    }

    /** check name**/
    function checkName() {
        isNameRight = false;
        var name = nameEle.val(),
            tip = nameEle.next('.tip');
        if (!name) {
            tip.html("昵称不能为空");
        } else if (name.length < 4 || name.length >= 20) {
            tip.html("昵称长度控制在4~20个字符");
        } else {
            $.post(NAME_URL, { username: name }, nameHandler, "json");//async ajax
        }
    }

    /** name ajax result handler**/
    function nameHandler(result) {
        var tip = nameEle.next('.tip');
        if (result.code != 200) {
            tip.html(result.msg);
            return;
        }
        if (result.data == 1) {
            tip.html("ID已被注册");
        } else if (result.data == 3) {
            tip.html("ID非法！");
        } else {
            isNameRight = true;
            tip.html(successIcon);
        }
    }

    /** check password **/
    function checkPwd() {
        isPwdRight = false;
        var pwd = pwdEle.val(),
            tip = pwdEle.next('.tip');
        if (!pwd) {
            tip.html("密码不能为空");
        } else if (pwd.length < 6 || pwd.length > 16) {
            tip.html("密码长度为6~16位");
        } else if (!PWD_RULE.test(pwd)) {
            tip.html("密码由字母数字下划线组成");
        } else {
            isPwdRight = true;
            tip.html(successIcon);
        }
    }

    /** check re input password**/
    function checkReinputPwd() {
        isRePwdRight = false;
        var repwd = repwdEle.val(),
            tip = repwdEle.next('.tip');
        if (!pwdEle.val()) {
            tip.html("请先输入密码");
        } else if (!repwd) {
            tip.html("请再输入一次密码");
        } else if (repwd !== pwdEle.val()) {
            tip.html("两次密码不一致");
        } else {
            isRePwdRight = true;
            tip.html(successIcon);
        }
    }

    /** check mobile 这里是否需要验证同一个手机是否已注册？**/
    function checkMobile() {
        isMobileRight = false;
        var mobile = mobileEle.val(),
            tip = mobileEle.next('.tip');
        if (!mobile) {
            tip.html("手机号不能为空");
        } else if (!MOBILE_RULE.test(mobile)) {
            tip.html("手机号格式不正确");
        } else {
            isMobileRight = true;
            console.log("aaaa");
            tip.html(successIcon);
        }
    }

    /** check verify code **/
    function checkVerifyCode() {
        isVeriCodeRight = false;
        var code = verifyCodeEle.val(),
            tip = verifyCodeEle.next('.tip');
        if (!code) {
            tip.html("请输入验证码");
        } else {
            isVeriCodeRight = true;
            tip.html("");
        }
    }

    /** register btn click**/
    function register() {
        var protocol = $("#protocol");
        if (!protocol.is(":checked")) {
            protocol.next(".tip").html("请先同意协议条款");
        }
        if (!isNameRight) {
            checkName();
            return;
        }
        if (!isMobileRight) {
            checkMobile();
            return;
        }
        if (!isPwdRight) {
            checkPwd();
            return;
        }
        if (!isRePwdRight) {
            checkReinputPwd();
            return;
        }
        if (!isVeriCodeRight) {
            checkVerifyCode();
            return;
        }
        //input is right
        var allInputElement = $(".reg-items :text");
        allInputElement.attr("disabled", true);
        $.post(
            REGISTER_URL,
            {
                "user_name": nameEle.val(),
                "user_pwd": md5(pwdEle.val()),
                "mobile": mobileEle.val(),
                "verify": verifyCodeEle.val()
            },
            function (result) {
                if (result.code != 200) {
                    alert(result.msg);
                    return;
                }
                if (result.data === "0") {
                    allInputElement.removeAttr('disabled');
                    verifyCodeEle.next('.tip').html("验证码错误");
                    refreshCode();//refresh code
                } else if (result.data === "-3") {
                    allInputElement.removeAttr('disabled');
                    nameEle.next('.tip').html("注册失败");
                    refreshCode();
                } else {
                    window.location.href = REGISTER_NEXT_URL;
                }
            }, "json");
        return false;
    }

    /** user verify page **/
    function verifyBtnEvent() {
        var tip = codeInput.parent().find('.tip');
        if (!codeInput.val()) {
            tip.html("请输入验证码");
            return;
        } else if (!codeInput.val().length === 5) {
            tip.html("验证码有错误");
            return;
        }
        codeInput.attr("disabled", true);//输入置灰
        $.post(
            USER_VERYFY_URL,
            {
                "validteCode": codeInput.val()
            },
            function (result) {
                codeInput.removeAttr('disabled');
                if (result.code != 200) {
                    alert(result.msg);
                    return;
                }
                switch (parseInt(result.data)) {
                    case 0:
                        tip.html("验证出现错误，请重新验证");
                        break;
                    case -1:
                        tip.html("验证码错误");
                        break;
                    case -2:
                        tip.html("用户已激活");
                        break;
                    case -3:
                        tip.html("用户昵称已存在");
                        break;
                    case -4:
                        tip.html("激活用户失败");
                        break;
                    default:
                        tip.html("");
                        window.location.href = USER_ACTIVE_SUCCESS;
                }
            }, "json");
        return false;
    }

    /**获取验证短信**/
    function sendVerifycode() {
        $(".reg-message").show();
        var tip = $(".input-area .tip");
        $.post(
            USER_SEND_MSG_URL,
            {
                "sendType": SEND_PHONE_MSG_TYPE
            },
            function (result) {
                if (result.code != 200) {
                    alert(result.msg);
                    return;
                }
                if (result.data === "0") {
                    tip.html('重新发送失败');
                } else if (result.data === "-1") {
                    tip.html('一分钟只能获取一次验证码');
                } else if (result.data === "-2") {
                    tip.html('手机号已被注册');
                } else {
                    tip.html("");
                }
            }, "json");
        return false;
    }

    /** register success page logic**/
    function checkRealName() {
        isNameRight = false;
        var name = realNameEle.val(),
            tip = realNameEle.next('.tip');
        if (!name) {
            tip.html("真实姓名不能为空");
        } else if (name.length < 2 || name.length >= 15) {
            tip.html("姓名长度不正确");
        } else {
            tip.html("");
            isNameRight = true;
        }
    }

    function checkIdCard() {
        isIdNumberRight = false;
        var idNum = idNumberEle.val(),
            tip = idNumberEle.next('.tip');
        if (!idNum) {
            tip.html("请输入身份证号码");
        } else if (!ID_CARD_RULE.test(idNum)) {
            tip.html("身份证号码格式不正确");
        } else {
            isIdNumberRight = true;
            tip.html("");
        }
    }

    function authenticate() {
        if (!isNameRight) {
            checkName();
            return;
        }
        if (!isIdNumberRight) {
            checkIdCard();
            return;
        }

        var allInputElement = $(".reg-items :text");
        allInputElement.attr("disabled", true);
        $.post(
            AUTHENTICATE_URL,
            {
                "user_name": nameEle.val(),
                "user_id": idNumberEle.val()
            },
            function (result) {
                if (result.code != 200) {
                    allInputElement.removeAttr('disabled');
                    alert("注册失败");
                    return;
                }
                window.location.href = "/";//认证成功跳转到首页
            }, "json");
        return false;
    }

}());