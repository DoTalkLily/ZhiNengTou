/**
 * Created by li.lli on 2015/2/28.
 */
$(function(){
    var CHECK_PHONE_URL = "";
    //element
    var mobileEle = $("#mobile"),
        verifyCodeEle = $("#authCode");
    //valid tag
    var isMobileRight = false,
        isCodeRight = false;

    /** ajax 验证手机号码有效性 **/
    function checkMobile(str){
        $.ajaxSetup({
            async: false
        });
        var rs;
        $.get("/index.php?ctl=user&act=checkmobile&phone="+str+"&d="+ new Date().getTime(), function(result){
            rs = result;
        });
        return rs;
    };

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
});