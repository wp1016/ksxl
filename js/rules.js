var RULES = {
	version:'1.0.0',
	
	/*
		随机生成[min, max]范围内的整数
	*/
	randomBothBounds:function(min, max){
		if(min == max) return min;
		var m, n;
		m = min < max ? min : max;
		n = min + max - m;
		return Math.round(Math.random()*(n-m)+m);
	},
	
	/*
		随机生成[min, max)范围内的整数
	*/
	randomLowerBound:function(min, max){
		if(min == max) return min;
		var m, n;
		m = min < max ? min : max;
		n = min + max - m;
		return parseInt(Math.random()*(n-m)+m, 10);
	},
	
	/*
		判断数组中是否存在某个元素，若存在返回该元素首次出现时的索引值，否则返回-1
	*/
	indexOf:function(arr, elem){
		if(!arr || !elem) return -1;
		var ret=-1;
		for(var i=0; i<arr.length;++i){
			if(arr[i] === elem){
				ret = i;
				break;
			}
		}
		return ret;
	},
	
	/*
		判断是否可以出现重复的算式
	*/
	getAllowRepeat:function(expetedCount, maxCount, userAllowed){
		var ret = false;
		if(userAllowed === undefined)
			ret = expetedCount > maxCount;
		else if(expetedCount > maxCount) 
			ret = true;	
		else
			ret = userAllowed;
		return ret;
	},
		
	/* 
		知识点: 5以内的加法
		规则ID: 10-001-0001
		描述: a+b (0<a+b≤5,0<a≤5,0<b≤5,a、b是整数)	
	*/
	rule_10_001_0001:function(count){
		if(count <= 0) return null;			
		var lib = [
			['1', '+', '1', '?', '2'],
			['1', '+', '2', '?', '3'],
			['1', '+', '3', '?', '4'],
			['1', '+', '4', '?', '5'],
			['2', '+', '1', '?', '3'],
			['2', '+', '2', '?', '4'],
			['2', '+', '3', '?', '5'],
			['3', '+', '1', '?', '4'],
			['3', '+', '2', '?', '5'],
			['4', '+', '1', '?', '5']
		];
		var totalCnt = lib.length;
		if(count >= totalCnt) return {"title":"5以内的加法", "id":"10-001-0001", "maxCount":totalCnt,"tests":lib};
		else {
			var indexes = [];
			for(var i=0; i<count;) {
				var idx = Math.floor(Math.random()*(totalCnt));
				if(indexes.indexOf(idx) < 0){
					i++;
					indexes.push(idx);
				}
			}
			
			if(indexes != null && indexes.length > 0){
				var tests=[];
				indexes.map(function(i){tests.push(lib[i])});
				var ret = {"title":"5以内的加法", "id":"10-001-0001", "maxCount":totalCnt,"tests":tests};
				return ret;
			}
			return null;
		}		
	},
	
	/* 
		知识点: 5以内的减法
		规则ID: 10-001-0002
		描述: a-b (0<a-b<5 ,0<b<a≤5,a、b是整数)
	*/
	rule_10_001_0002:function(count){
		if(count <= 0) return null;			
		var lib = [
			['5', '-', '1', '?', '4'],
			['5', '-', '2', '?', '3'],
			['5', '-', '3', '?', '2'],
			['5', '-', '4', '?', '1'],
			['4', '-', '1', '?', '3'],
			['4', '-', '2', '?', '2'],
			['4', '-', '3', '?', '1'],
			['3', '-', '1', '?', '2'],
			['3', '-', '2', '?', '1'],
			['2', '-', '1', '?', '1']
		];
		var totalCnt = lib.length;
		if(count >= totalCnt) return {"title":"5以内的减法", "id":"10-001-0002", "maxCount":totalCnt,"tests":lib};
		else {
			var indexes = [];
			for(var i=0; i<count;) {
				var idx = Math.floor(Math.random()*(totalCnt));
				if(indexes.indexOf(idx) < 0){
					i++;
					indexes.push(idx);
				}
			}
			
			if(indexes != null && indexes.length > 0){
				var tests=[];
				indexes.map(function(i){tests.push(lib[i])});
				return {"title":"5以内的减法", "id":"10-001-0002", "maxCount":totalCnt,"tests":tests};
			}
			return null;
		}		
	},

	/* 
		知识点: 5以内有关0的加、减法
		规则ID: 10-001-0003
		描述: a+0或0+a（0≤a≤5,a是整数)
			  a-0（0≤a≤5,a是整数)；a-a(0≤a≤5,a是整数)
	*/
	rule_10_001_0003:function(count, allowRepeat){		
		if(count <= 0) return null;
		// 其实不重复的算式总共有23个，只需从中随机挑出所需数目即可
		var MAX_COUNT = 23, 
			finalCnt = count < MAX_COUNT ? count : MAX_COUNT;
		
		var canRepeat = this.getAllowRepeat(count, MAX_COUNT, allowRepeat);		
		
		var indexes = [];
		for(var i=0; i<count;){
			var a = this.randomBothBounds(0, MAX_COUNT-1);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] =a;			
		}
		
		var tests = [];
		indexes.map(function(it){			
			var num1, num2, op, bound = parseInt(it / 6);	
			if(bound == 0){
				num1 =  "" + it % 6;
				num2 = "0";
				op = "+";
			} else if(bound == 1){
				num1 = "0";
				num2 = "" + it % 6;
				op = "+";
			} else if(bound == 2){
				num1= "" + it % 6;
				num2= "0";
				op = "-";
			} else {
				num1 = "" + it % 6;
				num2 = "" + it % 6;
				op = "-";
			}
			tests.push([num1, op, num2, "?", eval(num1+op+num2)]);
		});		
		return {"title":"5以内有关0的加、减法", "id":"10-001-0003", "maxCount":MAX_COUNT,"tests":tests};
	},

	/*
		知识点: 6的分与合
		规则ID: 10-002-0001
		描述: a+b (a+b=6,0≤a≤6,0≤b≤6,a、b是整数)
		      6-b (0≤b≤6,b是整数)
		备注: 2+4=（ ）；2+（ ）=6；（ ）+4=6
			  6-2=（ ）；6-（ ）=4；（ ）-2=4
	*/
	rule_10_002_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var SUM=6, EQUATION_COUNT=7, BLANK_COUNT=3, OPERATION_COUNT=21, MAX_COUNT = OPERATION_COUNT * 2;
		var canRepeat = this.getAllowRepeat(count, MAX_COUNT, allowRepeat);
		
		var indexes = [];
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, MAX_COUNT);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		var tests = [];
		indexes.map(function(it){			
			var num1, num2, op, isAdd, blankPos;
			
			num1 = parseInt(it / EQUATION_COUNT);
			num2 = SUM - num1;
			blankPos = it % BLANK_COUNT;
			
			if(it < OPERATION_COUNT) {
				isAdd = true; 
				op = "+";
			}
			else {
				isAdd = false;
				op = "-";
			}
			
			if(isAdd){
				if(blankPos == 0)
					tests.push(["?", op, num2, SUM, num1]);
				else if(blankPos == 1)
					tests.push([num1, op, "?", SUM, num2]);
				else
					tests.push([num1, op, num2, "?", SUM]);						
			}else{
				if(blankPos == 0)
					tests.push(["?", op, num2, num1, SUM]);
				else if(blankPos == 1)
					tests.push([SUM, op, "?", num1, num2]);
				else
					tests.push([SUM, op, num2, "?", num1]);
			}
		});		
		return {"title": SUM+"的分与合", "id":"10-002-0001", "maxCount":MAX_COUNT,"tests":tests};
	},
	
	/*
		知识点: 7的分与合
		规则ID: 10-002-0002
		描述: a+b (a+b=7,0≤a≤7,0≤b≤7,a、b是整数)
			  7-b (0≤b≤7,b是整数)
		备注: 3+4=（ ）；3+（ ）=7；（ ）+4=7
			  7-3=（ ）；7-（ ）=4；（ ）-3=4	
	*/
	rule_10_002_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var SUM=7, EQUATION_COUNT=8, BLANK_COUNT=3, OPERATION_COUNT=24, MAX_COUNT = OPERATION_COUNT * 2;
		var canRepeat = this.getAllowRepeat(count, MAX_COUNT, allowRepeat);
		
		var indexes = [];
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, MAX_COUNT);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		var tests = [];
		indexes.map(function(it){			
			var num1, num2, op, isAdd, blankPos;
			
			num1 = parseInt(it / EQUATION_COUNT);
			num2 = SUM - num1;
			blankPos = it % BLANK_COUNT;
			
			if(it < OPERATION_COUNT) {
				isAdd = true; 
				op = "+";
			}
			else {
				isAdd = false;
				op = "-";
			}
			
			if(isAdd){
				if(blankPos == 0)
					tests.push(["?", op, num2, SUM, num1]);
				else if(blankPos == 1)
					tests.push([num1, op, "?", SUM, num2]);
				else
					tests.push([num1, op, num2, "?", SUM]);						
			}else{
				if(blankPos == 0)
					tests.push(["?", op, num2, num1, SUM]);
				else if(blankPos == 1)
					tests.push([SUM, op, "?", num1, num2]);
				else
					tests.push([SUM, op, num2, "?", num1]);
			}
		});		
		return {"title": SUM+"的分与合", "id":"10-001-0001", "maxCount":MAX_COUNT,"tests":tests};
	},
	
	/*
		知识点: 8的分与合
		规则ID: 10-002-0003
		描述: a+b (a+b=8,0≤a≤8,0≤b≤8,a、b是整数)
			  8-b (0≤b≤8,b是整数)
		备注: 2+6=（ ）；2+（ ）=8；（ ）+6=8
		      8-6=（ ）；8-（ ）=2；（ ）-6=2
	*/
	rule_10_002_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var SUM=8, EQUATION_COUNT=9, BLANK_COUNT=3, OPERATION_COUNT=27, MAX_COUNT = OPERATION_COUNT * 2;
		var canRepeat = this.getAllowRepeat(count, MAX_COUNT, allowRepeat);
		
		var indexes = [];
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, MAX_COUNT);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		var tests = [];
		indexes.map(function(it){			
			var num1, num2, op, isAdd, blankPos;
			
			num1 = parseInt(it / EQUATION_COUNT);
			num2 = SUM - num1;
			blankPos = it % BLANK_COUNT;
			
			if(it < OPERATION_COUNT) {
				isAdd = true; 
				op = "+";
			}
			else {
				isAdd = false;
				op = "-";
			}
			
			if(isAdd){
				if(blankPos == 0)
					tests.push(["?", op, num2, SUM, num1]);
				else if(blankPos == 1)
					tests.push([num1, op, "?", SUM, num2]);
				else
					tests.push([num1, op, num2, "?", SUM]);						
			}else{
				if(blankPos == 0)
					tests.push(["?", op, num2, num1, SUM]);
				else if(blankPos == 1)
					tests.push([SUM, op, "?", num1, num2]);
				else
					tests.push([SUM, op, num2, "?", num1]);
			}
		});		
		return {"title": SUM+"的分与合", "id":"10-002-0003", "maxCount":MAX_COUNT,"tests":tests};
	},
	
	/*
		知识点: 9的分与合
	    规则ID: 10-002-0004
	    描述: a+b (a+b=9,0≤a≤9,0≤b≤9,a、b是整数)
			  9-b (0≤b≤9,b是整数)
	    备注: 3+6=（ ）；3+（ ）=9；（ ）+6=9
			  9-3=（ ）；9-（ ）=6；（ ）-3=6
	*/
	rule_10_002_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var SUM=9, EQUATION_COUNT=10, BLANK_COUNT=3, OPERATION_COUNT=30, MAX_COUNT = OPERATION_COUNT * 2;
		var canRepeat = this.getAllowRepeat(count, MAX_COUNT, allowRepeat);
		
		var indexes = [];
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, MAX_COUNT);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		var tests = [];
		indexes.map(function(it){			
			var num1, num2, op, isAdd, blankPos;
			
			num1 = parseInt(it / EQUATION_COUNT);
			num2 = SUM - num1;
			blankPos = it % BLANK_COUNT;
			
			if(it < OPERATION_COUNT) {
				isAdd = true; 
				op = "+";
			}
			else {
				isAdd = false;
				op = "-";
			}
			
			if(isAdd){
				if(blankPos == 0)
					tests.push(["?", op, num2, SUM, num1]);
				else if(blankPos == 1)
					tests.push([num1, op, "?", SUM, num2]);
				else
					tests.push([num1, op, num2, "?", SUM]);						
			}else{
				if(blankPos == 0)
					tests.push(["?", op, num2, num1, SUM]);
				else if(blankPos == 1)
					tests.push([SUM, op, "?", num1, num2]);
				else
					tests.push([SUM, op, num2, "?", num1]);
			}
		});		
		return {"title": SUM+"的分与合", "id":"10-002-0004", "maxCount":MAX_COUNT,"tests":tests};
	},
	
	/*
		知识点: 10的分与合
	    规则ID: 10-002-0005
	    描述: a+b (a+b=10,0≤a≤10,0≤b≤10,a、b是整数)
			  10-b (0≤b≤10,b是整数)
	    备注: 3+7=（ ）；3+（ ）=10；（ ）+7=10
			  10-3=（ ）；10-（ ）=7；（ ）-3=7
	*/
	rule_10_002_0005:function(count, allowRepeat){
		if(count <= 0) return null;
		var SUM=10, EQUATION_COUNT=11, BLANK_COUNT=3, OPERATION_COUNT=33, MAX_COUNT = OPERATION_COUNT * 2;
		var canRepeat = this.getAllowRepeat(count, MAX_COUNT, allowRepeat);
		
		var indexes = [];
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, MAX_COUNT);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		var tests = [];
		indexes.map(function(it){			
			var num1, num2, op, isAdd, blankPos;
			
			num1 = parseInt(it / EQUATION_COUNT);
			num2 = SUM - num1;
			blankPos = it % BLANK_COUNT;
			
			if(it < OPERATION_COUNT) {
				isAdd = true; 
				op = "+";
			}
			else {
				isAdd = false;
				op = "-";
			}
			
			if(isAdd){
				if(blankPos == 0)
					tests.push(["?", op, num2, SUM, num1]);
				else if(blankPos == 1)
					tests.push([num1, op, "?", SUM, num2]);
				else
					tests.push([num1, op, num2, "?", SUM]);						
			}else{
				if(blankPos == 0)
					tests.push(["?", op, num2, num1, SUM]);
				else if(blankPos == 1)
					tests.push([SUM, op, "?", num1, num2]);
				else
					tests.push([SUM, op, num2, "?", num1]);
			}
		});		
		return {"title": SUM+"的分与合", "id":"10-002-0005", "maxCount":MAX_COUNT,"tests":tests};
	},
	
	/*
		知识点: 10以内数的连加
		规则ID: 10-002-0006
		描述: a+b+c（0≤a+b+c≤10，0≤a≤10，0≤b≤10，0≤c≤10，a、b、c是整数）
		备注: 2+3+4=（ ）
	*/
	rule_10_002_0006:function(count, allowRepeat){
		if(count <= 0) return null;		
		
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];
		for(var i=0; i<=10; i++){
			for(var j=0; j<=10; j++){
				for(var k=0; k<=10; k++){
					if(i+j+k<=10)allTests.push([i, j, k]);
				}
			}
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ 
			var item = allTests[i];
			tests.push([item[0], '+', item[1], '+', item[2], '?', item[0]+item[1]+item[2] ]);
		});
		
		return {"title":"10以内数的连加", "id":"10-002-0006", "maxCount":maxLength,"tests":tests};
	},
	
	/*
		知识点: 10以内数的连减
		规则ID: 10-002-0007
		描述: a-b-c（0≤a-b-c，0≤a≤10，0≤b≤10，0≤c≤10，a、b、c是整数）
		备注: 9-2-3=（ ）
	*/
	rule_10_002_0007:function(count, allowRepeat){
		if(count <= 0) return null;		
		
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];
		for(var i=2; i<=10; i++){
			for(var j=0; j<=10; j++){
				for(var k=0; k<=10; k++){
					if(i-j-k >= 0)allTests.push([i, j, k]);
				}
			}
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ 
			var item = allTests[i];
			tests.push([item[0], '-', item[1], '-', item[2], '?', item[0]-item[1]-item[2] ]);
		});
		
		return {"title":"10以内数的连减", "id":"10-002-0007", "maxCount":maxLength,"tests":tests};
	},
	
	/*
		知识点: 10以内数的加减混合
		规则ID: 10-002-0008
		描述: a+b-c（0≤a+b-c≤10，0≤a≤10，0≤b≤10，0≤c≤10，a、b、c是整数）
			  a-b+c（0≤a-b+c≤10，0≤a≤10，0≤b≤10，0≤c≤10，a、b、c是整数）
		备注: 3+4-1=（ ）；（ ）+4-1=6；3+（ ）-1=6；3+4-（ ）=6
			  5-3+2=（ ）；（ ）-3+2=4；5-（ ）+2=4；5-3+（ ）=4
	*/
	rule_10_002_0008:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=6000, canRepeat, allTests=[], tests=[];		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		var a,b,c,sum, optype, blankPos;
		for(var i=0; i<count;){
			a=this.randomBothBounds(0, 10);
			b=this.randomBothBounds(0, 10);
			c=this.randomBothBounds(0, 10);
			optype=this.randomBothBounds(0, 1);
			blankPos=this.randomBothBounds(0, 3);
			var arr=new Array();
			arr[0]=a;
			arr[2]=b;
			arr[4]=c;
			if(optype==0){
				arr[1]='+';
				arr[3]='-';
			}else{
				arr[1]='-';
				arr[3]='+';
			}
			sum=eval(arr.join(''));
			if(sum<0 || sum>10) continue;
			arr[5]=sum;
			switch(blankPos){
				case 0:
					arr[0]='?';
					arr[6]=a;
					break;
				case 1:
					arr[2]='?';
					arr[6]=b;
					break;
				case 2:
					arr[4]='?';
					arr[6]=c;
					break;
				case 3:
					arr[5]='?';
					arr[6]=sum;
					break;
			}
			var tmpstr = arr.join(' ');
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		
		allTests.map(function(str){tests.push(str.split(' '))});		 
		 
		return {"title":"10以内数的加减混合", "id":"10-002-0008", "maxCount":maxLength,"tests":tests};		
	},
	
	/*
		知识点: 10加几与相应的减法
		规则ID: 10-003-0001
		描述: 10+a或a+10（1≤a≤9，a是整数）
			  相应的减法：（10+a）-10，（10+a）-a
		备注: 10+5=（ ）；5+（ ）=15；（ ）+10=15
			  15-5=（ ）；15-（ ）=10；（ ）-10=5
	*/
	rule_10_003_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];
		for(var i=1; i<=9; i++){
			var ans = 10+i;
			allTests.push([10, '+', i, '?', ans]);
			allTests.push([i, '+', 10, '?', ans]);
			
			allTests.push([10, '+', '?', ans, i]);
			allTests.push([i, '+', '?', ans, 10]);
			
			allTests.push(['?', '+', 10, ans, i]);
			allTests.push(['?', '+', i, ans, 10]);
						
			allTests.push([ans, '-', i, '?', 10]);
			allTests.push([ans, '-', 10, '?', i]);
			
			allTests.push([ans, '-', '?', 10, i]);
			allTests.push([ans, '-', '?', i, 10]);
			
			allTests.push(['?', '-', i, 10, ans]);
			allTests.push(['?', '-', 10, i, ans]);
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"10加几与相应的减法", "id":"10-003-0001", "maxCount":maxLength,"tests":tests};	
	},
	
	/*
		知识点: 十几加几与相应的减法（不进位、不退位）
		规则ID: 10-003-0002
		描述: （10+a）+b（12≤（10+a）+b≤19，1≤a≤8，1≤b≤8，a、b是整数）
			  相应的减法：[（10+a）+b]-b,[（10+a）+b]-（10+a）
		备注: 12+3=（ ）；（ ）+3=15；12+（ ）=15
			  15-3=（ ）；（ ）-3=12；15-（ ）=12
	*/
	rule_10_003_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];
		for(var i=1; i<=8; i++){
			for(var j=10; j<=18; j++){
				var ans = i+j;
				if(ans <= 19 && ans >= 12){
					allTests.push([i, '+', j, '?', ans]);
					allTests.push([j, '+', i, '?', ans]);
					allTests.push([i, '+', '?', ans, j]);
					allTests.push([j, '+', '?', ans, i]);
					allTests.push(['?', '+', j, ans, i]);
					allTests.push(['?', '+', i, ans, j]);
				}
			}
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"十几加几与相应的减法（不进位、不退位）", "id":"10-003-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 9加几（进位）
		规则ID: 10-004-0001
		描述: 9+a或a+9 (2≤a≤9，a是整数）
		备注: 9+a=（ ）；a+9=（ ）
	*/
	rule_10_004_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], fac=9;
		for(var i=2; i<=9; i++){			
			var ans = i+fac;
			allTests.push([i, '+', fac, '?', ans]);
			allTests.push([fac, '+', i, '?', ans]);
			allTests.push([i, '+', '?', ans, fac]);
			allTests.push([fac, '+', '?', ans, i]);
			allTests.push(['?', '+', fac, ans, i]);
			allTests.push(['?', '+', i, ans, fac]);
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"9加几（进位）", "id":"10-004-0001", "maxCount":maxLength,"tests":tests};	
	},
	
	/*
		知识点: 8加几（进位）
		规则ID: 10-004-0002
		描述: 8+a或a+8 (3≤a≤9，a是整数）
		备注: 8+a=（ ）；a+8=（ ）
	*/
	rule_10_004_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], fac=8;
		for(var i=3; i<=9; i++){			
			var ans = i+fac;
			allTests.push([i, '+', fac, '?', ans]);
			allTests.push([fac, '+', i, '?', ans]);
			allTests.push([i, '+', '?', ans, fac]);
			allTests.push([fac, '+', '?', ans, i]);
			allTests.push(['?', '+', fac, ans, i]);
			allTests.push(['?', '+', i, ans, fac]);
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"8加几（进位）", "id":"10-004-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 7、6加几（进位）
		规则ID: 10-004-0003
		描述: 7+a或a+7 (4≤a≤9，a是整数）
			  6+a或a+6 (5≤a≤9，a是整数）
		备注: 7+a=（ ）；a+7=（ ）
			  6+a=（ ）；a+6=（ ）
	*/
	rule_10_004_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], facs=[6,7];
		
		facs.map(function(fac){
			for(var i=11-fac; i<=9; ++i){
				var ans = i+fac;
				allTests.push([i, '+', fac, '?', ans]);
				allTests.push([fac, '+', i, '?', ans]);
				allTests.push([i, '+', '?', ans, fac]);
				allTests.push([fac, '+', '?', ans, i]);
				allTests.push(['?', '+', fac, ans, i]);
				allTests.push(['?', '+', i, ans, fac]);
			}			
		});	
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"7、6加几（进位）", "id":"10-004-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 5、4、3、2加几（进位）
		规则ID: 10-004-0004
		描述: 5+a或a+5 (6≤a≤9，a是整数）
    		  4+a或a+4 (7≤a≤9，a是整数）
			  3+a或a+3 (8≤a≤9，a是整数）
			  2+a或a+2 (9≤a≤9，a是整数）
		备注: 5+a=（ ）；a+5=（ ）
			  4+a=（ ）；a+4=（ ）
			  3+a=（ ）；a+3=（ ）
			  2+a=（ ）；a+2=（ ）
	*/
	rule_10_004_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], facs=[5,4,3,2];
		
		facs.map(function(fac){
			for(var i=11-fac; i<=9; ++i){
				var ans = i+fac;
				allTests.push([i, '+', fac, '?', ans]);
				allTests.push([fac, '+', i, '?', ans]);
				allTests.push([i, '+', '?', ans, fac]);
				allTests.push([fac, '+', '?', ans, i]);
				allTests.push(['?', '+', fac, ans, i]);
				allTests.push(['?', '+', i, ans, fac]);
			}			
		});	
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"5、4、3、2加几（进位）", "id":"10-004-0004", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 十几减9(退位)
		规则ID: 11-001-0001
		描述: a-9（11≤a＜19，a是整数）
		备注: 15-9=（ ）；15-（ ）=9；（ ）+9=15；9+（ ）=15
	*/
	rule_11_001_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], fac=9;		
		
		for(var i=11; i<10+fac; ++i){
			var ans = i+fac;
			allTests.push([i, '+', fac, '?', ans]);
			allTests.push([fac, '+', i, '?', ans]);
			
			allTests.push([i, '+', '?', ans, fac]);
			allTests.push([fac, '+', '?', ans, i]);
			
			allTests.push(['?', '+', fac, ans, i]);
			allTests.push(['?', '+', i, ans, fac]);
			
			allTests.push([ans, '-', fac, '?', i]);			
			allTests.push([ans, '-', i, '?', fac]);
			
			allTests.push([ans, '-', '?', fac, i]);
			allTests.push([ans, '-', '?', i, fac]);
			
			allTests.push(['?', '-', fac, i, ans]);
			allTests.push(['?', '-', i, fac, ans]);
		}		
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"十几减9(退位)", "id":"11-001-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 十几减8（退位）
		规则ID: 11-001-0002
		描述: a-8（11≤a＜18，a是整数）
		备注: 15-8=（ ）；15-（ ）=8；（ ）+8=15；8+（ ）=15
	*/
	rule_11_001_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], fac=8;		
		
		for(var i=11; i<10+fac; ++i){
			var ans = i+fac;
			allTests.push([i, '+', fac, '?', ans]);
			allTests.push([fac, '+', i, '?', ans]);
			
			allTests.push([i, '+', '?', ans, fac]);
			allTests.push([fac, '+', '?', ans, i]);
			
			allTests.push(['?', '+', fac, ans, i]);
			allTests.push(['?', '+', i, ans, fac]);
			
			allTests.push([ans, '-', fac, '?', i]);			
			allTests.push([ans, '-', i, '?', fac]);
			
			allTests.push([ans, '-', '?', fac, i]);
			allTests.push([ans, '-', '?', i, fac]);
			
			allTests.push(['?', '-', fac, i, ans]);
			allTests.push(['?', '-', i, fac, ans]);
		}		
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"十几减8(退位)", "id":"11-001-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 十几减7、6（退位）
		规则ID: 11-001-0003
		描述: a-7（11≤a＜17，a是整数）
			  a-6（11≤a＜16，a是整数）
		备注: 15-7=（ ）；15-（ ）=7；（ ）+7=15；7+（ ）=15
			  15-6=（ ）；15-（ ）=6；（ ）+6=15；6+（ ）=15
	*/
	rule_11_001_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], facs=[6,7];		
		
		facs.map(function(fac){
			for(var i=11; i<10+fac; ++i){
				var ans = i+fac;
				allTests.push([i, '+', fac, '?', ans]);
				allTests.push([fac, '+', i, '?', ans]);
				
				allTests.push([i, '+', '?', ans, fac]);
				allTests.push([fac, '+', '?', ans, i]);
				
				allTests.push(['?', '+', fac, ans, i]);
				allTests.push(['?', '+', i, ans, fac]);
				
				allTests.push([ans, '-', fac, '?', i]);			
				allTests.push([ans, '-', i, '?', fac]);
				
				allTests.push([ans, '-', '?', fac, i]);
				allTests.push([ans, '-', '?', i, fac]);
				
				allTests.push(['?', '-', fac, i, ans]);
				allTests.push(['?', '-', i, fac, ans]);
			}			
		});			
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"十几减7、6(退位)", "id":"11-001-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 十几减5、4、3、2（退位）
		规则ID: 11-001-0004
		描述: a-5（11≤a＜15，a是整数）
			  a-4（11≤a＜14，a是整数）
			  a-3（11≤a＜13，a是整数）
			  a-2（11≤a＜12，a是整数）
		备注: 14-5=（ ）；14-（ ）=5；（ ）+5=14；5+（ ）=14
			  13-4=（ ）；13-（ ）=4；（ ）+4=13；4+（ ）=13
			  12-3=（ ）；12-（ ）=3；（ ）+3=12；3+（ ）=12
			  11-2=（ ）；11-（ ）=2；（ ）+2=11；2+（ ）=11
	*/
	rule_11_001_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], facs=[5,4,3,2];		
		
		facs.map(function(fac){
			for(var i=11; i<10+fac; ++i){
				var ans = i+fac;
				allTests.push([i, '+', fac, '?', ans]);
				allTests.push([fac, '+', i, '?', ans]);
				
				allTests.push([i, '+', '?', ans, fac]);
				allTests.push([fac, '+', '?', ans, i]);
				
				allTests.push(['?', '+', fac, ans, i]);
				allTests.push(['?', '+', i, ans, fac]);
				
				allTests.push([ans, '-', fac, '?', i]);			
				allTests.push([ans, '-', i, '?', fac]);
				
				allTests.push([ans, '-', '?', fac, i]);
				allTests.push([ans, '-', '?', i, fac]);
				
				allTests.push(['?', '-', fac, i, ans]);
				allTests.push(['?', '-', i, fac, ans]);
			}			
		});			
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"十几减5、4、3、2（退位）", "id":"11-001-0004", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 整十数加一位数及相应的减法
		规则ID: 11-002-0001
		描述: 10a+b或b+10a（1≤a≤9，1≤b≤9，a、b是整数）
			  相应的减法：（10a+b）-10a或（10a+b）-b
		备注: 80+9=（ ）；80+（ ）=89；（ ）+9=89；
			  89-（ ）=80；（ ）-9=80；89-9=（ ）
	*/
	rule_11_002_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1068, canRepeat, allTests=[], tests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a,b,sum, tmpstr, optype, blankPos;
			
			sum=this.randomLowerBound(11, 100);			
			b=sum%10;
			if(b==0) continue;
			a=sum-b;	
			
			optype=this.randomLowerBound(0,4);
			blankPos=this.randomLowerBound(0,3);			
			
			var arr=[]
			switch(optype)
			{
				case 0:
					arr=[a, b, sum];					
					arr.push(arr[blankPos]);
					arr[blankPos]='?';
					arr.splice(1,0,'+');
					break;
				case 1:
					arr=[b,a,sum];
					arr.push(arr[blankPos]);
					arr[blankPos]='?';
					arr.splice(1,0,'+');
					break;
				case 2:
					arr=[sum, a, b];
					arr.push(arr[blankPos]);
					arr[blankPos]='?';
					arr.splice(1,0,'-');
					break;
				case 3:
					arr=[sum, b, a];
					arr.push(arr[blankPos]);
					arr[blankPos]='?';
					arr.splice(1,0,'-');
					break;
			}
			
			tmpstr=arr.join(' ');
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"整十数加一位数及相应的减法", "id":"11-002-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 整十数加、减整十数
		规则ID: 11-003-0001
		描述: 10a+10b（2≤a+b≤9，a、b是整数）
			  10a-10b（0≤a-b≤8，a、b是整数）
		备注: 20+30=（ ）；20+（ ）=50；（ ）+30=50
			  50-30=（ ）；（ ）-30=20；50-（ ）=20
	*/
	rule_11_003_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];
				
		for(var i=10; i<100; i+=10){
			for(var j=10; j<100; j+=10)	{
				var ans = i+j;
				if(ans>=20 && ans<100){
					allTests.push([i, '+', j, '?', ans]);
					allTests.push([i, '+', '?', ans, j]);
					allTests.push(['?', '+', j, ans, i]);
				}
				ans = i-j;
				if(ans>=0 && ans<90){
					allTests.push([i, '-', j, '?', ans]);
					allTests.push([i, '-', '?', ans, j]);
					allTests.push(['?', '-', j, ans, i]);
				}
			}
		}		
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"整十数加、减整十数", "id":"11-003-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 两位数加一位数（不进位）
		规则ID: 11-003-0002
		描述: 如：45+4=49，3+76=79（注意不进位）
		备注:73+6=（ ）；6+73=（ ）
	*/
	rule_11_003_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=792, canRepeat, allTests=[], tests=[], a, b, type, tmpstr;		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomLowerBound(10, 100);
			b=this.randomLowerBound(1,10);
			type=this.randomLowerBound(0,2);
			if(a%10+b<10){
				tmpstr = type==0 ? [a, '+', b, '?', a+b].join(' ') : [b,'+', a, '?', a+b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0){
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		return {"title":"两位数加一位数（不进位）", "id":"11-003-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 两位数加一位数（进位）
		规则ID: 11-003-0003
		描述: 如：45+6=51,6+74=80（注意进位，个位的和≥10）
		备注: 74+7=（ ）；7+74=（ ）
	*/
	rule_11_003_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=720, canRepeat, allTests=[], tests=[], a, b, type, tmpstr;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0;i<count;){
			a=this.randomLowerBound(10, 100);
			b=this.randomLowerBound(1, 10);
			type=this.randomLowerBound(0,2);
			if(a%10+b>=10 && a+b<100){
				tmpstr=type==0?[a,'+',b,'?',a+b].join(' '):[b,'+',a,'?',a+b].join(' ');
				if(canRepeat||this.indexOf(allTests, tmpstr)<0){
					allTests.push(tmpstr);
					i++;
				}
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		return {"title":"两位数加一位数（进位）", "id":"11-003-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 两位数加整十数
		规则ID: 11-003-0004
		描述: 如：35+10=45,70+18=88（注意结果仍为两位数）
		备注: 18+70=（ ）；70+18=（ ）
	*/
	rule_11_003_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=704, canRepeat, allTests=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0;i<count;){
			a=this.randomLowerBound(10, 100);
			b=this.randomLowerBound(10, 100);			
			var s=a+b, t=a%10+b%10;
			if(s<100 && t>0 && t<10){
				tmpstr = [a, '+', b, '?', s].join(' ');
				if(canRepeat||this.indexOf(allTests, tmpstr)<0){
					allTests.push(tmpstr);
					i++;
				}
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		return {"title":"两位数加整十数", "id":"11-003-0004", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 两位数减一位数（不退位）
		规则ID: 11-003-0005
		描述: 如：35-2=33，35-5=30（注意不退位，个位的差≥0）
		备注: 78-5=（ ）；5+（ ）=78；（ ）+5=78
	*/
	rule_11_003_0005:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1976, canRepeat, allTests=[], tests=[], a, b, type, tmpstr;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomLowerBound(10, 100);
			b=this.randomLowerBound(1, 10);
			if(a%10>=b){
				type=this.randomLowerBound(0,3);
				if(type==0) tmpstr=[a, '-', b, '?', a-b].join(' ');
				else if(type==1) tmpstr=[b, '+', '?', a, a-b].join(' ');
				else tmpstr=['?', '+', b, a, a-b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0){
					allTests.push(tmpstr);
					i++;
				}
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		return {"title":"两位数减一位数（不退位）", "id":"11-003-0005", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 两位数减一位数（退位）
		规则ID: 11-003-0006
		描述: 如：38-9=27，（注意退位）
		备注: 38-9=（ ）；9+（ ）=38；（ ）+9=38
	*/
	rule_11_003_0006:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1584, canRepeat, allTests=[], tests=[], a, b, type, tmpstr;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomLowerBound(10, 100);
			b=this.randomLowerBound(1, 10);
			if(a%10<b){
				type=this.randomLowerBound(0,3);
				if(type==0) tmpstr=[a, '-', b, '?', a-b].join(' ');
				else if(type==1) tmpstr=[b, '+', '?', a, a-b].join(' ');
				else tmpstr=['?', '+', b, a, a-b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0){
					allTests.push(tmpstr);
					i++;
				}
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		return {"title":"两位数减一位数（退位）", "id":"11-003-0006", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 两位数减整十数
		规则ID: 11-003-0007
		描述: 如：78-20=58（注意整十数）
		备注: 78-20=（ ）；20+（ ）=78；（ ）+20=78
	*/
	rule_11_003_0007:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1620, canRepeat, allTests=[], tests=[], a, b, type, tmpstr;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomLowerBound(10, 100);
			b=this.randomLowerBound(10, 100);
			var s=a-b, t=a%10+b%10;
			if(s>0 && t>0 && t<10 && b%10==0){
				type=this.randomLowerBound(0,3);
				if(type==0) tmpstr=[a, '-', b, '?', s].join(' ');
				else if(type==1) tmpstr=[b, '+', '?', a, s].join(' ');
				else tmpstr=['?', '+', b, a, s].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0){
					allTests.push(tmpstr);
					i++;
				}
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		return {"title":"两位数减整十数", "id":"11-003-0007", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 连加、连减
		规则ID: 11-003-0008
		描述: (1) 连加：a+b+c（10＜a+b+c＜100）
				情况1：0＜a、b、c＜10
				情况2：a+b=整十数（a：两位数、b：一位数或a：一位数、b：两位数），c为两位数
			  (2) 连减：a-b-c（0＜a-b-c＜80）
				情况1：a：两位数，b、c：均为一位数
				情况2：a：两位数，b、c：一个为一位数、一个为整十数
		备注: a+b+c=（   ）
			  a-b-c=（   ）
	*/
	rule_11_003_0008:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=19002, canRepeat, allTests=[], tests=[], a, b, c, sum, tmpstr, optype;

		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomLowerBound(1, 100);
			b=this.randomLowerBound(1, 100);
			c=this.randomLowerBound(1, 100);
			optype=this.randomLowerBound(0,2);
			if(optype==0){
				sum=a+b+c;
				if(sum>10 && sum<100){
					var flag = false;
					if(a<10 && b<10 && c<10) flag=true;
					else if(a<10 && b>10 && c>=10 && (a+b)%10==0) flag = true;
					else if(a>10 && b<10 && c>=10 && (a+b)%10==0) flag = true;
					if(flag){
						tmpstr = [a, '+', b, '+', c, '?', sum].join(' ');
						if(canRepeat || this.indexOf(allTests, tmpstr)<0){
							allTests.push(tmpstr);
							i++;
						}
					}					
				}
			}else{
				sum=a-b-c;
				if(sum>0&&sum<80){
					var flag = false;
					if(a>=10 && b<10 && c<10) flag = true;
					else if(a>10 && b<10 && c%10==0) flag = true;
					else if(a>10 && c<10 && b%10==0) flag = true;
					
					if(flag) {
						tmpstr = [a, '-', b, '-', c, '?', sum].join(' ');
						if(canRepeat || this.indexOf(allTests, tmpstr)<0){
							allTests.push(tmpstr);
							i++;
						}
					}
				}
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		return {"title":"连加、连减", "id":"11-003-0008", "maxCount":maxLength, "tests":tests};	
	},
	
	/*
		知识点: 加减混合
		规则ID: 11-003-0009
		描述: a-b+c或a+b-c 如：63-9+5或53+7-40（其中0＜结果＜100）
			  a：两位数（非整十）b、c：均为一位数或一个为一位数、一个为整十数
		备注: a-b+c
			  a+b-c
	*/
	rule_11_003_0009:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=27228, canRepeat, allTests=[], tests=[], a, b, c, sum, optype, tmpstr;

		for(var i=0; i<count;){
			a=this.randomLowerBound(1,100);
			if(a<10 || a%10==0) continue;
			
			b=this.randomLowerBound(1,100);
			c=this.randomLowerBound(1,100);
			
			if(b>=10 && c>=10) continue;
			if((b<10 && c%10!=0) ||(c<10 && b%10!=0)) continue;
			
			optype=this.randomLowerBound(0, 2);
			tmpstr='';
			if(optype == 0){
				sum=a+b-c;
				if(sum<=0 || sum>=100) continue;
				tmpstr = [a, '+', b, '-', c, '?', sum].join(' ');
			}else{
				sum=a-b+c;
				if(sum<=0 || sum>=100) continue;
				tmpstr = [a, '-', b, '+', c, '?', sum].join(' ');
			}
			
			if(tmpstr!='' && (canRepeat || this.indexOf(allTests, tmpstr)<0)){
				allTests.push(tmpstr);
				i++;
			}				
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"加减混合", "id":"11-003-0009", "maxCount":maxLength, "tests":tests};	
	},
	
	
	
	/*
		知识点: 小括号
		规则ID: 11-003-0010
		描述: 0＜结果＜100
			  (1) a+（b-c）
				  情况1：a、b、c：均为一位数且b-c＞0
				  情况2：a：两位数（非整十），b-c：满足两位数减一位数（不退位、退位）或两位数减整十数的规则且b-c：一位数或整十数
			  (2) a+（b+c）
				  情况1：a、b、c：均为一位数
				  情况2：a：两位数（非整十），b+c≤10
				  情况3：a：两位数（非整十），b、c：一个是一位数，一个是两位数且b+c：整十数
				  情况4：a：两位数（整十），b+c≤10或b+c：满足两位数加一位数（进位、不进位）或两位数加整十数法则
			  (3) a-（b+c）
				  情况1：a：两位数（非整十） ，b+c≤10
				  情况2：a：两位数（非整十） ，b+c：满足两位数加一位数法则且b+c≥20且为整十数
			  (4) a-（b-c）
				  情况1：a：两位数（非整十），b、c：一位数，且b-c＞0
				  情况2：a：两位数（非整十），b：两位数（非整十），c：一位数（b-c：整十数）
				  情况3：a：两位数（非整十），b：两位数（非整十），c：整十数（b-c：一位数）
		备注: a+（b-c）=（   ）
		      a+（b+c）=（   ）
			  a-（b+c）=（   ）
			  a-（b-c）=（   ）	
	*/
	rule_11_003_0010:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=90603, canRepeat, allTests=[], indexes=[], tests=[], a, b, c, sum, optype, tmpstr, flag;
		
		for(var i=0; i<count;){
			flag = false;
			a = this.randomLowerBound(1, 100);
			b = this.randomLowerBound(1, 100);
			c = this.randomLowerBound(1, 100);
			optype = this.randomLowerBound(0, 4);
			tmpstr='';
			switch(optype) {
				case 0:
					sum=a+b-c;
					if(sum>0 && sum<100 && b-c>0){
						if(a<10 && b<10 && c<10) flag = true;
						else if(a>10 && a%10!=0 && b>10){
							if((b-c)<10 || (b-c)%10==0){
								if(c%10==0) flag = true;
								else if(b%10>=c) flag=true;
							}
						}
						if(flag) tmpstr=[a, '+', '(', b, '-', c, ')', '?', sum].join(' ');
					}
					break;
				case 1:
					sum=a+(b+c);
					if(sum>0 && sum<100){
						if(a<10 && b<10 && c<10) flag = true;
						else if(a>10 && a%10!=0){
							if(b+c<=10) flag = true;
							else if((b+c)%10==0 && (b<10 && c>10) || (b>10&&c<10)) flag = true;
						}else if(a>10 && a%10==0){
							if(b+c<=10) flag = true;
							else if((b<10 && c>=10) || (b>=10 && c<10)) flag = true;								
							else if(b>=10 && c>=10 && (b%10==0 || c%10==0)) flag = true;
						}						
						if(flag) tmpstr=[a, '+', '(', b, '+', c, ')', '?', sum].join(' ');
					}
					break;
				case 2:
					sum=a-(b+c);
					if(sum>0 && sum<100){
						if(a>0 && a%10!=0){
							var sumab = b+c;
							if(sumab<=10) flag=true;
							else if((b<10&&c>=10) || (b>=10&&c<10)&& sumab>=20 && sumab%10==0) flag=true;
						}
						if(flag) tmpstr=[a, '-', '(', b, '+', c, ')', '?', sum].join(' ');
					}
					break;
				case 3:
					sum=a-(b-c);
					if(sum>0 && sum<100 && a>10 && a%10!=0){
						if(b<10 && c<10 && b-c>0) flag = true;
						else if(b>10 && b%10!=0){
							if(c<10 && (b-c)%10==0) flag = true;
							else if(c%10==0 && (b-c)>0 && (b-c)<10) flag = true;
						}						
						if(flag) tmpstr=[a, '-', '(', b, '-', c, ')', '?', sum].join(' ');
					}
					break;
			}
			if(tmpstr!='' && (canRepeat || this.indexOf(allTests, tmpstr)<0)){
				allTests.push(tmpstr);
				i++;
			}	
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		return {"title":"小括号", "id":"11-003-0010", "maxCount":maxLength, "tests":tests};	
	},

	/*	
		知识点: 两位数加一位数（不进位）
		规则ID: 20-001-0001
		描述: a+b,如24+5（a+b＜100，10≤a≤99，1≤b≤8，个位相加＜10）
		备注：a+b=（   ）
	*/
	rule_20_001_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];		
		for(var i=10;i<100;i++){
			for(var j=1; j<10; j++){
				var t = i%10;
				if(t+j<10){
					allTests.push([i, '+', j, '?', i+j]);
				} 
			}				
		}
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数加一位数（不进位）", "id":"20-001-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数加一位数（进位）
		规则ID: 20-001-0002
		描述: a+b,如24+7（a+b＜100，11≤a≤98，1≤b≤9，个位相加≥10）
		备注：a+b=（   ）
	*/
	rule_20_001_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];		
		for(var i=10;i<100;i++){
			for(var j=1; j<10; j++){
				var t = i%10;
				if(t+j>10 && i+j<100){
					allTests.push([i, '+', j, '?', i+j]);
				} 
			}				
		}
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数加一位数（进位）", "id":"20-001-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数加两位数（不进位）
		规则ID: 20-001-0003
		描述: a+b,如24+51（a+b＜100，10≤a、b≤99，个位相加＜10）
		备注：a+b=（   ）
	*/
	rule_20_001_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1980, canRepeat, allTests=[], tests=[], a, b, sum, tmpstr;		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomBothBounds(11, 99);
			b=this.randomBothBounds(11, 99);
			
			sum=a+b;
			if(sum>=100 || a%10+b%10>=10) continue;
			
			tmpstr=[a, '+', b, '?', sum].join(' ');			
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"两位数加两位数（不进位）", "id":"20-001-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数加两位数（进位） 
		规则ID: 20-001-0004
		描述: a+b,如24+57（a+b＜100，11≤a、b≤99，个位相加≥10）
		备注：a+b=（   ）
	*/
	rule_20_001_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1008, canRepeat, allTests=[], tests=[], a, b, sum, tmpstr;		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomBothBounds(11, 99);
			b=this.randomBothBounds(11, 99);
			
			sum=a+b;
			if(sum>=100 || a%10+b%10<10) continue;
			
			tmpstr=[a, '+', b, '?', sum].join(' ');			
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"两位数加两位数（进位）", "id":"20-001-0004", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数减一位数（不退位）
		规则ID: 20-001-0005
		描述: a-b,如24-3（a-b＞0，11≤a≤99，1≤b≤9，个位相减≥0）
		备注：a-b=（   ）
	*/
	rule_20_001_0005:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];		
		for(var i=11;i<100;i++){
			for(var j=1; j<10; j++){
				if(i-j>0){
					var ti = i%10;
					if(ti>j){
						allTests.push([i, '-', j, '?', i-j]);
					} 
				}
			}				
		}
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数减一位数（不退位）", "id":"20-001-0005", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数减一位数（退位）
		规则ID: 20-001-0006
		描述: a-b,如24-8（a-b＞0，10≤a≤98，1≤b≤9，个位相减＜0）
		备注：a-b=（   ）
	*/
	rule_20_001_0006:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[];		
		for(var i=10;i<99;i++){
			for(var j=1; j<10; j++){
				if(i-j>0){
					var ti = i%10;
					if(ti<j){
						allTests.push([i, '-', j, '?', i-j]);
					} 
				}
			}				
		}
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数减一位数（退位）", "id":"20-001-0006", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数减两位数（不退位）
		规则ID: 20-001-0007
		描述: a-b,如24-12（a-b＞0，11≤a≤98，11≤b≤98，个位相减≥0）
		备注：a-b=（   ）
			 （   ）+b=a
			  b+（   ）=a
	*/
	rule_20_001_0007:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=5592, canRepeat, allTests=[], tests=[], a, b, sum, tmpstr, optype;		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomBothBounds(11, 98);
			b=this.randomBothBounds(11, 98);
			
			sum=a-b;
			if(sum<=0 || a%10<b%10) continue;
			
			optype=this.randomLowerBound(0, 3);
			if(optype==0) tmpstr=[a, '-', b, '?', sum].join(' ');
			else if(optype==1) tmpstr=['?', '+', b, a, sum].join(' ');
			else tmpstr=[b, '+', '?', a, sum].join(' ');
			
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"两位数减两位数（不退位）", "id":"20-001-0007", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数减两位数（退位）
		规则ID: 20-001-0008
		描述: a-b,如24-15（a-b＞0，11≤a≤98，11≤b≤98，个位相减＜0）
		备注：a-b=（   ）			 
	*/
	rule_20_001_0008:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1620, canRepeat, allTests=[],tests=[], a, b, sum, tmpstr;		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomBothBounds(11, 98);
			b=this.randomBothBounds(11, 98);			
			sum=a-b;
			if(sum<=0 || a%10>=b%10) continue;
			tmpstr=[a, '-', b, '?', sum].join(' ');
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		
		return {"title":"两位数减两位数（退位）", "id":"20-001-0008", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 100以内连加
		规则ID: 20-001-0009
		描述: a+b+c，如12+24+26（a+b+c＜100，11≤a≤99，11≤b≤99，1≤c＜99）
		备注：a+b+c=（  ）			 
	*/
	rule_20_001_0009:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=79079, canRepeat, allTests=[], tests=[], a, b, c, sum, tmpstr;		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomBothBounds(11, 99);
			b=this.randomBothBounds(11, 99);
			c=this.randomBothBounds(1, 99);
			sum=a+b+c;
			if(sum>=100) continue;
			tmpstr=[a, '+', b, '+', c, '?', sum].join(' ');
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		
		return {"title":"100以内连加", "id":"20-001-0009", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 100以内连减
		规则ID: 20-001-0010
		描述: a-b-c,如67-37-14（a＞b，11≤a≤99，1≤b≤99，1≤c≤99，b、c至少有一个大于10）
		备注：a-b-c=（   ）			 
	*/
	rule_20_001_0010:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=154410, canRepeat, allTests=[], tests=[], a, b, c, sum, tmpstr;		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomBothBounds(11, 99);
			b=this.randomBothBounds(1, 99);
			c=this.randomBothBounds(1, 99);
			sum=a-b-c;
			if(a<=b || sum<0 || (b<10&&c<10)) continue;
			tmpstr=[a, '-', b, '-', c, '?', sum].join(' ');
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"100以内连减", "id":"20-001-0010", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 100以内加减混合运算
		规则ID: 20-001-0011
		描述: 如67-25+28(0＜a+b-c，a+b＜100，11≤a≤99，1≤b≤99，1≤c≤99）
						(或a-b+c＜100,11≤b≤a≤99，1≤c≤99）
		备注：a+b-c=(   )
			  a-b+c=(   )		 
	*/
	rule_20_001_0011:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=584463, canRepeat, allTests=[], tests=[], a, b, c, sum, tmpstr, optype;		
				
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomBothBounds(11, 99);
			b=this.randomBothBounds(1, 99);
			c=this.randomBothBounds(1, 99);
			optype=this.randomLowerBound(0, 2);
			tmpstr='';
			if(optype==0){
				sum=a+b;
				if(sum<=0 || sum>=100) continue;
				sum=a+b-c;
				if(sum<=0 || sum>=100) continue;
				tmpstr=[a, '+', b, '-', c, '?', sum].join(' ');
			}else{
				if(a<b) continue;
				sum=a-b+c;
				if(sum<0 || sum>=100) continue;
				tmpstr=[a, '-', b, '+', c, '?', sum].join(' ');
			}
			if(tmpstr=='') continue;
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"100以内加减混合运算", "id":"20-001-0011", "maxCount":maxLength, "tests":tests};	
	},

	/*	
		知识点: 5的乘法口诀
		规则ID: 20-002-0001
		描述: a×b（a=5，b=1~9或者b=5，a=1~9）
			  a×5=b或5×a=b （b=5、10、15……45）
		备注：a×b=（   ）
			 （   ）×5=b
			  5×（   ）=b
	*/
	rule_20_002_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests = [], indexes = [], tests = [], token = '×';
		
		for(var b=1; b<10; b++){
			var sum=5*b;
			allTests.push([5, token, b, '?', sum]);
			allTests.push([b, token, 5, '?', sum]);
			allTests.push(['?', token, 5, sum, b]);
			allTests.push([5, token, '?', sum, b])
		}
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"5的乘法口诀", "id":"20-002-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 2、3、4乘法口诀
		规则ID: 20-002-0002
		描述: 变数字，规则同上
		备注：变数字，规则同上
	*/
	rule_20_002_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests = [], indexes = [], tests = [], token = '×';
		for(var a=2; a<5; a++){
			for(var b=1; b<10; b++){
				var sum=a*b;
				allTests.push([a, token, b, '?', sum]);
				allTests.push([b, token, a, '?', sum]);
				allTests.push(['?', token, a, sum, b]);
				allTests.push([a, token, '?', sum, b]);
			}
		}
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"2、3/4的乘法口诀", "id":"20-002-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 乘加
		规则ID: 20-002-0003
		描述: a×b+c（100＞a×b+c＞0，1≤a≤5，1≤b≤5，1≤c<30）
		备注：a×b+c=（   ）
	*/
	rule_20_002_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=725, canRepeat, allTests=[], tests=[], a, b, c, sum, tmpstr;
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a=this.randomBothBounds(1,5);
			b=this.randomBothBounds(1,5);
			c=this.randomLowerBound(1, 30);
			sum=a*b+c;
			if(sum<100) {
			    tmpstr = [a, '×', b, '+', c, '?', sum].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0){
					allTests.push(tmpstr);
					i++;
				}
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});		
		
		return {"title":"乘加", "id":"20-002-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 乘减
		规则ID: 20-002-0004
		描述: a×b-c（100＞a×b-c＞0，1≤a≤5，1≤b≤5，1≤c<10）
		备注：a×b-c=（   ）
	*/
	rule_20_002_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests = [], indexes = [], tests = [], token = '×';
		for(var a=1; a<=5; a++){
			for(var b=1; b<=5; b++){
				for(var c=1; c<10; c++){
					var sum = a*b-c;
					if(sum<100 && sum>0) allTests.push([a, token, b, '-', c, '?', a*b-c]);
				}
			}
		}
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"乘减", "id":"20-002-0004", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 6的乘法口诀
		规则ID: 20-002-0005
		描述: 同5的乘法口诀
		备注：同5的乘法口诀
	*/
	rule_20_002_0005:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests = [], indexes = [], tests = [], token = '×', a = 6;
		
		for(var b=1; b<10; b++){
			var sum=a*b;
			allTests.push([a, token, b, '?', sum]);
			allTests.push([b, token, a, '?', sum]);
			allTests.push(['?', token, a, sum, b]);
			allTests.push([a, token, '?', sum, b])
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"6的乘法口诀", "id":"20-002-0005", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 7的乘法口诀
		规则ID: 20-003-0001
		描述: 同5的乘法口诀
		备注：同5的乘法口诀
	*/
	rule_20_003_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests = [], indexes = [], tests = [], token = '×', a = 7;
		
		for(var b=1; b<10; b++){
			var sum=a*b;
			allTests.push([a, token, b, '?', sum]);
			allTests.push([b, token, a, '?', sum]);
			allTests.push(['?', token, a, sum, b]);
			allTests.push([a, token, '?', sum, b])
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"7的乘法口诀", "id":"20-003-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 8的乘法口诀
		规则ID: 20-003-0002
		描述: 同5的乘法口诀
		备注：同5的乘法口诀
	*/
	rule_20_003_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests = [], indexes = [], tests = [], token = '×', a = 8;
		
		for(var b=1; b<10; b++){
			var sum=a*b;
			allTests.push([a, token, b, '?', sum]);
			allTests.push([b, token, a, '?', sum]);
			allTests.push(['?', token, a, sum, b]);
			allTests.push([a, token, '?', sum, b])
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"8的乘法口诀", "id":"20-003-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 9的乘法口诀
		规则ID: 20-003-0003
		描述: 同5的乘法口诀
		备注：同5的乘法口诀
	*/
	rule_20_003_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests = [], indexes = [], tests = [], token = '×', a = 9;
		
		for(var b=1; b<10; b++){
			var sum=a*b;
			allTests.push([a, token, b, '?', sum]);
			allTests.push([b, token, a, '?', sum]);
			allTests.push(['?', token, a, sum, b]);
			allTests.push([a, token, '?', sum, b])
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"9的乘法口诀", "id":"20-003-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 乘法口诀表
		规则ID: 21-001-0001
		描述: a×b（1≤a≤9，1≤b≤9）
		备注：a×b=（   ）
	*/
	rule_21_001_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests = [], indexes = [], tests = [], token = '×';
		
		for(var a=1; a<10; a++){
			for(var b=1; b<10; b++){
				var sum = a*b;
				allTests.push([a, token, b, '?', sum]);
			}
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"乘法口诀表", "id":"21-001-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 用2-6乘法口诀求商
		规则ID: 21-001-0002
		描述: 2n÷2=n或2n÷n=2（1≤n≤9）
			  3n÷3=n或3n÷n=3（1≤n≤9）
			  4n÷4=n或4n÷n=4（1≤n≤9）
			  5n÷5=n或5n÷n=5（1≤n≤9）
			  6n÷6=n或6n÷n=6（1≤n≤9）
		备注：2n÷2=（  ）
			  2n÷（   ）=2
	*/
	rule_21_001_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], token='÷';
		
		for(var a=2; a<7; a++){
			for(var b=1; b<10; b++){
				var sum = a*b;
				allTests.push([sum, token, a, '?', b]);
				allTests.push([sum, token, '?', a, b]);
				allTests.push([sum, token, b, '?', a]);
				allTests.push([sum, token, '?', b, a]);
			}
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"用2-6乘法口诀求商", "id":"21-001-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 用7乘法口诀求商
		规则ID: 21-002-0001
		描述: 同上
		备注：同上
	*/
	rule_21_002_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], token='÷', a=7;		
		
		for(var b=1; b<10; b++){
			var sum = a*b;
			allTests.push([sum, token, a, '?', b]);
			allTests.push([sum, token, '?', a, b]);
			allTests.push([sum, token, b, '?', a]);
			allTests.push([sum, token, '?', b, a]);
		}		
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"用7乘法口诀求商", "id":"21-002-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 用8、9乘法口诀求商
		规则ID: 21-002-0002
		描述: 同上
		备注：同上
	*/
	rule_21_002_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, canRepeat, allTests=[], indexes=[], tests=[], token='÷';		
		
		for(var a=8; a<10; a++){
			for(var b=1; b<10; b++){
				var sum = a*b;
				allTests.push([sum, token, a, '?', b]);
				allTests.push([sum, token, '?', a, b]);
				allTests.push([sum, token, b, '?', a]);
				allTests.push([sum, token, '?', b, a]);
			}
		}
		
		maxLength = allTests.length;
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}
		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"用8、9乘法口诀求商", "id":"21-002-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 同级混合运算
		规则ID: 21-003-0001
		描述: a+b-c：（a+b-c＞0，a+b＜100，11≤a≤99，1≤b≤99，1≤c≤99）
			  a-b+c：（0＜a-b+c＜100,11≤b≤a≤99，1≤c≤99）
			  a×b÷c：a×b=nc（a=1、2…9；b=1、2…9；c=1、2…9；n=1、2…9）
			  a÷c×b：a=nc（a=1、2…9；b=1、2…9；c=1、2…9；n=1、2…9）
		备注：a+b-c=（   ）
			  a-b+c=(   )
			  a×b÷c=（  ）
			  a÷c×b=（  ）
	*/
	rule_21_003_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=270735, canRepeat, allTests=[], tests=[], sum, a, b, c, optype, tmpstr;		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			optype=this.randomLowerBound(0, 4);
			tmpstr='';
			switch(optype){
				case 0:
					a=this.randomBothBounds(11, 99);
					b=this.randomBothBounds(1, 99);
					c=this.randomBothBounds(1, 99);
					sum=a+b-c;
					if(sum>0&&a+b<100) tmpstr=[a, '+', b, '-', c, '?', sum].join(' ');
					break;
				case 1:
					a=this.randomBothBounds(11, 99);
					b=this.randomBothBounds(11, 99);
					c=this.randomBothBounds(1, 99);
					sum=a-b+c;
					if(a>=b && sum>0 && sum<100) tmpstr=[a, '-', b, '+', c, '?', sum].join(' ');
					break;
				case 2:
					a=this.randomBothBounds(1, 9);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);					
					sum=a*b;					
					if(sum%c==0){
						sum = parseInt(sum/c);
						tmpstr=[a, '×', b, '÷', c, '?', sum].join(' ');
					}					
					break;
				case 3:
					a=this.randomBothBounds(1, 9);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);										
					if(a%c==0){
						sum = b * parseInt(a/c);
						tmpstr=[a, '÷', c, '×', b, '?', sum].join(' ');
					}	
					break;
			}
			if(tmpstr=='') continue;
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"同级混合运算", "id":"21-003-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两级混合运算
		规则ID: 21-003-0002
		描述: a+b×c或b×c+a（0＜a+b×c＜100；1≤a≤99; b、c=1、2…9；）
			  a-b×c或b×c-a（0＜a-b×c＜100；1≤a≤99; b、c=1、2…9；）
			  a+b÷c或b÷c+a（0＜b÷c+a＜100；1≤a≤99; b=nc，c、n=1、2…9；）
			  a-b÷c或b÷c-a（0＜b÷c-a＜100；1≤a≤99; b=nc，c、n=1、2…9；）
		备注：a+b×c=（   ）或b×c+a=（   ）
			  a-b×c=（   ）或b×c-a=（   ）
			  a+b÷c=（   ）或b÷c+a=（   ）
			  a-b÷c= (   ) 或b÷c-a= (   )
	*/
	rule_21_003_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=26596, canRepeat, allTests=[], tests=[], sum, a, b, c, optype, tmpstr;		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			optype=this.randomLowerBound(0, 8);
			tmpstr='';
			switch(optype){
				case 0:
					a=this.randomBothBounds(1, 99);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);
					sum=a+b*c;
					if(sum>0&&sum<100) tmpstr=[a, '+', b, '×', c, '?', sum].join(' ');
					break;
				case 1:
					a=this.randomBothBounds(1, 99);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);
					sum=b*c+a;
					if(sum>0&&sum<100) tmpstr=[b, '×', c, '+', a, '?', sum].join(' ');
					break;
				case 2:
					a=this.randomBothBounds(1, 99);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);
					sum=a-b*c;
					if(sum>0&&sum<100) tmpstr=[a, '-', b, '×', c, '?', sum].join(' ');
					break;
				case 3:
					a=this.randomBothBounds(1, 99);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);
					sum=b*c-a;
					if(sum>0&&sum<100) tmpstr=[b, '×', c, '-', a, '?', sum].join(' ');
					break;				
				case 4:
					a=this.randomBothBounds(1, 99);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);					
					sum=a+b;
					b=b*c;
					if(sum>0&&sum<100) tmpstr=[a, '+', b, '÷', c, '?', sum].join(' ');					
					break;
				case 5:
					a=this.randomBothBounds(1, 99);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);					
					sum=a+b;
					b=b*c;
					if(sum>0&&sum<100) tmpstr=[b, '÷', c, '+', a, '?', sum].join(' ');					
					break;				
				case 6:
					a=this.randomBothBounds(1, 99);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);					
					sum=a-b;
					b=b*c;
					if(sum>0&&sum<100) tmpstr=[a, '-', b, '÷', c, '?', sum].join(' ');
					break;
				case 7:
					a=this.randomBothBounds(1, 99);
					b=this.randomBothBounds(1, 9);
					c=this.randomBothBounds(1, 9);					
					sum=b-a;
					b=b*c;
					if(sum>0&&sum<100) tmpstr=[b, '÷', c, '-', a, '?', sum].join(' ');
					break;
			}
			if(tmpstr=='') continue;
			if(canRepeat || this.indexOf(allTests, tmpstr)<0){
				allTests.push(tmpstr);
				i++;
			}
		}
		allTests.map(function(i){tests.push(i.split(' '))});
		
		return {"title":"两级混合运算", "id":"21-003-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 含小括号的运算
		规则ID: 21-003-0003
		描述: 所有式子的结果在0-100之间的整数
			  a±(b±c): (0＜b±c＜100；0＜a＜100)
			  r0: a+(b+c)
			  r1: a+(b-c)
			  r2: a-(b+c)
			  r3: a-(b-c)
			  
			  a÷（b±c）或（b±c）÷a:（0＜b±c＜100且前者a=n（b±c），n=1、2…9；后者b±c=na，n、a=1、2…9）
			  r4: a÷（b+c）
			  r5: a÷（b-c）
			  r6: (b+c)÷a
			  r7: (b-c)÷a
			  
			  a×（b±c）或（b±c）×a：（1≤b±c≤9；a=1、2…9）
			  r8: a×（b+c）
			  r9: a×（b-c）
			  r10:（b+c）×a
			  r11:（b-c）×a
			  
			  a×（b÷c）或（b÷c）×a：（b=nc，a、c、n=1、2…9）
			  r12:a×（b÷c）			  
			  r13:（b÷c）×a
			  
			  a÷（b×c）或（b×c）÷a：（前者：b×c＜10，a=n（b＋c），b、c、n=1、2…9；后者：b×c=na，a、b、c=1、2…9；）
			  r14:a÷（b×c）
			  r15:（b×c）÷a
			  
		备注：a±（b±c）
			  a÷（b±c）或（b±c）÷a
			  a×（b±c）或（b±c）×a
			  a×（b÷c）或（b÷c）×a
			  a÷（b×c）或（b×c）÷a
	*/
	rule_21_003_0003:function(count, allowRepeat){
		if(count <= 0) return null;		
		
		var maxLength=1032005, allTests=[], a,b,c,r, isProceed=false, sum, tmpstr;
		
		for(var cnt=0; cnt<count;){
			a=this.randomLowerBound(1, 100);
			b=this.randomLowerBound(1, 100);
			c=this.randomLowerBound(1, 100);
			r=this.randomLowerBound(0, 16);
			switch(r){
				case 0: {						
						sum=a+(b+c);
						tmpstr='';
						if(sum<100){ 
							tmpstr=[a, '+', '(', b, '+', c, ')', '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;
							}
						}
					}
					break;
				case 1: {
						sum = a+(b-c);
						tmpstr = '';
						isProceed = false;
						if(b>c && sum<100){
							tmpstr=[a, '+', '(', b, '-', c, ')', '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;								
							}
						}
					}
					break;
				case 2: {
						sum=a-(b+c);
						tmpstr='';
						isProceed = false;
						if(sum>0&&sum<100&&b+c<100){
							tmpstr=[a, '-', '(', b, '+', c, ')', '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;								
							}
						}
					}
					break;
				case 3: {
						sum=a-(b-c);
						tmpstr='';
						isProceed = false;
						if(sum>0 && sum<100 && b-c>0){
							tmpstr=[a, '-', '(', b, '-', c, ')', '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;								
							} 
						}
					}
					break;
				case 4: {
					// a÷（b+c）
						var t = b+c;						
						tmpstr='';
						isProceed = false;
						if(a%t==0){
							sum = parseInt(a/t);
							if(sum<10){
								tmpstr=[a, '÷', '(', b, '+', c, ')', '?', sum].join(' ');
								if(this.indexOf(allTests, tmpstr)== -1){
									allTests.push(tmpstr);
									isProceed = true;								
								}
							}
						}
					}
					break;
				case 5: {
					// a÷（b-c）
						var t = b-c;						
						tmpstr='';
						isProceed = false;
						if(t>0 && a%t==0){
							sum = parseInt(a/t);
							if(sum<10){
								tmpstr=[a, '÷', '(', b, '-', c, ')', '?', sum].join(' ');
								if(this.indexOf(allTests, tmpstr)== -1){
									allTests.push(tmpstr);
									isProceed = true;								
								}
							}
						}
					}
					break;
				case 6: {
					// (b+c)÷a b±c=na，n、a=1、2…9
						var t = b+c;						
						tmpstr='';
						isProceed = false;
						if(a<10 && t<100 && t%a==0){
							sum = parseInt(t/a);
							if(sum<10){
								tmpstr=['(', b, '+', c, ')', '÷', a, '?', sum].join(' ');
								if(this.indexOf(allTests, tmpstr)== -1){
									allTests.push(tmpstr);
									isProceed = true;								
								}
							}
						}
					}
					break;
				case 7: {
					// (b-c)÷a b±c=na，n、a=1、2…9
						var t = b-c;
						tmpstr='';
						isProceed = false;
						if(t>0 && a<10 && t%a==0){
							sum = parseInt(t/a);
							if(sum<10){
								tmpstr=['(', b, '-', c, ')', '÷', a, '?', sum].join(' ');
								if(this.indexOf(allTests, tmpstr)== -1){
									allTests.push(tmpstr);
									isProceed = true;								
								}
							}
						}
					}
					break;
				case 8: {
					// a×（b+c）（1≤b±c≤9；a=1、2…9）
						var t = b+c;
						tmpstr='';
						isProceed = false;
						if(t<10 && a<10){
							sum = a*t;							
							tmpstr=[a, '×', '(', b, '+', c, ')', '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;								
							}							
						}
					}
					break;
				case 9: {
					// a×（b-c）（1≤b±c≤9；a=1、2…9）
						var t = b-c;
						tmpstr='';
						isProceed = false;
						if(t>0 && t<10 && a<10){
							sum = a*t;							
							tmpstr=[a, '×', '(', b, '-', c, ')', '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;								
							}							
						}
					}
					break;
				case 10: {
					//（b+c）×a（1≤b±c≤9；a=1、2…9）
						var t = b+c;
						tmpstr='';
						isProceed = false;
						if(t<10 && a<10){
							sum = a*t;							
							tmpstr=['(', b, '+', c, ')', '×', a, '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;								
							}							
						}
					}
					break;
				case 11: {
					//（b-c）×a（1≤b±c≤9；a=1、2…9）
						var t = b-c;
						tmpstr='';
						isProceed = false;
						if(t>0 && t<10 && a<10){
							sum = a*t;							
							tmpstr=['(', b, '-', c, ')', '×', a, '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;								
							}							
						}
					}
					break;
				case 12: {
					//a×（b÷c）（b=nc，a、c、n=1、2…9）						
						isProceed = false;
						if(a<10 && c<10 && b%c==0){
							var t=parseInt(b/c);
							sum=a*t;
							if(t<10 && sum<100){							
								tmpstr=[a, '×', '(', b, '÷', c, ')', '?', sum].join(' ');
								if(this.indexOf(allTests, tmpstr)== -1){
									allTests.push(tmpstr);
									isProceed = true;								
								}	
							}
						}						
					}
					break;
				case 13: {
					//（b÷c）×a（b=nc，a、c、n=1、2…9）						
						isProceed = false;
						if(a<10 && c<10 && b%c==0){
							var t=parseInt(b/c);
							sum=a*t;
							if(t<10 && sum<100){							
								tmpstr=['(', b, '÷', c, ')', '×', a, '?', sum].join(' ');
								if(this.indexOf(allTests, tmpstr)== -1){
									allTests.push(tmpstr);
									isProceed = true;								
								}	
							}
						}						
					}
					break;
				case 14: {
					//a÷（b×c）（b×c＜10，a=n（b＋c），b、c、n=1、2…9；）						
						isProceed = false;
						var t=b*c;
						if(t <10 && a%t==0){
							sum=parseInt(a/t);
							if(sum<10){
								tmpstr=[a, '÷', '(', b, '×', c, ')', '?', sum].join(' ');
								if(this.indexOf(allTests, tmpstr)== -1){
									allTests.push(tmpstr);
									isProceed = true;								
								}	
							}
						}						
					}
					break;
				case 15: {
					//（b×c）÷a（b×c=na，a、b、c=1、2…9；）						
						isProceed = false;
						var t=b*c;
						if(a<10 && b<10 && c<10 && t%a==0){
							sum=parseInt(t/a);							
							tmpstr=['(', b, '×', c, ')', '÷', a, '?', sum].join(' ');
							if(this.indexOf(allTests, tmpstr)== -1){
								allTests.push(tmpstr);
								isProceed = true;								
							}								
						}						
					}
					break;
			}
			if(isProceed) cnt++;
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		return {"title":"含小括号的运算", "id":"21-003-0003", "maxCount":maxLength, "tests":tests};	
	},

	/*	
		知识点: 两位数加两位数（不进位）
		规则ID: 30-001-0001
		描述: a+b 如：35+34（21≤a+b＜100，11≤a≤88，11≤b≤88，个位相加＜10）
		备注：a+b=（  ）
	*/
	rule_30_001_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1821, a, b, sum, canRepeat, tmpstr, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(11, 100);
			b = this.randomLowerBound(11, 100);
			sum = a+b;
			if(sum>=21 && sum<100 && (a%10+b%10<10)){
				tmpstr = [a, '+', b, '?', sum].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {					
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		return {"title":"两位数加两位数（不进位）", "id":"30-001-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数加两位数（不连续进位）
		规则ID: 30-001-0002
		描述: a+b 如：35+36（21≤a+b＜100，11≤a≤88，11≤b≤88，个位相加＞10）
		备注：a+b=（  ）
	*/
	rule_30_001_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1008, a, b, sum, canRepeat, tmpstr, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(11, 100);
			b = this.randomLowerBound(11, 100);
			sum = a+b;
			if(sum>=21 && sum<100 && (a%10+b%10)>10){
				tmpstr = [a, '+', b, '?', sum].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {					
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"两位数加两位数（不连续进位）", "id":"30-001-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数减两位数（不退位）
		规则ID: 30-001-0003
		描述: a-b 如：36-22（a＞b，11≤a≤88，11≤b≤88，个位相减＞0）
		备注：a-b=（  ）
			 （  ）+b=a
			  b+（  ）=a
	*/
	rule_30_001_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=4431, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(11, 100);
			b = this.randomLowerBound(11, 100);
			type = this.randomLowerBound(1, 4);
			sum = a-b;
			if(sum>0 && (a%10-b%10)>0){
				switch(type){
					case 1:
						tmpstr=[a, '-', b, '?', sum].join(' ');
						break;
					case 2:
						tmpstr=['?', '+', b, a, sum].join(' ');
						break;
					case 3:
						tmpstr=[b, '+', '?', a, sum].join(' ');
						break;
				}				
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {					
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"两位数减两位数（不退位）", "id":"30-001-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数减两位数（退位）
		规则ID: 30-001-0004
		描述: a-b 如：36-27（a＞b，11≤a≤88，11≤b≤88，个位相减＜0）
		备注：a-b=（  ）
			  a-（  ）=b
			  （  ）+b=a
			  b+（  ）=a
	*/
	rule_30_001_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=5040, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(11, 100);
			b = this.randomLowerBound(11, 100);
			type = this.randomLowerBound(1, 5);
			sum = a-b;
			if(sum>0 && (a%10-b%10)>0){
				switch(type){
					case 1:
						tmpstr=[a, '-', b, '?', sum].join(' ');
						break;
					case 2:
						tmpstr=['?', '+', b, a, sum].join(' ');
						break;
					case 3:
						tmpstr=[b, '+', '?', a, sum].join(' ');
						break
					case 4:
						tmpstr=[a, '-', '?', b, sum].join(' ');
						break;
				}				
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {					
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"两位数减两位数（退位）", "id":"30-001-0004", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 几百几十加几百几十
		规则ID: 30-001-0005
		描述: a+b 如：350+340、350+360（将两位数加两位数中，每个加数扩大十倍）
		备注：a+b=（  ）
	*/
	rule_30_001_0005:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=3081, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		
		/* for(var a=110; a<=990; a+=10){
			for(var b=110; b<=990; b+=10){
				sum=a+b;
				if(sum<1000){
					allTests.push([a, '+', b, '?', sum]);					
				}
			}
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])}); */
		
		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(110, 1000);
			b = this.randomLowerBound(110, 1000);
			
			if(a%10!=0 || b%10!=0) continue;
			
			sum = a+b;
			if(sum<1000){
				tmpstr=[a, '+', b, '?', sum].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {					
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"几百几十加几百几十", "id":"30-001-0005", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 几百几十减几百几十
		规则ID: 30-001-0006
		描述: a-b 如：940-820、940-850（将两位数减两位数中，减数和被减数均扩大十倍）
		备注：a-b=（  ）
			  （  ）+b=a
			  b+（  ）=a
	*/
	rule_30_001_0006:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=11748, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);		
		for(var i=0; i<count;){
			a = this.randomLowerBound(110, 1000);
			b = this.randomLowerBound(110, 1000);
			
			if(a%10!=0 || b%10!=0) continue;
			
			type=this.randomLowerBound(1, 4);			
			sum = a-b;			
			if(sum>0){
				switch(type){
					case 1:
						tmpstr=[a, '-', b, '?', sum].join(' ');
						break;
					case 2:
						tmpstr=['?', '+', b, a, sum].join(' ');
						break;
					case 3:
						tmpstr=[b, '+', '?', a, sum].join(' ');
						break;
				}
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {					
					allTests.push(tmpstr);
					i++;
				}
			}			
		}		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"几百几十减几百几十", "id":"30-001-0006", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 三位数加两、三位数的不进位加
		规则ID: 30-002-0001
		描述: 三位数加两位数的不进位加法：（100a+10b+c）+（10d+e）（0＜和＜1000，a、d=1、2…9，b、c、e=0、1…9，c+e＜10，b+d＜10）
			  三位数加三位数的不进位加法：（100a+10b+c）+（100d+10e+f）（0＜和＜1000，a、d=1、2…9，b、c、e、f=0、1…9，a+d＜10，b+e＜10，c+f＜10）
		备注：加数+加数=（   ）
	*/
	rule_30_002_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=131175, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(10, 1000);			
			sum=a+b;
			if(sum<1000){
				var gw = a%10 + b%10, sw;
				if(b>=100){
					sw = parseInt(a%100/10) + parseInt(b%100/10);
				}else{
					sw = parseInt(a%100/10) + parseInt(b/10);
				}
				if(gw<10 && sw<10){
					tmpstr=[a, '+', b, '?', sum].join(' ');
					if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
						allTests.push(tmpstr);
						i++;
					}
				}
			}
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数加两、三位数的不进位加", "id":"30-002-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 三位数加两、三位数的不连续进位加
		规则ID: 30-002-0002
		描述: 三位数加两位数的不连续进位加法：（100a+10b+c）+（10d+e）（0＜和＜1000，a、d=1、2…9，b、c、e=0、1…9，c+e＞10，b+d+1＜10或c+e＜10，b+d＞10，a+1＜10）
			  三位数加三位数的不连续进位加法：（100a+10b+c）+（100d+10e+f）（0＜和＜2000，a、d=1、2…9，b、c、e、f=0、1…9，a+d＞10，b+e＜10，c+f＜10或a+d+1＜10，b+e＞10，c+f＜10或a+d＜10，b+e+1＜10，c+f＞10或c+f＞10，b+e+1＜10，a+d＞10）
		备注：加数+加数=（   ）
	*/
	rule_30_002_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=250164, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(10, 1000);			
			var gw = a%10 + b%10, sw;
			sum=a+b;
			if(b<100) {
				if(sum<1000){
					sw = parseInt(a%100/10) + parseInt(b/10);
					if((gw>10 && sw<9) || (gw<10 && sw>10) ){
						tmpstr=[a, '+', b, '?', sum].join(' ');
						if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
							allTests.push(tmpstr);
							i++;
						}						
					}
				}
			}else {
				if(sum<2000){
					sw = parseInt(a%100/10) + parseInt(b%100/10);
					var bw = parseInt(a/100) + parseInt(b/100);
					if((bw>10 && sw<10 && gw<10) || (bw<9 && sw>10 && gw<10) || (bw<10 && sw<9 && gw>10)){
						tmpstr=[a, '+', b, '?', sum].join(' ');
						if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
							allTests.push(tmpstr);
							i++;
						}
					}
				}
			}
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数加两、三位数的不连续进位加", "id":"30-002-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 三位数加两、三位数的连续进位加
		规则ID: 30-002-0003
		描述: 三位数加两位数的连续进位加法：（100a+10b+c）+（10d+e）（0＜和＜1000，a、d=1、2…9，b、c、e=0、1…9，c+e＞10，b+d+1＞10）
			  三位数加三位数的连续进位加法：（100a+10b+c）+（100d+10e+f）（0＜和＜2000，a、d=1、2…9，b、c、e、f=0、1…9，a+d+1＜10，b+e+1＞10，c+f＞10或a+d+1＞10，b+e+1＞10，c+f＞10）
		备注：加数+加数=（   ）
	*/
	rule_30_002_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=219915, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(10, 1000);			
			var gw = a%10 + b%10, sw;
			sum=a+b;
			if(b<100) {
				if(sum<1000){
					sw = parseInt(a%100/10) + parseInt(b/10);
					if(gw>=10 && sw>=9){
						tmpstr=[a, '+', b, '?', sum].join(' ');
						if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
							allTests.push(tmpstr);
							i++;
						}						
					}
				}
			}else {
				if(sum<2000){
					sw = parseInt(a%100/10) + parseInt(b%100/10);
					var bw = parseInt(a/100) + parseInt(b/100);
					if((bw<9 && sw>=9 && gw>=10) || (bw>=9 && sw>=9 && gw>=10)){
						tmpstr=[a, '+', b, '?', sum].join(' ');
						if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
							allTests.push(tmpstr);
							i++;
						}
					}
				}
			}
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数加两、三位数的连续进位加", "id":"30-002-0003", "maxCount":maxLength, "tests":tests};	
	},	
	
	/*	
		知识点: 三位数减两、三位数的不退位减
		规则ID: 30-002-0004
		描述: 三位数减两位数不退位减：（100a+10b+c）-（10d+e）（a、c、d、e=1、2…9，c-e≥,0，b-d≥0）
			  三位数减三位数不退位减：（100a+10b+c）-（100d+10e+f）（差＞0，a、d=1、2…9，b、c、e、f=0、1…9，a-d≥0，b-e≥0，c-f≥0）
		备注：被减数-减数=（   ）
	*/
	rule_30_002_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=157500, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(10, 1000);			
			var gw = a%10 + b%10, sw;
			sum=a-b;
			
			if(sum>0){
				if(b<100){
					sw = parseInt(a%100/10) - parseInt(b/10);
					if(gw>=0 && sw>=0){
						tmpstr = [a, '-', b, '?', sum].join(' ');
						if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
							allTests.push(tmpstr);
							i++;
						}
					}
				}else{
					sw = parseInt(a%100/10) - parseInt(b%100/10);
					var bw = parseInt(a/100) - parseInt(b/100);
					if(gw>=0 && sw>=0 && bw>= 0) {
						tmpstr = [a, '-', b, '?', sum].join(' ');
						if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
							allTests.push(tmpstr);
							i++;
						}
					}
				}
			}			
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数减两、三位数的不退位减", "id":"30-002-0004", "maxCount":maxLength, "tests":tests};	
	},	

	/*	
		知识点: 三位数减两、三位数的不连续退位减
		规则ID: 30-002-0005
		描述: 三位数减两位数不连续退位减：（100a+10b+c）-（10d+e）（差＞0，a、c、d、e=1、2…9，c-e＜0，b-d≥1或c-e＞0，b-d＜0）
			  三位数减三位数连续退位减：（100a+10b+c）-（100d+10e+f）（差＞0，a、d=1、2…9，b、c、e、f=0、1…9，a-d≥0，b-e≥1，c-f≤0或c-f＞0，b-e＜0）
		备注：被减数-减数=（   ）
	*/
	rule_30_002_0005:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=217080, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(10, 1000);
			
			sum=a-b;
			if(sum>0){
				var gw = a%10 - b%10, sw = b>=100? parseInt(a%100/10) - parseInt(b%100/10) : parseInt(a%100/10) - parseInt(b/10);
				if((gw>=0 && sw<0) || (gw<0 && sw>=1)){
					tmpstr = [a, '-', b, '?', sum].join(' ');
					if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
						allTests.push(tmpstr);
						i++;
					}					
				}
			}
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数减两、三位数的不连续退位减", "id":"30-002-0005", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 三位数减两、三位数的连续退位减
		规则ID: 30-002-0006
		描述: 三位数减两位数连续退位减：（100a+10b+c）-（10d+e）（差＞0，a、d=1、2…9，b、c、d=0、1…9，c-e＜0，b-1-d＜0）
			  三位数减三位数连续退位减：（100a+10b+c）-（100d+10e+f）（差＞0，a、d=1、2…9，b、c、e、f=0、1…9，c-f＜0，b-1-e＜0，a-1-d≥0）
		备注：被减数-减数=（   ）
	*/
	rule_30_002_0006:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=110970, a, b, sum, canRepeat, tmpstr, type, allTests=[];
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(10, 1000);
			
			sum=a-b;
			if(sum>0){
				var gw = a%10 - b%10, sw = b>=100? parseInt(a%100/10) - parseInt(b%100/10) : parseInt(a%100/10) - parseInt(b/10);
				if(gw<0 && sw<1){
					tmpstr = [a, '-', b, '?', sum].join(' ');
					if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
						allTests.push(tmpstr);
						i++;
					}					
				}
			}
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数减两、三位数的连续退位减", "id":"30-002-0006", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 整十、整百、整千乘一位数
		规则ID: 30-003-0001
		描述: 10n×b或100n×b或1000n×b（n=1、2、3…9，b=1、2…9）
		备注：因数×因数=（   ）
	*/
	rule_30_003_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests = [], token = '×';
		
		for(var a=1; a<=9; a++){
			for(var b=1; b<=9; b++){				
				allTests.push([a*10, token, b, '?', a*b*10]);
				allTests.push([a*100, token, b, '?', a*b*100]);
				allTests.push([a*1000, token, b, '?', a*b*1000]);
			}
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"整十、整百、整千乘一位数", "id":"30-003-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数乘一位数不进位
		规则ID: 30-003-0002
		描述: （10a+b）×c（a、b、c=1、2…9，a×c＜10，b×c＜10）
		备注：因数×因数=（   ）
	*/
	rule_30_003_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests = [], token = '×';
		
		for(var a=10; a<=99; a++){
			for(var b=1; b<=9; b++){				
				if((a%10)*b<10 && parseInt(a/10)*b<10){
					allTests.push([a, token, b, '?', a*b]);
					allTests.push([b, token, a, '?', a*b]);
				}				
			}
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数乘一位数不进位", "id":"30-003-0002", "maxCount":maxLength, "tests":tests};	
	},	
	
	/*	
		知识点: 三位数乘一位数不进位
		规则ID: 30-003-0003
		描述: （100a+10b+c）×d（a、b、c、d=1、2…9，a×d＜10，b×d＜10，c×d＜10）
		备注：因数×因数=（   ）
	*/
	rule_30_003_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength = 1086, a, b, canRepeat, allTests = [], token = '×';
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(1, 10);			
			
			var gw = (a%10)*b, sw = parseInt(a%100/10)*b, bw = parseInt(a/100)*b;
			if(gw<10 && sw<10 && bw<10){
				var type = this.randomLowerBound(1, 3);				
				var tmpstr = type === 1 ? [a, token, b, '?', a*b].join(' ') : [b, token, a, '?', a*b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数乘一位数不进位", "id":"30-003-0003", "maxCount":maxLength, "tests":tests};	
	},	
	
	/*	
		知识点: 两位数乘一位数不连续进位乘法
		规则ID: 30-003-0004
		描述: （10a+b）×c（积＜100，a、b、c=1、2…9，b×c＞10）
		备注：因数×因数=（   ）
	*/
	rule_30_003_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests = [], token = '×';
		
 		for(var a=10; a<=99; a++){
			for(var b=1; b<=9; b++){
				var sum=a*b;
				if(sum<100 && (a%10)*b>10) allTests.push([a, token, b, '?', sum]);
			}
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数乘一位数不连续进位乘法", "id":"30-003-0004", "maxCount":maxLength, "tests":tests};	
	},	
	
	/*	
		知识点: 两位数乘一位数连续进位乘法
		规则ID: 30-003-0005
		描述: （10a+b）×c（积＞100，a、b、c=1、2…9，b×c＞10）
		备注：因数×因数=（   ）
	*/
	rule_30_003_0005:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests = [], token = '×';
		
 		for(var a=10; a<=99; a++){
			for(var b=1; b<=9; b++){
				var sum=a*b;
				if(sum>100 && (a%10)*b>10) allTests.push([a, token, b, '?', sum]);
			}
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数乘一位数连续进位乘法", "id":"30-003-0005", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 三位数乘一位数不连续进位乘法
		规则ID: 30-003-0006
		描述: （100a+10b+c）×d（a、b、c、d=1、2…9，c×d＞10，（10b+c）×d＜100，a×d＜10，或c×d＞10，（10b+c）×d＜100，a×d＞10或积＜1000，c×d＜10，b×d＞10）
		备注：因数×因数=（   ）
	*/
	rule_30_003_0006:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength = 1134, a, b, canRepeat, allTests = [], token = '×';
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(1, 10);
			
			var gw = a%10, sw = parseInt(a%100/10), bw = parseInt(a/100);
			if((gw*b>10 && (10*sw+gw)*b<100 && bw*b<10) || 
			   (gw*b>10 && (10*sw+gw)*b<100 && bw*b>10) ||
			   (a*b<1000 && gw*b<10 && sw*b>10)){
				
				var tmpstr = [a, token, b, '?', a*b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数乘一位数不连续进位乘法", "id":"30-003-0006", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 三位数乘一位数连续进位乘法
		规则ID: 30-003-0007
		描述: （100a+10b+c）×d（积＞1000，a、b、c、d=1、2…9，c×d＞10，（10b+c）×d＞100
		备注：因数×因数=（   ）
	*/
	rule_30_003_0007:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength = 4050, a, b, canRepeat, allTests = [], token = '×';
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		
		for(var i=0; i<count;){
			a = this.randomLowerBound(111, 1000);
			b = this.randomLowerBound(1, 10);
			
			var gw = a%10, bw = parseInt(a/100), sum=a*b;
			if(sum>100 && gw*b>10 && (a-100*bw)*b>100){
				var tmpstr = [a, token, b, '?', a*b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
					allTests.push(tmpstr);
					i++;
				}
			}
		}
		
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"三位数乘一位数连续进位乘法", "id":"30-003-0007", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 0的乘法
		规则ID: 30-003-0008
		描述: a×0或0×a（a：两位数或三位数）
		备注：a×0或0×a
	*/
	rule_30_003_0008:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1980, a, b, canRepeat, allTests=[], token='×';
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a = this.randomLowerBound(10, 1000);
			b = this.randomLowerBound(1, 3);
			var tmpstr = b===1?[a, token, 0, '?', 0].join(' '):[0, token, a, '?', 0].join(' ');
			if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
				allTests.push(tmpstr);
				i++;
			}
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"0的乘法", "id":"30-003-0008", "maxCount":maxLength, "tests":tests};	
	},	
	
	/*	
		知识点: 乘数中间或末尾有0的乘法
		规则ID: 30-003-0009
		描述: （100a+b）×c或（100a+10b）×c（a、b、c=1、2…9）
		备注：（100a+b）×c
			   c×（100a+b）
			  （100a+10b）×c
			   c×（100a+10b）
	*/
	rule_30_003_0009:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=2916, a, b, canRepeat, allTests=[], token='×';
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a = this.randomLowerBound(101, 1000);
			if(a%100 === 0) continue;			
			if(a%10==0 || a%100<10){
				b = this.randomLowerBound(1, 10);
				var type = this.randomLowerBound(1, 3);			
				var tmpstr = b===1?[a, token, b, '?', a*b].join(' '):[b, token, a, '?', a*b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"乘数中间或末尾有0的乘法", "id":"30-003-0009", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 整十、整百、整千除以一位数
		规则ID: 31-001-0001
		描述: 10n÷b或100n÷b或1000n÷b（商为整数，n=1、2、3…9，b=1、2…9）
		备注：被除数÷除数=（   ）
	*/
	rule_31_001_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';
		
		var scales=[10, 100, 1000];
 		for(var a=1; a<10; a++){
			for(var b=1; b<10; b++){
				scales.map(function(scale){
					var tmp = scale*a;
					if(tmp%b==0) allTests.push([tmp, token, b, '?', parseInt(tmp/b)]);
				});				
			}			
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"整十、整百、整千除以一位数", "id":"31-001-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 几百几十（几千几百）除以一位数
		规则ID: 31-001-0002
		描述: （100a+10b）÷c或（1000a+100b）÷c（商为整数，a、b、c=1、2…9）
		备注：被除数÷除数=（   ）
	*/
	rule_31_001_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=899, a, b, canRepeat, allTests=[], token='÷';
		
		/* var scales=[10, 100];
 		for(var a=11; a<100; a++){
			for(var b=1; b<10; b++){
				scales.map(function(scale){
					var tmp = scale*a;
					if(tmp%b==0) allTests.push([tmp, token, b, '?', parseInt(tmp/b)]);
				});				
			}			
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])}); */

		
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a = this.randomLowerBound(11, 100);
			b = this.randomLowerBound(1, 10);
			
			var type = this.randomLowerBound(1, 3);			
			if(type==1) a*=10; else a*=100;
			
			if(a%b==0){
				var tmpstr = [a, token, b, '?', parseInt(a/b)].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
					allTests.push(tmpstr);
					i++;
				}
			}			
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"几百几十（几千几百）除以一位数", "id":"31-001-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数除以一位数（被除数十位能除尽）
		规则ID: 31-001-0003
		描述: （10a+b）÷c（商为整数，a、b、c=1、2…9，a=nc，n=1、2…9）
		备注：被除数÷除数=（   ）
	*/
	rule_31_001_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
 		for(var a=10; a<100; a++){
			for(var b=1; b<10; b++){
				if(a%b==0 && (parseInt(a/10))%b==0){
					allTests.push([a, token, b, '?', parseInt(a/b)]);
				}
			}			
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数除以一位数（被除数十位能除尽）", "id":"31-001-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 两位数除以一位数（被除数十位不能除尽）
		规则ID: 31-001-0004
		描述: （10a+b）÷c（商为整数，a、b、c=1、2…9，a不能被c整除）
		备注：被除数÷除数=（   ）
	*/
	rule_31_001_0004:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
 		for(var a=10; a<100; a++){
			for(var b=1; b<10; b++){
				if(a%b==0 && (parseInt(a/10))%b!=0){
					allTests.push([a, token, b, '?', parseInt(a/b)]);
				}
			}			
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"两位数除以一位数（被除数十位不能除尽）", "id":"31-001-0004", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 首位够除的三位数除以一位数
		规则ID: 31-001-0005
		描述: （100a+10b+c）÷d  商为整数（a≥d且能被d整除时，b≥d，c不为0；a≥d但不能被d整除时，c不为0）
		备注：被除数÷除数=（   ）
	*/
	rule_31_001_0005:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=1930, a, b, canRepeat, allTests=[], token='÷';
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(1, 10);			
			
			if(a%b==0) {
				var gw = a%10, bw = parseInt(a/100), sw= parseInt(a%100/10);
				if((bw%b==0 && sw>=b && gw!=0) || (bw%b!=0 && gw!=0)){
					var tmpstr = [a, token, b, '?', parseInt(a/b)].join(' ');
					if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
						allTests.push(tmpstr);
						i++;
					}
				}				
			}
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"首位够除的三位数除以一位数", "id":"31-001-0005", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 首位不够除的三位数除以一位数
		规则ID: 31-001-0006
		描述: （100a+10b+c）÷d  商为整数（a＜d，c不为0）
		备注：被除数÷除数=（   ）
	*/
	rule_31_001_0006:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
 		for(var a=100; a<1000; a++){
			for(var b=1; b<10; b++){
				if(a%b==0) {
					var gw = a%10, bw = parseInt(a/100);
					if(gw!=0 && bw<b)
						allTests.push([a, token, b, '?', parseInt(a/b)]);
				}
			}			
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"首位不够除的三位数除以一位数", "id":"31-001-0006", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 商中间有0的除法
		规则ID: 31-001-0007
		描述: （100a+b）÷c 商为整数（a、b=1、2…9，且均能被c整除）或（100a+10b+c）÷d 商为整数（a、b、c=1、2…9，且a能被c整除，b＜d）
		备注：被除数÷除数=（   ）
	*/
	rule_31_001_0007:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
 		for(var a=100; a<1000; a++){
			for(var b=1; b<10; b++){
				if(a%b==0) {
					var gw = a%10, bw = parseInt(a/100), sw= parseInt(a%100/10);
					if((sw==0 && gw%b==0 && bw%b==0) || (sw<b && bw%gw==0))					
						allTests.push([a, token, b, '?', parseInt(a/b)]);
				}
			}			
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"商中间有0的除法", "id":"31-001-0007", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 商末尾有0的除法
		规则ID: 31-001-0008
		描述: （100a+10b）÷c 商为整数（a、b、c=1、2…9）
		备注：被除数÷除数=（   ）
	*/
	rule_31_001_0008:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
 		for(var a=110; a<=990; a+=10){
			for(var b=1; b<10; b++){
				if(a%b==0) allTests.push([a, token, b, '?', parseInt(a/b)]);
			}			
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"商末尾有0的除法", "id":"31-001-0008", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 口算乘法【部分规则因与之前的规则重复故未作实现】
		规则ID: 31-002-0001
		描述: 
			a×b如：11×5（积＜100，且11≤a＜100，b=1、2…9）【与 30-003-0002 或 30-003-0003 或 30-003-0004 或 30-003-0005 重复】
			a×b如：30×5（a=10n，n、b=1、2…9）【与 30-003-0001 重复】
			a×b如：20×40（a、b=10n，n=1、2…9）
			a×b如：20×300（a=10n，b=100n，n=1、2…9）
			a×b如：140×5（积＜1000，a=10n，11≤n≤99，b=1、2…9）【与 30-003-0002 或 30-003-0003 或 30-003-0004 或 30-003-0005 重复】
		备注：a×b=（   ）
	*/
	rule_31_002_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='×';		
				
 		for(var a=1; a<10; a++){
			for(var b=1; b<10; b++){
				allTests.push([a*10, token, b*10, '?', a*b*100]);				
			}
		}
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"口算乘法", "id":"31-002-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 末尾是0的三位数乘整十数
		规则ID: 40-001-0001
		描述: 如：300×50、450×50
		备注：300×50=（ ）；450×50=（ ）
	*/
	rule_40_001_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=810, a, b, canRepeat, allTests=[], token='×';
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(10, 100);			
			
			if(a%10==0 && b%10==0) {
				var tmpstr = [a, token, b, '?', a*b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
					allTests.push(tmpstr);
					i++;
				}				
			}
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"末尾是0的三位数乘整十数", "id":"40-001-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 中间是0的三位数乘整十数
		规则ID: 40-001-0002
		描述: 如：304×50
		备注：304×50=（ ）
	*/
	rule_40_001_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength=810, a, b, canRepeat, allTests=[], token='×';	
		
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			a = this.randomLowerBound(100, 1000);
			b = this.randomLowerBound(10, 100);			
			
			if(a%100<10 && b%10==0) {
				var tmpstr = [a, token, b, '?', a*b].join(' ');
				if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
					allTests.push(tmpstr);
					i++;
				}				
			}
		}
		var tests=[];
		allTests.map(function(i){ tests.push(i.split(' '))});
		
		return {"title":"中间是0的三位数乘整十数", "id":"40-001-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 整十数除整十数
		规则ID: 40-002-0001
		描述: 如：60÷20
		备注：60÷20=（ ）
	*/
	rule_40_002_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
		for(var a=10; a<100; a+=10){
			for(var b=10; b<100; b+=10){
				if(a%b==0) allTests.push([a, token, b, '?', parseInt(a/b)]);
			}
		}
		
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"整十数除整十数", "id":"40-002-0001", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 整十数除整百数
		规则ID: 40-002-0002
		描述: 如：100÷50
		备注：100÷50=（ ）
	*/
	rule_40_002_0002:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
		for(var a=100; a<1000; a+=100){
			for(var b=10; b<100; b+=10){
				if(a%b==0) allTests.push([a, token, b, '?', parseInt(a/b)]);
			}
		}
		
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"整十数除整百数", "id":"40-002-0002", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
		知识点: 整十数除几百几十
		规则ID: 40-002-0003
		描述: 如：780÷30
		备注：780÷30=（ ）
	*/
	rule_40_002_0003:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
		for(var a=100; a<1000; a+=10){
			for(var b=10; b<100; b+=10){
				if(a%b==0) allTests.push([a, token, b, '?', parseInt(a/b)]);
			}
		}
		
		maxLength = allTests.length;
		var indexes=[], tests=[];
		canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		for(var i=0; i<count;){
			var a = this.randomLowerBound(0, maxLength);
			if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		}		
		indexes.map(function(i){ tests.push(allTests[i])});
		
		return {"title":"整十数除几百几十", "id":"40-002-0003", "maxCount":maxLength, "tests":tests};	
	},
	
	/*	
	[规则定义不明确！]
		知识点: 有小括号的四则运算
		规则ID: 41-001-0001
		描述: 如：（460-440）×20,（420+70）÷70
		备注：（460-440）×20=（ ）
	*/
	/*
	rule_41_001_0001:function(count, allowRepeat){
		if(count <= 0) return null;
		var maxLength, a, b, canRepeat, allTests=[], token='÷';		
		
		// method1
		// for(var a=100; a<1000; a+=10){
		// 	for(var b=10; b<100; b+=10){
		// 		if(a%b==0) allTests.push([a, token, b, '?', parseInt(a/b)]);
		// 	}
		// }
		// 
		// maxLength = allTests.length;
		// var indexes=[], tests=[];
		// canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		// for(var i=0; i<count;){
		// 	var a = this.randomLowerBound(0, maxLength);
		// 	if(canRepeat || indexes.indexOf(a)<0) indexes[i++] = a;
		// }		
		// indexes.map(function(i){ tests.push(allTests[i])});
		
		
		// method2
		// canRepeat = this.getAllowRepeat(count, maxLength, allowRepeat);
		// for(var i=0; i<count;){
		// 	a = this.randomLowerBound(100, 1000);
		// 	b = this.randomLowerBound(10, 100);			
		// 	
		// 	if(a%100<10 && b%10==0) {
		// 		var tmpstr = [a, token, b, '?', a*b].join(' ');
		// 		if(canRepeat || this.indexOf(allTests, tmpstr)<0) {
		// 			allTests.push(tmpstr);
		// 			i++;
		// 		}				
		// 	}
		// }
		// var tests=[];
		// allTests.map(function(i){ tests.push(i.split(' '))}); 
		// 
		// return {"title":"有小括号的四则运算", "id":"41-001-0001", "maxCount":maxLength, "tests":tests};	
	}
	*/
}