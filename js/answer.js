var vm = new Vue({
	el: '#vm',
	data:{
		currentModuleIndex:0,
		currentTestIndex:0,
		currentTestHtmlText:'',	
		userInp:'',
		allTests:[],
		userAns: [],
        pointsNames:[],
	    ansResults:[],
		minutes:0,
		seconds:0,
		timerId:'',
		totalRightNum: 0,
		times:1,
		startTime:null,
        endTime:null,
        valList:[{
            isLine:true,
            val:''
        }],
        settings: {},
	    guessWordId:'',
        resultWrapper:{
            resultWrapper:true,
            showCursor:true
        },
		ansPosition:[]
	},
	computed:{		
		isCoverShow:function(){
			return this.currentModuleIndex == 0;
		},
		isAnswerShow:function(){
			return this.currentModuleIndex == 1;
		},
		isAnsResultShow:function(){
			return this.currentModuleIndex == 2;
		},
		totalTestNum:function(){
			return (!this.allTests) ? 0 : this.allTests.length;
		},
		clock:function(){
			var ret='';
			if(this.minutes < 10) ret += '0' + this.minutes;
			else ret += '' + this.minutes;
			
			ret += ':';
			
			if(this.seconds < 10) ret += '0' + this.seconds;
			else ret += '' + this.seconds;
			
			return ret;
		},
		accuracy:function(){
			return parseInt(100*this.totalRightNum/this.totalTestNum);
		},
		totalWrong:function(){
			return this.totalTestNum-this.totalRightNum;
		}		
	},
	methods:{
	    getDateTime:function(date){
	        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        },
		testNum:function(expr){
			return new RegExp("^\\d+$").test(expr);
		},		
		testOperator:function(expr){
		    var operators = ['+', '-', '*', 'x', '×', '÷', '/', '(', ')', '='];
			return operators.indexOf(expr) >= 0;
		},		
		testBlank:function(expr){
			return "?"== expr;
		},
        hideCursor:function () {
          return this.resultWrapper.showCursor = false
        },
        showCursor:function () {
            return this.resultWrapper.showCursor = true
        },
		getTotalRight:function(){
			var cnt=0;
			var _this=this;
			// this.allTests.map(function(test, idx){ if(test[test.length-1]==_this.userAns[idx]) cnt++	});
			this.userAns.map(function(ans, idx){ 
			    var test = _this.allTests[idx]; 
			    if(test[test.length-1]== ans) cnt++;
			});
			this.totalRightNum = cnt;
			return cnt;
		},
		getHtmlTextForTest:function(test){
		   /* var cont = '';
			for(var i=0; i<test.length-1; ++i){
				if(i==test.length-2) cont += "<em>=</em>";					
				var item=test[i];
				if(this.testNum(item)){
					cont += "<span>" + item + "</span>";
				} else if(this.testOperator(item)){
					cont += "<em>" + item + "</em>";
				} else if(this.testBlank(item)){
				    cont += '<span class="resultWrapper"><span class="inpWrap"><input type="text" class="inp" maxlength="15" readonly onclick="showCursor(this)" oninput="checkNum(this)" onblur="logInputMousePosition(this)"/><span class="line"></span></span></span>';
				}
			}			
			return cont;*/
		},
		presentTest:function(){
		    /*this.currentTestHtmlText = this.getHtmlTextForTest(this.allTests[this.currentTestIndex]);
		    Vue.nextTick(function () {
		        document.querySelector('.inp').focus();
		    });*/
			this.currentTestIndex++;			
		},
		beginAnswerClick:function(){		    
			this.currentModuleIndex = 1;
			this.coverWrapClass='';
			this.presentTest();
			this.startTime = this.getDateTime(new Date());
			this.timeCounting();			
		},
		nextTestClick:function(){
            var inpWrap = this.$refs.inpWrap[0].children;
	        var inpTxt = 0;
	        for(var j = 0;j < inpWrap.length;j++){
	        	if(inpWrap[j].innerHTML){
                    inpTxt += parseFloat(inpWrap[j].innerHTML)
                }
            }
		    var inpNum = parseFloat(inpTxt);
		    this.userAns.push(isNaN(inpNum) ? -1 : inpNum);
		    this.valList=[{
                isLine:true,
                val:''
            }];
			this.userInp = '';
			if(this.currentTestIndex >= this.totalTestNum){
			    this.pauseTimeCounting();
			    this.endTime = this.getDateTime(new Date());
				this.currentModuleIndex=2;				
				this.getTotalRight();
				for (var i = 0; i < this.allTests.length; ++i) this.ansResults.push(i);
				this.circleProgress(this.accuracy);
				this.submit();
				return;
			}
			this.presentTest();			
		},
		numberClick: function (evt) {
	        var _ = this;
		    var txt = evt.target.innerText;
		    var index=0;
		    for(var j = 0;j<this.valList.length;j++){
		    	if(this.valList[j].isLine){
		    		index=j
				}
			}
		    if (txt != '') {
		        if (this.userInp.length == 16) return;
		        var arr = [];
		        for (var i = 0; i < this.userInp.length; ++i) arr.push(this.userInp[i]);
		        arr.splice(inputLastMousePos++, 0, txt);
		        this.userInp = arr.join('');
                var userInp={
                    isLine:false,
                    val:txt
                }
                if(index==0){
                    this.valList.splice(0,0,userInp)
				}else{
                    this.valList.splice(index,0,userInp)
                }

		    } else if (txt == '' && this.userInp.length > 0) {
		        this.userInp = this.userInp.substring(0, this.userInp.length - 1);
		        if(index!=0){
                    this.valList.splice(index-1,1)
                }
            }
            this.$nextTick(function () {
                adjustUserInput();
            })

            //document.getElementsByClassName('inp')[0].value = this.userInp;
		    //moveCursor();
		},
		timeCounting:function() {
			var _this = this;
			this.timerId = setInterval(function(){
				_this.seconds += 1;
				if ( _this.seconds === 60 ) {
					_this.minutes += 1;
					_this.seconds = 0;
				}
			}, 1000);
		},
		pauseTimeCounting:function() {
			clearInterval(this.timerId);
			this.timerId = null;
		},
		getQueryString:function(name) { 
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
			var r = window.location.search.substr(1).match(reg); 
			if (r != null) return unescape(r[2]); return null; 
		},
		circleProgress:function(value){
			var canvas = document.getElementById("yuan");
			var context = canvas.getContext('2d');
			var _this = canvas,
			value= Number(value),// 当前百分比,数值
			// average = Number(average),// 平均百分比
			color = "",// 进度条、文字样式
			maxpercent = 100,//最大百分比，可设置
			c_width = _this.width,// canvas，宽度
			c_height =_this.height;// canvas,高度
			// 判断设置当前显示颜色
			color="#5ec373";
			// 清空画布
			context.clearRect(0, 0, c_width, c_height);
			// 画初始圆
			context.beginPath();
			// 将起始点移到canvas中心
			context.moveTo(c_width/2, c_height/2);
			// 绘制一个中心点为（c_width/2, c_height/2），半径为c_height/2，起始点0，终止点为Math.PI * 2的 整圆
			context.arc(c_width/2, c_height/2, c_height/2, 0, Math.PI * 2, false);
			context.closePath();
			context.fillStyle = '#efefef'; //填充颜色
			context.fill();
			// 绘制内圆
			context.beginPath();
			context.strokeStyle = color;
			context.lineCap = 'square';
			context.closePath();
			context.fill();
			context.lineWidth = 10.0;//绘制内圆的线宽度

			function draw(cur){
				// 画内部空白  
				context.beginPath();  
				context.moveTo(24, 24);  
				context.arc(c_width/2, c_height/2, c_height/2-10, 0, Math.PI * 2, true);  
				context.lineCap = 'round';
				context.closePath();  
				context.fillStyle = 'rgba(255,255,255,1)';  // 填充内部颜色
				context.fill();
				// 画内圆
				context.beginPath();
				// 绘制一个中心点为（c_width/2, c_height/2），半径为c_height/2-5不与外圆重叠，
				// 起始点-(Math.PI/2)，终止点为((Math.PI*2)*cur)-Math.PI/2的 整圆cur为每一次绘制的距离
				context.arc(c_width/2, c_height/2, c_height/2-5, -(Math.PI / 2), ((Math.PI * 2) * cur ) - Math.PI / 2, false);
				context.stroke();
				//在中间写字  
				context.font = "60px Arial";  // 字体大小，样式
				context.fillStyle = color;  // 颜色
				context.textAlign = 'center';  // 位置
				context.textBaseline = 'middle';  
				context.moveTo(c_width/2, c_height/2);  // 文字填充位置
				context.fillText(value+"%", c_width/2, c_height/2-15);
				context.font = "26px Microsoft YaHei";  // 字体大小，样式
				context.fillText("正确率", c_width/2, c_height/2+35);
			}
			// 调用定时器实现动态效果
			var timer=null,n=0;
			function loadCanvas(nowT){
				timer = setInterval(function(){
					if(n>nowT){
						clearInterval(timer);
					}else{
						draw(n);
						n += 0.01;
					}
				},15);
			}
			loadCanvas(value/100);
			timer=null;
		},
		getAnsResultItemHtml:function(idx){
			var test=this.allTests[idx], userAns=this.userAns[idx], ret, ansRight;			
			ret='<b>(' + (idx+1) + ')&nbsp;</b>';
			ansStatus = userAns==test[test.length-1] ? 'dui':'cuo';			
			for(var i=0; i<test.length-1; ++i){
				if(i==test.length-2) ret += '<em>=</em>';
				var item=test[i];
				if(this.testNum(item)){
					ret += '<span>' + item + '</span>';
				} else if(this.testOperator(item)){
					ret += '<em>' + item + '</em>';
				} else if (this.testBlank(item)) {
				    if (userAns == -1) {
				        ret += '<span class="' + ansStatus + '"></span>';
				    } else {
				        var showUserAns = userAns + '';
				        if (showUserAns.length > 4) {
				            showUserAns = showUserAns.substring(0, 2) + '...';
				            ret += '<span class="' + ansStatus + '" title="' + userAns + '">' + showUserAns + '</span>';
				        } else {
				            ret += '<span class="' + ansStatus + '">' + showUserAns + '</span>';
				        }
				    }
				}
			}	
			ret += '<i class="' + ansStatus + '"></i>'
			return ret;			
		},
 	    redo:function(){
 	        this.times++;
 	        this.currentModuleIndex = 0;
 	        this.userAns = [];
 	        this.ansResults = [];
 	        this.minutes = 0;
 	        this.seconds = 0; 	        
 	        this.totalRightNum = 0;
 	        this.currentTestIndex = 0;
 	    },
        submit:function(){
            var ansList = [];
            for (var i = 0; i < this.userAns.length; ++i) {
                var t = this.allTests[i], ansRight='-1';
                if (t[t.length - 1] == this.userAns[i]) {
                    ansRight = '0';
                } else {
                    ansRight = '1';
                }
                ansList.push({'ansRight': ansRight, 'point':this.pointsNames[i]});
            }
            var info = {
                questionType: 'mentalExercise', //习题类型定义
                guessWordId: this.guessWordId,
                userAnswerList: ansList, //回答的答案
                errorNum: this.totalWrong, //做错的试题选项数目
                trueNum: this.totalRightNum, //做对的试题选项数目
                checkNum: this.times, //学生重做次数
                times: 60 * this.minutes + this.seconds, //学生做题耗时
                startTime: this.startTime, //学生开始做题的时间
                endTime: this.endTime, //学生开始做题的时间
                userId: "000000000",                                // 预留字段固定
                userName: "cap",                                   // 预留字段固定
                platformCode: "133241",                            // 预留字段固定
                loginPlatformCode: "loginPlatformCode",            // 预留字段固定
                userSessionId: "userSessionId",
                objectType: '',
                objectId: '',
                title: '',
                score: 0
            };
            var urlParms = Vue.urlSearch;
            if (!urlParms || !urlParms['postUrl']) {
                if (!jslistener) return info;
                jslistener.backData(JSON.stringify(info));
                return;
            }
            
            var url = decodeURIComponent(urlParms['postUrl']);
            for(var v in urlParms) if(v!='postUrl') info[v] = urlParms[v];            
            axios.post(url, info).then(function(res){
                //console.log(res);
            }).catch(function(err){
                //console.log(err);
            });
        },
        lineTouchStart:function (e) {
			var inpWrap=document.querySelector('.inpWrap');
	    	var spans=inpWrap.children;
	    	var sLeft=[];
	    	for (var i = 0;i<spans.length;i++){
	    		if(spans[i].className=='line'){
	    			continue
				}
				sLeft.push(spans[i].offsetLeft)
			}
			this.ansPosition=sLeft
        },
        lineTouchMove:function (e) {
            var inpWrap=document.querySelector('.inpWrap');
            var scale=getComputedStyle(inpWrap).webkitTransform;
            if(scale){
            	scale=scale.split('(')[1].split(',')[0]
			}else{
            	scale=1
			}
            var cX=e.touches[0].clientX;
			var inpWrapLeft=getOffsetLeft(inpWrap);
			var x=(cX-inpWrapLeft)/scale;
			var lineIdx=0;
            var xNums=[];
            var line={
            	isLine:true,
				val:''
			}
            for(var j = 0; j<this.valList.length ; j++){
				if(this.valList[j].isLine){
					lineIdx=j
				}
			}
			for (var n = 0; n<this.ansPosition.length ; n++){
            	xNums.push(Math.abs(x-this.ansPosition[n]))
			}
			var xMin=Math.min.apply({},xNums);
            var idx=xNums.indexOf(xMin);
            this.valList.splice(lineIdx,1)
            if(x>this.ansPosition[this.ansPosition.length-1]){
				this.valList.splice(this.valList.length,0,line);
			}else{
                this.valList.splice(idx,0,line);
			}
        },
		lineTouchEnd:function (e) {
            var inpWrap=document.querySelector('.inpWrap');
            var scale=getComputedStyle(inpWrap).webkitTransform;
            if(scale){
                scale=scale.split('(')[1].split(',')[0]
            }else{
                scale=1
            }
            var cX=e.changedTouches[0].clientX;
            var inpWrapLeft=getOffsetLeft(inpWrap);
            var x=(cX-inpWrapLeft)/scale;
            var lineIdx=0;
            var xNums=[];
            var line={
                isLine:true,
                val:''
            }
            for(var j = 0; j<this.valList.length ; j++){
                if(this.valList[j].isLine){
                    lineIdx=j
                }
            }
            for (var n = 0; n<this.ansPosition.length ; n++){
                xNums.push(Math.abs(x-this.ansPosition[n]))
            }
            var xMin=Math.min.apply({},xNums);
            var idx=xNums.indexOf(xMin);
            this.valList.splice(lineIdx,1)
            if(x>this.ansPosition[this.ansPosition.length-1]){
                this.valList.splice(this.valList.length,0,line);
            }else{
                this.valList.splice(idx,0,line);
            }
        }
 	},
	created:function(){
		var _this = this;
		var param = this.getQueryString('name');
		axios.get('data/main.json').then(function(res){			
		    _this.points = res.data.points;
		    _this.guessWordId = res.data.guessWordId;
		    _this.points.map(function (point) { point.tests.map(function (t) { _this.allTests.push(t); _this.pointsNames.push(point.pointName); })});
		});
		axios.get('config/settings.json').then(function(res){
		    _this.settings = res.data;
		});
	}
});


