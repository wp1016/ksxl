/*
 @author cap
 @date 2017-4-27
*/

/*
 全局方法
 */
var method = {};

/**
 * 处理滚动条元素在在电子白板上无法通过触摸滚动的问题
 * 放在method全局对象上供电子白板调用
 */
method.scroll = function() {
	this.scroll.on = true;
	Vue.nextTick(function() {
		[].forEach.call(document.querySelectorAll('.v-scroll'), function(item) {
			item.classList.add('v-scroll-active');
		});
	});
};

/**
 * 电子白板上调取虚拟键盘方法
 */
method.callVirtualKeyboard = function(callback) {
    // 若后续存在需要呼出虚拟键盘的输入元素，请加入selectors数组中
    var selectors = [
        "input"
    ].join(',');

    var despites = ["inp-desp"];
    var selElems = document.querySelectorAll(selectors), elems=[];
    selElems.map(function (it) {
        var curClassName = it.className + '';
        var b = false;
        for (var i = 0; i < despites.length; ++i) {
            if (curClassName.indexOf(despites[i]) >= 0) { b = true; break; }
        }
        if (!b) { elems.push(it); }
    });

	var eles = [].slice.call(document.querySelectorAll(selectors));
    document.addEventListener('click', function(e) {
		if (eles.indexOf(e.target) > -1) {
			callback.call(this);
		};
	}, false);
};

/* js修改配置参数方法
 * @param {Object} 参数项参考 config/settings.json
 * @param {String} 可选，无此参数时直接扩展$scope, 有此参数时扩展$scope指定名称的成员
 */
method.alterSettings = function (settings, key) {
    //console.log(settings);
    var scope = vm.$data.settings;
    if (key === undefined) {
        for (var item in settings) {
            scope[item] = settings[item];
        }
    } else {
        scope[settings] = key;
    }
    vm.$data.settings = scope;    
};


/* 由于各应用端使用自己的提交按钮，需提供方法供获取结果
 * @return {json} 做题结果
 */
method.queryAnswers = function (options) {
    var opt = { check: false };

    if (options !== undefined) {
        for (var key in options) {
            opt[key] = options[key];
        }
    }
    if (opt.check) { }
    if (!vm.userAns || vm.userAns.length <= 0) {
        //console.log("还没有开始不能提交");
        return "";
    }
    var json = vm.submit();
    return JSON.stringify(json);
};

/**
 * Vue公用组件，输入验证提示
 */
Vue.component('tooltips', {
	props: ['show'],
	template: '<transition name="tooltips"><div class="tooltips" v-show="show"><slot></slot></div></transition>'
});

/**
 * Vue自定指令
 */
Vue.directive('scroll', {

	bind: function(el) {

		var flagX = false, flagY = false;
		var x = 0, y = 0;

		el.addEventListener('mousedown', mousedownHandler, false);
		document.body.addEventListener('mousemove', mousemoveHandler, false);
		document.body.addEventListener('mouseup', mouseupHandler, false);

		el.classList.add('v-scroll');
		
		function mousedownHandler(e) {
			if (!method.scroll.on) return;
			if (el.scrollWidth <= el.clientWidth) {
				flagX = false;
			} else {
				flagX = true;
				x = e.clientX;
			};
			if (el.scrollHeight <= el.clientHeight) {
				flagY = false;
			} else {
				flagY = true;
				y = e.clientY;
			};
		};

		function mousemoveHandler(e) {
			var _x, _y;
			if (flagX) {
				_x = e.clientX;
				el.scrollLeft = el.scrollLeft + (x - _x);
				x = _x;
			};
			if (flagY) {
				_y = e.clientY;
				el.scrollTop = el.scrollTop + (y - _y);
				y = _y;
			};
		};

		function mouseupHandler(e) {
			flagX = false;
			flagY = false;
		};
	}
});

/**
 * 解析location.search
 */
Vue.urlSearch = (function() {
	var str = window.location.search.substring(1);
	var oSearch = {};
	// search 为空
	if (!str) return oSearch;
	str.split('&').filter(function(item) {
		return item;
	}).forEach(function(item) {
		var pos = item.indexOf('=');
		// 无值时，赋值为true
		if (pos == -1) {
			oSearch[item] = true;
		} else {
			oSearch[item.substring(0, pos)] = decodeURI(item.substring(pos + 1));
		};
	});
	return oSearch;
})();

/**
 * 统一处理title
 */
(function() {
	document.title = Vue.urlSearch.title || '';
})();

/**
 * ios viewport
 */
(function() {
	var oCon = document.querySelector('.c-container'),
		oMeta = document.querySelector('meta[name=viewport]');
	if (!oCon || !oMeta) return;
	var w = oCon.offsetWidth;
	var isIos = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	if (isIos) {
		oMeta.setAttribute('content', 'width=' + w);
	};
})();
