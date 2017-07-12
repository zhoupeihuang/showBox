var Showbo = {
	author: 'peyton',
	email: '625506370@qq.com',
	remark:"此版本为点击确定 不关闭而去触发其他事件的版本"
//	Showbo.Msg.confirm('请上传图片', '温馨提示', '确定','取消',function(flag){
//						if(flag =="yes"){
//							alert("我是不会关闭的")
//						}
//					});
};

//是否为ie浏览器  
Showbo.IsIE = !!document.all;
//ie浏览器版本  
Showbo.IEVersion = (function() {
	if(!Showbo.IsIE) return -1;
	try {
		return parseFloat(/msie ([\d\.]+)/i.exec(navigator.userAgent)[1]);
	} catch(e) {
		return -1;
	}
})();
//按id获取对象  
Showbo.$ = function(Id, isFrame) {
		var o;
		if("string" == typeof(Id)) o = document.getElementById(Id);
		else if("object" == typeof(Id)) o = Id;
		else return null;
		return isFrame ? (Showbo.IsIE ? frames[Id] : o.contentWindow) : o;
	}
	//按标签名称获取对象  
	//页面的高和宽******************************  
Showbo.isStrict = document.compatMode == "CSS1Compat"; //兼容性调节
Showbo.BodyScale = {
	x: 0,
	y: 0,
	tx: 0,
	ty: 0
}; //（x，y）：当前的浏览器容器大小  （tx，ty）：总的页面滚动宽度和高度 
Showbo.getClientHeight = function() { /*if(Showbo.IsIE)*/
	return Showbo.isStrict ? document.documentElement.clientHeight : document.body.clientHeight; /*else return self.innerHeight;*/
}
Showbo.getScrollHeight = function() {
	var h = !Showbo.isStrict ? document.body.scrollHeight : document.documentElement.scrollHeight;
	return Math.max(h, this.getClientHeight());
}
Showbo.getHeight = function(full) {
	return full ? this.getScrollHeight() : this.getClientHeight();
}
Showbo.getClientWidth = function() { /*if(Showbo.IsIE)*/
	return Showbo.isStrict ? document.documentElement.clientWidth : document.body.clientWidth; /*else return self.innerWidth;*/
}
Showbo.getScrollWidth = function() {
	var w = !Showbo.isStrict ? document.body.scrollWidth : document.documentElement.scrollWidth;
	return Math.max(w, this.getClientWidth());
}
Showbo.getWidth = function(full) {
		return full ? this.getScrollWidth() : this.getClientWidth();
	}
	//console.log(Showbo.getClientHeight()+"----"+Showbo.getScrollHeight()+"----"+Showbo.getHeight()+"----")
Showbo.initBodyScale = function() {
		Showbo.BodyScale.x = Showbo.getWidth(false);
		Showbo.BodyScale.y = Showbo.getHeight(false);
		Showbo.BodyScale.tx = Showbo.getWidth(true);
		Showbo.BodyScale.ty = Showbo.getHeight(true);
	}
	//页面的高和宽******************************  
