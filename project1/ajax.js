var xhr = new XMLHttpRequest();
var xhr1 = new XMLHttpRequest();
var tab_pd = document.getElementById('tb-pd');
var tab_cl = document.getElementById('tb-cl');
var close = document.getElementById('tip-close');
var slideWrap = document.getElementById('slide-wrap');
var ctls = document.getElementById('slide-control').getElementsByTagName('li');

var tipVisualFn = (function() {
	function closeHandler() {
		document.getElementById('js-tip').style.visibility = "hidden";
	}
	var tipVisualAPI = {
		closeHandler : closeHandler,
	}
	return tipVisualAPI;
})();
var refreshFn = (function() {
	var courses_list_json;
	var courses_list_dom = document.getElementsByClassName('it');
	var top_list_dom = document.getElementsByClassName('top-it');
	function getUrlForCourses(pageNo, type) {
		return 'http://study.163.com/webDev/couresByCategory.htm?pageNo=' + pageNo + '&psize=20&type=' + type;
	}
	function setValue(dom,json) {
		dom.getElementsByClassName('it-pic')[0].style.cssText = "background-image:url("+json.middlePhotoUrl+")";
		dom.getElementsByClassName('it-pic')[0].title = json.description;
		dom.getElementsByClassName('it-tit')[0].innerHTML = json.name;
		dom.getElementsByClassName('it-auth')[0].innerHTML = json.provider;
		dom.getElementsByClassName('it-num')[0].innerHTML = json.learnerCount;
		dom.getElementsByClassName('it-price')[0].innerHTML = "￥ " + json.price;
	}
	function setTopListValue(dom,json) {
		dom.getElementsByClassName('it-pic')[0].style.cssText = "background-image:url("+json.smallPhotoUrl+")";
		dom.getElementsByClassName('it-tit')[0].innerHTML = json.name;
		dom.getElementsByClassName('it-num')[0].innerHTML = json.learnerCount;
	}
	function initTopList() {
		xhr1.onreadystatechange = function() {
			if (xhr1.readyState == 4) {
				if (xhr1.status == 200) {
					top_list_json = JSON.parse(xhr.responseText).list;
					for (var i = 0; i < top_list_dom.length; i++) {
						setTopListValue(top_list_dom[i],top_list_json[i]);
					}
				} else {
					console.log(xhr1.status);
				}
			}
		}
		xhr1.open('get','http://study.163.com/webDev/hotcouresByCategory.htm',true);
		xhr1.send(null);
	}
	function refresh(url,dom) {
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if(xhr.status == 200) {
					console.log(xhr.status);
					courses_list_json = JSON.parse(xhr.responseText).list;
					for (var i = 0; i < courses_list_json.length; i++) {
						setValue(dom[i],courses_list_json[i]);
					}
				} else {
					alert('Request was unsuccessful,status: ' + xhr.status);
				}
			}
		}
		xhr.open('get',url,true);
		xhr.send(null);
	}
	function tabChangedHandler(event) {
		event = event || window.event;
		var pageNo, type;
		switch(event.target) {
		case tab_pd: 
			type = 10;
			tab_pd.className = "select";
			tab_cl.className = "";
			break;
		case tab_cl:
			type = 20;
			tab_pd.className = "";
			tab_cl.className = "select";
			break;
		}
		var url = getUrlForCourses(1, type);
		refresh(url,courses_list_dom);
	}
	function init() {
		initTopList();
		var url = getUrlForCourses(1, 10);
		refresh(url,courses_list_dom);
	}
	var refreshFnAPI = {
		tabChangedHandler : tabChangedHandler,
		init : init,
	}
	return refreshFnAPI;
})();
var slideFn = (function() {
	
	var pics = document.getElementsByClassName('slide');
	var index = 0;
	slideWrap.timer = null;
	var pageTotal = pics.length - 1;
	function animation(ele) {
		value = 0;
		var step = function() {
			var tmpValue = value + 0.01;
			if (value <= 1) {
				ele.style.opacity = tmpValue;
				value = tmpValue;
			} else {
				ele.style.opacity = 1;
				clearInterval(anmiTimer);
			}
		}
		var anmiTimer = setInterval(step,5);
	}
	function autoPlay() {
		if (++index > pageTotal) index = 0;
		changePic(index);
	}
	function resumePlay() {
		slideWrap.timer = setInterval(autoPlay, 5000);
	}
	function pausePlay() {
		clearInterval(slideWrap.timer);
	}
	function changePic(index) {
		console.log(index);
		for (var i = 0; i < pics.length; i++) {
			pics[i].style.display = "none";
			ctls[i].className = ""
		}
		pics[index].style.display = "block";
		ctls[index].className = "on";
		animation(pics[index]);
	}
	function init() {
		for (var i = 0; i < ctls.length; i++) {
			pics[i].page = i;
			ctls[i].page = i;
			// ctls[i].onclick = slideFn.changePic(i);
		}
		slideWrap.timer = setInterval(autoPlay, 5000);
	}
	slideFnAPI = {
		pausePlay : pausePlay,
		resumePlay : resumePlay,
		autoPlay : autoPlay,
		changePic : changePic,
		init : init,
	}
	return slideFnAPI;
})();
window.onload = function init() {
	refreshFn.init();
	slideFn.init();
}

slideWrap.onmouseover = slideFn.pausePlay;
slideWrap.onmouseout = slideFn.resumePlay;
close.onclick = tipVisualFn.closeHandler;
tab_pd.onclick = refreshFn.tabChangedHandler;
tab_cl.onclick = refreshFn.tabChangedHandler;
for (var i = 0; i < ctls.length; i++) {
	ctls[i].onclick = function() {
		clearInterval(slideWrap.timer);
		slideFn.changePic(this.page);
	}
}