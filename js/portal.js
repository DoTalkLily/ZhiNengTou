    /**
     * Created by li.lli on 2015/2/15.
     */
    /*
     * RretroNum 目前只有这个页面用到，如果其他页面也用到再抽离
     */
    var RretroNum = function (el) {
        this.parent = el;
        if (!this.parent) {
            return;
        }
        this.num = this.parent.getAttribute('data-num');
        this.init();
    };
    RretroNum.prototype.init = function(){
        var i,numComma,numDot;
        this.parent.innerHTML = '';
        this.numArray = [];
        this.numArray = this.num.split('');
        this.numLength = this.numArray.length;
        for (i = 0 ; i < this.numLength ; i++){
            if(!isNaN(this.numArray[i])){
                this.creatNum(this.numArray[i]);
            }else if(this.numArray[i] === ',' || this.numArray[i] === '，'){
                numComma = document.createElement('div');
                numComma.className = 'j-num-comma';
                this.parent.appendChild(numComma);
            }else{
                numDot = document.createElement('div');
                numDot.className = 'j-num-dot';
                this.parent.appendChild(numDot);
            }
        }
    };
    RretroNum.prototype.creatNum = function(num){
        var container = document.createElement('div'),
            numTop = document.createElement('span'),
            numBottom = document.createElement('span');

        container.className = 'num-item j-num-'+num;
        numTop.className = 'num-item-top j-num-top-0';
        numBottom.className = 'num-item-bottom j-num-bottom-0';
        container.appendChild(numTop);
        container.appendChild(numBottom);
        this.parent.appendChild(container);

        if(num > 0){
            var newNum = 0;
            var showNum = function(num){
                var newNumTop = document.createElement('span'),
                    newNumBottom = document.createElement('span');
                newNumTop.className = 'new-num-top j-num-top-'+ num ;
                newNumBottom.className = 'new-num-bottom j-num-bottom-'+ num ;
                container.appendChild(newNumTop);
                //numTop.style.cssText += 'height:0;';
                $(numTop).animate({height:"0" , top:'54px'},100, function(){
                    container.appendChild(newNumBottom);
                    $(newNumBottom).css({height:"0"});
                    $(newNumBottom).animate({height:"50px"},80, function(){
                        numTop.parentNode.removeChild(numTop);
                        numBottom.parentNode.removeChild(numBottom);
                        numTop = newNumTop;
                        numBottom = newNumBottom;
                        newNumTop = null;
                        newNumBottom = null;
                        numTop.className = 'num-item-top j-num-top-'+ num ;
                        numBottom.className = 'num-item-bottom j-num-bottom-'+ num ;
                    });
                });
            };
            this.timer = setInterval(function(){
                newNum++;
                if(newNum <= num){
                    showNum(newNum);
                }else{
                    this.timer = null;
                }
            }, 300);
        }
    };

    function moveOpacity(id,child1,child2,child3)
    {
        id.find(child1).stop().animate({opacity:0.6},500,function(){
            id.find(child2).stop().animate({opacity:0.4},500,function(){
                id.find(child3).stop().animate({opacity:0.2},500,function(){
                    id.find(child3).stop().animate({opacity:0},500,function(){
                        id.find(child2).stop().animate({opacity:0},500,function(){
                            id.find(child1).stop().animate({opacity:0},1000,function(){
                                if(id.b)
                                {
                                    moveOpacity(id,child1,child2,child3);
                                }
                                else{
                                    if(id.find(child1).css("opacity")==="0" && id.find(child2).css("opacity")==="0" && id.find(child3).css("opacity")==="0")
                                    {
                                        id.find(child1).stop();
                                        id.find(child2).stop();
                                        id.find(child3).stop();
                                    }
                                }
                            });
                        });
                    });
                });
            });});
    }

    function tantan(iClass){
        iClass.animate({left: 28},100,function(){
            iClass.stop().animate({left: 16},100,function(){
                iClass.stop().animate({left: 24},100,function(){
                    iClass.stop().animate({left: 18},100);
                });
            });
        });
    }

    $(function () {
        'use strict';
        $(".qq_czb span").hover(function(){
            $(".erweima").show();
        },function(){
            $(".erweima").hide();
        });

        /*********************************************浮动收益*/
        function runIn(){
            $('.panel').show().animate({'top': '60px'}, 1200);
        }
        setTimeout(runIn,500);

        /*********************************************浮动收益数字翻页*/
        function fanYe(){
            new RretroNum($('.JS-number')[0]);
            new RretroNum($('.JS-newnumber')[0]);
        }
        setTimeout(fanYe,1000);

        /*********************************************产品圆球呼吸色*/

        /* 发光部分 */
        var buyId=null,
            buyCh1=$(".safe_pic_s3"),
            buyCh2=$(".safe_pic_s2"),
            buyCh3=$(".safe_pic_s1"),
            oId=null,
            buy_numCh1=$(".buy_span1"),
            buy_numCh2=$(".buy_span2"),
            buy_numCh3=$(".buy_span3");

        $(".safe_c_con").bind("mouseenter",function(){
            buyId=$(this);
            moveOpacity(buyId,buyCh1,buyCh2,buyCh3);
            buyId.b=true;

            oId=$(".buy_num_lv").eq($(this).index());
            moveOpacity(oId,buy_numCh1,buy_numCh2,buy_numCh3);
            oId.b=true;
        }).bind("mouseleave",function(){
            buyId.b=false;
            oId.b=false;
        });

        /* 发光部分结束 */
        /* 左右 */
        $(".safe_c_con").mouseenter(function(event) {
            var num= $(this).index();
            var btnObj = $(".safe_c_con").eq(num).find(".safe_c_con_bottom").find(".safe_use");
            tantan(btnObj);
        });

        /* 结束 */
        /*********************************************产品特点hover*/
        $('.features_con_con').hover(function() {
            $(this).find('.features_con_con_dis').stop().animate({'height':'100px'}, 500).css({'border-top':'2px solid #fff'});
            $(this).find('p').css({
                cursor: 'pointer',
                color: '#FF6600'
            });
        }, function() {
            var _this = $(this);
            _this.find('.features_con_con_dis').stop().animate({'height':'0px'}, function(){
                _this.find('.features_con_con_dis').css({'border':'0px'});
            });
            _this.find('p').css({
                cursor: 'pointer',
                color: '#555'
            });
        });

        /*guideline page */
        /*********************************************产品特点hover*/
        var charId=null;
        var charCh1=$(".char_2_a_c1");
        var charCh2=$(".char_2_a_c2");
        var charCh3=$(".char_2_a_c3");

        $('.char_con_con_top').hover(
            function() {
                var _this = $(this);
                charId=$(this);
                moveOpacity(charId,charCh1,charCh2,charCh3);
                charId.b=true;
                _this.find('.char_2_c').stop().css({width: '110px'}).animate({left: '138px',width: '0px'});
            },
            function() {
                charId.b=false;
                $(this).find('.char_2_c').stop().css({width: '0px',left: '28px'});
            });
    }());