/**
 * Created by li.lli on 2015/2/20.
 */

$(function () {
    //infos about current user,value from server
    var user = {
        userId : '{$user_info.id}',
        fortune:'{$user_info.money}'
    };
    //infos about the product,value from server
    var loan = {
        loanId : '{$item.id}',
        productId : 'Z#{$item.id}',
        annualInterestRate : '{$item.rate}',
        fluctuateRate: '{$item.fluctuate_rate}',
        termCount : '{$item.investment_term}',
        maxLoanMoney: '{$item.max_loan_money}',
        minLoanMoney: '{$item.min_loan_money}'
    };
    //pager options
    var options = {
        items_per_page: 5, //Number of items per page
        next_text: "下一页", //"Previous" label
        prev_text: "上一页", //"Next" label
        num_display_entries: 10,//Number of pagination links shown
        num_edge_entries: 2, //Number of start and end points
        callback: pageselectCallback //callback function when click page num
    };
    //config info
    var config = {
        url: "mock/invest.json", //invest record ajax url
        chartUrl:"mock/chart.json",//highchart data ajax url
        element: $("#invest"), //parent dom of list elements
        template:$("#template")//dom of template
    };
    //initialize list
    renderContent(0, options.items_per_page,config);

    //highcharts
    renderCharts(loan.productId,config.chartUrl);

    //profit calculate
    calculateProfit($('#investInput'));

    //switch tab
    $('#investTabs a:first').tab('show');//初始化显示哪个tab
    $('#investTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    //tooltip
    $('.yhelp').popover({trigger:'hover'});

    //refresh verify code
    $(".refreshCode").bind("click",function(){
        $(this).src = '/verify.php?w=89&h=39rand=' + Math.random();
        return false;
    });
    /**
     * Callback function that displays the content.
     * Gets called every time the user clicks on a pagination link.
     * @param {int}page_index New Page index
     */
    function pageselectCallback(page_index) {
        renderContent(page_index, options.items_per_page,config);
        return false;
    }

    /**
     * ajax get content from server
     */
    function renderContent(page_index,page_size,config) {
        $.get(config.url, { index: page_index, pagesize: page_size },
            function (result) {
                if (result.code != 0) {
                    alert(result.msg);
                } else {
                    var totalNum = +result.data.total || 0;
                    var arr = [], i = 0, item,
                        content = result.data.content || [],
                        template = config.template.html(),
                        len = content.length;
                    Mustache.parse(template);   // optional, speeds up future uses

                    for (; i < len; i += 1) {
                        item = content[i];
                        arr.push(Mustache.render(template, item));
                    }

                   config.element.html(arr.join(' '));
                    //if pagination not initialized
                    if ($(".pagination a").length === 0) {
                        $("#pagination").pagination(totalNum, options);
                    }
                }
            }
        );
    }

    /**
     * render charts data
     */
    function renderCharts(productId,url){
        var data;
        $.get(url, { productId:productId},
            function (result) {
                if (result.code != 0) {
                    alert(result.msg);
                }else{
                    data = result.data;
                    if(data){
                        renderHightChart(data);
                    }
                }
            }
        );
    }

    /**
     * render charts
     */
    function renderHightChart(data){
        //render chart
        $('#charts').highcharts({
            title: {
                text: data.title,
                x: -20 //center
            },
            subtitle: {
                text: data.subtitle,
                x: -20
            },
            credits: {
                enabled:false
            },
            xAxis: {
                categories: data.xCategory
            },
            yAxis: {
                title: {
                    text: '收益 (%/年)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '%'
            },
            exporting: {
                enabled: false
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                enabled: false
            },
            series: data.content
        });
    }

    /**
     * calculate profit while inputing
     */
    function calculateProfit(ele){
        var holder = $('.exp'),
            chargeBtn = $('#rechargeBtn'),
            investBtn = $('#yxtInvestBtn');
        ele.on("keyup",function(){
            var investAmount = $('#investInput').val();
            if(isNaN(investAmount)){
                holder.html("预期收益  ¥ <em>0.00</em>");
            }else{
                var month = loan.termCount,
                    rate = loan.annualInterestRate,
                    fluctuateRate = loan.fluctuateRate,
                    totalProfit = parseFloat(investAmount) * ((parseFloat(rate) / 100 ) / 12) * parseFloat(month),
                    fluctuateRateTotal = parseFloat(investAmount) * ((parseFloat(fluctuateRate) / 100 ) / 12)* parseFloat(month);

                totalProfit = parseDigit(totalProfit,2);
                if(isNaN(totalProfit)){
                    holder.html("预期收益  ¥ <em>0.00~0.00</em>");
                }else{
                    holder.html("预期收益  ¥ <em>"+totalProfit.toFixed(2)+"~"+fluctuateRateTotal.toFixed(2)+"</em>");
                }
            }
            chargeBtn.hide();
            investBtn.show();
        });
    }

    /**
     * invest
     */
    function invest(){
        //if not login redirect
        if(!user || user.userId === '0'){
            var callbackUrl = "/user-login";
            window.location.href = decodeURIComponent(callbackUrl);
            return false;
        }
        //if input value is correct
        if(isValidInvest()){
            var investAmount = Number($('#investInput').val());
            var verifyCode = $('#authCode').val();
            var to_url = $("#to_url").val();
            var url = '/index.php?ctl=deal&act=dobid';
            if ( to_url  ) {
                url = to_url;
            }
            if ( !touzi_type  ) {
                touzi_type = "touzitong";
            }
            if(prepareForPlan == 1){
                var option = {
                    text: '抱歉，您不能对定存宝进行投资',
                    buttonCancel: false
                };
                Util.jDialog.Prompt(option);
                return false;
            }
            var authCode = $('#authCode');
            if($.trim(verifyCode) == ''){
                Util.arrowPrompt(authCode,'请输入验证码', 'err');
                return false;
            }
            if($('#useCoupon').hasClass("selected")){
                couponId = $("#availableCouponAmount").attr("couponid");
            }else{
                couponId = null;
            }
            if(!$('#agreeContract').hasClass("selected")){
                Util.arrowPrompt($('#agreeContract'),'请同意《中利贷网投资管理协议》', 'err');
                return false;
            }
            $("#yxtInvestBtn").attr("href","javascript:;").html("正在投资...").addClass("gbtn-disabled");
            $.post(url, {
                    'id' : loan.loanId,
                    'bid_money' : investAmount,
                    'verifyCode' : verifyCode
                },function(data){
                    var message = data.split(',')[0];
                    if(message !=null && message!='') {
                        if(data == '验证码错误'){
                            Util.arrowPrompt($("#authCode"),'验证码错误', 'err');
                            coderefresh();
                            $("#yxtInvestBtn").attr("href","javascript:invest();").html("我要投资").removeClass("gbtn-disabled");
                        }else{
                            var option = {
                                text: data,
                                buttonCancel: false,
                                confirmCallback: function(){if ( "请先登录," === data ){window.location.href="/user-login";}else{window.location.reload();}},
                                cancelCallback: function(){window.location.reload();}
                            };
                            Util.jDialog.Prompt(option);
                        }
                    }else{
                        var callbackUrl = "/invest-investSuccess";
                        window.location.href = decodeURIComponent(callbackUrl);
                    }
                }, "text"
            );
        }
    }

    function isValidInvest(){
        var userCash = parseFloat(user.fortune),
            minLoanMoney = parseFloat(loan.minLoanMoney),//可投金额
            maxLoanMoney = parseFloat(loan.maxLoanMoney),
            investElement = $('#investInput'),
            investValue = investElement.val(),
            reg = /^\d+$/;
        if(maxLoanMoney == 0){
            showPopOver(investElement,'当前月息通已满');
            showInvestBtn();
            return false;
        }
        if(!reg.test(investValue)) {//is input value is valid
            showPopOver(investElement,'请输入'+minLoanMoney+'~'+maxLoanMoney+'的整数');
            showInvestBtn();
            return false;
        }
        investValue = parseFloat(investValue);
        if(investValue > maxLoanMoney){
            showPopOver(investElement,'项目最多只能投资'+maxLoanMoney+'元');
            showRechargeBtn();
            return false;
        }
        if(userCash <= investValue){
            showPopOver(investElement,'您的余额(￥'+ parseDigit(userCash,2)+')不足');
            showRechargeBtn();
            return false;
        }
        if(investValue < minLoanMoney){
            showPopOver(investElement,'每笔最少需投'+minLoanMoney+'元');
            showInvestBtn();
            return false;
        }
        //为了下一次投资留有最小余额
        if (((maxLoanMoney - investValue) < minLoanMoney) && Math.abs(leftAmount - investInput) > 0.1) {
            var requiredLeftAmount = maxLoanMoney - minLoanMoney;
            if(requiredLeftAmount > minLoanMoney){
                showPopOver(investElement,'可投金额为'+maxLoanMoney+'或50~'+requiredLeftAmount);
            }else{
                showPopOver(investElement,'可投金额为'+maxLoanMoney);
            }
            showInvestBtn();
            return false;
        }
        showInvestBtn();
        return true;
    }

    function showRechargeBtn(){
        $('#rechargeBtn').show();
        $('#yxtInvestBtn').hide();
    }

    function showInvestBtn(){
        $('#rechargeBtn').hide();
        $('#yxtInvestBtn').show();
    }

    function showPopOver(ele,detail){
        ele.popover('show',{content:detail});
        $(document).on('click',function(){
            ele.popover('destroy');
        });
    }
    /**
     * 四舍五入，保留n位小数
     */
    function parseDigit(dight, n){
        dight = Math.round(dight*Math.pow(10,n))/Math.pow(10,n);
        return dight;
    }

}());