Showbo.Msg = {
	INFO: 'info',
	ERROR: 'error',
	WARNING: 'warning',
	IsInit: false,
	timer: null,
	dvTitle: null,
	dvCT: null,
	dvBottom: null,
	dvBtns: null,
	lightBox: null,
	dvMsgBox: null,
	defaultWidth: '82%',
	moveProcessbar: function() {
		var o = Showbo.$('dvProcessbar'),
			w = o.style.width;
		if(w == '') w = 20;
		else {
			w = parseInt(w) + 20;
			if(w > 100) w = 0;
		}
		o.style.width = w + '%';
	},
	InitMsg: function(width) {
		//ie下不按照添加事件的循序来执行，所以要注意在调用alert等方法时要检测是否已经初始化IsInit=true       
		var ifStr = '<iframe src="javascript:false" mce_src="javascript:false" style="position:absolute; visibility:inherit; top:0px;left:0px;width:100%; height:100%; z-index:-1;' + 'filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>',
			html = '<div class="top"><div class="right"><div class="title" id="dvMsgTitle"></div><div class="cloceBoxe"></div></div></div>' +
			'<div class="body"><div class="right"><div class="ct" id="dvMsgCT"></div></div></div>' +
			'<div class="bottom" id="dvMsgBottom"><div class="right"><div class="btn" id="dvMsgBtns"></div></div></div>';

		(function($) {
			
//			$("body").delegate(".body", "click", function() {
//				Showbo.Msg.hide();
//			});
			$("body").delegate(".cloceBoxe", "click", function() {
				Showbo.Msg.hide();
			});
			
		})(jQuery);
		this.dvMsgBox = document.createElement("div");
		this.dvMsgBox.id = "dvMsgBox";
		this.dvMsgBox.innerHTML += html;
		document.body.appendChild(this.dvMsgBox);
		this.lightBox = document.createElement("div");
		this.lightBox.id = "ShowBolightBox";
		document.body.appendChild(this.lightBox);
		if(Showbo.IsIE && Showbo.IEVersion < 7) { //加iframe层修正ie6下无法遮盖住select的问题  
			this.lightBox.innerHTML += ifStr;
			this.dvMsgBox.innerHTML += ifStr;
		}
		this.dvBottom = Showbo.$('dvMsgBottom');
		this.dvBtns = Showbo.$('dvMsgBtns');
		this.dvCT = Showbo.$('dvMsgCT');
		this.dvTitle = Showbo.$('dvMsgTitle');
		this.IsInit = true;
	},
	checkDOMLast: function() { //此方法非常关键，要不无法显示弹出窗口。两个对象dvMsgBox和lightBox必须处在body的最后两个节点内  
		if(document.body.lastChild != this.lightBox) {
			document.body.appendChild(this.dvMsgBox);
			document.body.appendChild(this.lightBox);
		}
	},
	createBtn: function(p, v, fn) {
		var btn = document.createElement("input");
		btn.type = "button";
		btn.className = 'btn';
		btn.value = v;
		if(p == "yes") {
			btn.className = btn.className + " btnYes"
		}
		if(p == "no") {
			btn.className = btn.className + " btnBanel"
		}
		btn.onclick = function() {
			if(p == 'yes'){
				var r = fn(p);
				console.log(r)
				
				if(r){
				//返回的是 true 关闭
					Showbo.Msg.hide();
				}
				if(typeof(r) == "false"){
				//返回的是false的情况 暂不处理
				} 
				if(typeof(r) == "undefined"){
				//不返回的是undefined 的情况 暂不处理
				//为填补以前不写return 处理
				}
			}else{
				Showbo.Msg.hide();	
			}
			if(fn) fn(p);
		}
		return btn;
	},
	createAlertBtn: function(p, v) {
				var btn = document.createElement("input");
		btn.type = "button";
		btn.className = 'btn';
		btn.value = v;
		if(p == "yes") {
			btn.className = btn.className + " btnYes"
		}
		if(p == "no") {
			btn.className = btn.className + " btnBanel"
		}
		btn.onclick = function() {
			Showbo.Msg.hide();
			if(fn) fn(p);
		}
		return btn;
	},
	alert: function(msg, title, btn) {
		this.showAlert({
			buttons: {
				yes: btn
			},
			msg: msg,
			title: title
		});
		if(btn == "" || btn == null || btn === undefined) {
			//灰度层 增加 2秒关闭
			setTimeout(function() {
				Showbo.Msg.hide();
			}, 2000);
		}
	},
	confirm: function(msg, title, btn1, btn2, fn) {
		//fn为回调函数，参数和show方法的一致  
		this.show({
			buttons: {
				yes: btn1,
				no: btn2
			},
			msg: msg,
			title: title,
			fn: fn
		});

	},
	prompt: function(labelWord, defaultValue, txtId, fn) {
		if(!labelWord) labelWord = '请输入：';
		if(!defaultValue) defaultValue = "";
		if(!txtId) txtId = "msg_txtInput";
		this.show({
			title: '输入提示',
			msg: labelWord + '<input type="text" id="' + txtId + '" style="width:200px" value="' + defaultValue + '"/>',
			buttons: {
				yes: '确认',
				no: '取消'
			},
			fn: fn
		});
	},
	wait: function(msg, title) {
		if(!msg) msg = '正在处理..';
		this.show({
			title: title,
			msg: msg,
			wait: true
		});
	},
	showAlert: function(cfg) {
		//cfg:{title:'',msg:'',wait:true,icon:'默认为信息',buttons:{yes:'',no:''},fn:function(btn){回调函数,btn为点击的按钮，可以为yes，no},width:显示层的宽}  
		//如果是等待则wait后面的配置不需要了。。   
		if(!cfg) throw("没有指定配置文件！");
		//添加窗体大小改变监听  
		if(Showbo.IsIE) window.attachEvent("onresize", this.onResize);
		else window.addEventListener("resize", this.onResize, false);

		if(!this.IsInit) this.InitMsg(); //初始化dom对象  
		else this.checkDOMLast(); //检查是否在最后  

		//检查是否要指定宽，默认为300  
		if(cfg.width) this.defaultWidth = cfg.width;
		this.dvMsgBox.style.width = this.defaultWidth + 'px';
		//可以直接使用show方法停止为进度条的窗口  
		if(this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
		this.dvTitle.innerHTML = '';
		if(cfg.title) this.dvTitle.innerHTML = cfg.title;
		this.dvCT.innerHTML = '';
		if(cfg.wait) {
			if(cfg.msg) this.dvCT.innerHTML = cfg.msg;
			this.dvCT.innerHTML += '<div class="pro"><div class="bg" id="dvProcessbar"></div></div>';
			this.dvBtns.innerHTML = '';
			this.dvBottom.style.height = '10px';
			this.timer = setInterval(function() {
				Showbo.Msg.moveProcessbar();
			}, 1000);
		} else {
			//if(!cfg.icon)cfg.icon=Showbo.Msg.INFO;  
			if(!cfg.buttons || (!cfg.buttons.yes && !cfg.buttons.no)) {
				//不要加按钮的情况
			}
			if(cfg.icon) this.dvCT.innerHTML = '<div class="icon ' + cfg.icon + '"></div>';
			if(cfg.msg) this.dvCT.innerHTML += cfg.msg + '<div class="clear"></div>';
			this.dvBottom.style.minHeight = '0px';
			this.dvBtns.innerHTML = '<div class="height"></div>';
			if(cfg.buttons.yes) {
				console.log(cfg.buttons.yes)
				this.dvBtns.appendChild(this.createAlertBtn('yes', cfg.buttons.yes, cfg.fn));
				if(cfg.buttons.no) this.dvBtns.appendChild(document.createTextNode('　'));
			}
			if(cfg.buttons.no) this.dvBtns.appendChild(this.createBtn('no', cfg.buttons.no, cfg.fn));
		}
		Showbo.initBodyScale();
		this.dvMsgBox.style.display = 'block';
		this.lightBox.style.display = 'block';
		this.onResize(false);
	},
	show: function(cfg) {
		//cfg:{title:'',msg:'',wait:true,icon:'默认为信息',buttons:{yes:'',no:''},fn:function(btn){回调函数,btn为点击的按钮，可以为yes，no},width:显示层的宽}  
		//如果是等待则wait后面的配置不需要了。。   
		if(!cfg) throw("没有指定配置文件！");
		//添加窗体大小改变监听  
		if(Showbo.IsIE) window.attachEvent("onresize", this.onResize);
		else window.addEventListener("resize", this.onResize, false);

		if(!this.IsInit) this.InitMsg(); //初始化dom对象  
		else this.checkDOMLast(); //检查是否在最后  

		//检查是否要指定宽，默认为300  
		if(cfg.width) this.defaultWidth = cfg.width;
		this.dvMsgBox.style.width = this.defaultWidth + 'px';
		//可以直接使用show方法停止为进度条的窗口  
		if(this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
		this.dvTitle.innerHTML = '';
		if(cfg.title) this.dvTitle.innerHTML = cfg.title;
		this.dvCT.innerHTML = '';
		if(cfg.wait) {
			if(cfg.msg) this.dvCT.innerHTML = cfg.msg;
			this.dvCT.innerHTML += '<div class="pro"><div class="bg" id="dvProcessbar"></div></div>';
			this.dvBtns.innerHTML = '';
			this.dvBottom.style.height = '10px';
			this.timer = setInterval(function() {
				Showbo.Msg.moveProcessbar();
			}, 1000);
		} else {
			//if(!cfg.icon)cfg.icon=Showbo.Msg.INFO;  
			if(!cfg.buttons || (!cfg.buttons.yes && !cfg.buttons.no)) {
				//不要加按钮的情况
			}
			if(cfg.icon) this.dvCT.innerHTML = '<div class="icon ' + cfg.icon + '"></div>';
			if(cfg.msg) this.dvCT.innerHTML += cfg.msg + '<div class="clear"></div>';
			this.dvBottom.style.minHeight = '0px';
			this.dvBtns.innerHTML = '<div class="height"></div>';
			if(cfg.buttons.yes) {
				console.log(cfg.buttons.yes)
				this.dvBtns.appendChild(this.createBtn('yes', cfg.buttons.yes, cfg.fn));
				if(cfg.buttons.no) this.dvBtns.appendChild(document.createTextNode('　'));
			}
			if(cfg.buttons.no) this.dvBtns.appendChild(this.createBtn('no', cfg.buttons.no, cfg.fn));
		}
		Showbo.initBodyScale();
		this.dvMsgBox.style.display = 'block';
		this.lightBox.style.display = 'block';
		this.onResize(false);
	},
	hide: function() {
		this.dvMsgBox.style.display = 'none';
		this.lightBox.style.display = 'none';
		if(this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
		if(Showbo.IsIE) window.detachEvent('onresize', this.onResize);
		else window.removeEventListener('resize', this.onResize, false);
	},
	onResize: function(isResize) {
		if(isResize) Showbo.initBodyScale();
		Showbo.Msg.lightBox.style.width = Showbo.BodyScale.tx + 'px';
		Showbo.Msg.lightBox.style.height = Showbo.BodyScale.ty + 'px';
		Showbo.Msg.dvMsgBox.style.top = (Showbo.getClientHeight() - 157) / 2 + 'px';
		Showbo.Msg.dvMsgBox.style.left = Math.floor((Showbo.BodyScale.x - Showbo.Msg.dvMsgBox.offsetWidth) / 2) + 'px';
	}

}