var inputLastMousePos = 0;
function checkNum(inpElem) {
    if (isNaN(inpElem.value)) {
        inpElem.value = "";
        vm.userInp = "";
        return;
    }
    vm.userInp = inpElem.value;
    adjustUserInput();  
}

function logInputMousePosition(inpElem) {
    inputLastMousePos = inpElem.selectionEnd;
}


// 输入框自适应
function adjustUserInput() {
    var oWrap = document.querySelector('.resultWrapper'),
        oInpWrap=oWrap.querySelector('.inpWrap'),
        oInpWrapChildren=oInpWrap.children,
        oWrapW = parseInt(getComputedStyle(oWrap).width);
    var oInpWrapW=0;
    for(var i=0 ; i<oInpWrapChildren.length ; i++){
        oInpWrapW+= parseFloat(getComputedStyle(oInpWrapChildren[i]).width)
    }
    oInpWrapW+=2;
    oInpWrap.style.transform = "";
    if (oInpWrapW > oWrapW) {
        if (oInpWrapW > oWrapW) {
            oInpWrap.style.width=oInpWrapW+'px'
            var ratio = oWrapW / oInpWrapW;
            var left =0;
            oInpWrap.style.transform = 'matrix('+ratio+',0,0,'+ratio+','+left+',0)';
            oInpWrap.style.WebkitTransform = 'matrix('+ratio+',0,0,'+ratio+','+left+',0)';
        }else{
            oInpWrap.style.width=oWrapW+'px'
        }
    }
}

//获取元素距离浏览器最左边的距离
function getOffsetLeft (obj) {
    var tmp = obj.offsetLeft;
    var val = obj.offsetParent;
    while(val != null){
        tmp += val.offsetLeft;
        val = val.offsetParent;
    }
    return tmp;
}

