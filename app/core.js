/*
	@author yanSun
	插件核心模块，负责app加载前阶段，并加载app
*/
(function(window){
	"use strict";
	var APP_URL = "";
	window.dobotStatus = 0; //0代表未加载，1代表正在加载，2代表加载, -1代表加载出错
	function injectAppPoint(){
		var douyuHeaderElement = document.getElementById('header').getElementsByClassName('header_nav')[0],
			pointElement = document.createElement('li');
		pointElement.id = 'dobot_point';
		pointElement.innerHTML = "<a href='javascript:;'>Dobot</a><img id='dobot_loading' style='display:none;width: 20px;height: 20px;position: absolute;top: -10px;right: 3px;' src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHdpZHRoPScxMjBweCcgaGVpZ2h0PScxMjBweCcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJ1aWwtcmlwcGxlIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0ibm9uZSIgY2xhc3M9ImJrIj48L3JlY3Q+PGc+IDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMHMiIGtleVRpbWVzPSIwOzAuMzM7MSIgdmFsdWVzPSIxOzE7MCI+PC9hbmltYXRlPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQwIiBzdHJva2U9IiNlZjY2MDEiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjBzIiBrZXlUaW1lcz0iMDswLjMzOzEiIHZhbHVlcz0iMDsyMjs0NCI+PC9hbmltYXRlPjwvY2lyY2xlPjwvZz48Zz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjFzIiBrZXlUaW1lcz0iMDswLjMzOzEiIHZhbHVlcz0iMTsxOzAiPjwvYW5pbWF0ZT48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSIjZWY2NjAxIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgZHVyPSIycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIxcyIga2V5VGltZXM9IjA7MC4zMzsxIiB2YWx1ZXM9IjA7MjI7NDQiPjwvYW5pbWF0ZT48L2NpcmNsZT48L2c+PC9zdmc+'><span id='dobot_error_status' style='position: absolute;font-size: 4px;top: -6px;right: -9px;width: auto;height: auto;background-color: #ef6601;color: #fff;display: block;line-height: initial;'>error</span>";
		douyuHeaderElement.appendChild(pointElement);
		pointElement.onclick = function(){
			switch(window.dobotStatus){
				case -1:
				case 0 :
					loadApp();
					break;
				case 1 :
					showLoadingStatus();
					break;
				case 2 :
					showApp();
					break;
			}
		};
		loadApp();
	}
	/*
		加载app
	*/
	function loadApp(){
		var appWraper = document.createElement('div'),
			xhr = new XMLHttpRequest();
		window.dobotStatus = 1;
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					appWraper.innerHTML = xhr.responseText;
				}
			}
		};
        xhr.open('GET', APP_URL);
        xhr.send(null);
	}
	function showLoadingStatus(){
		document.getElementById('dobot_loading').style.display = 'block';
		hideErrorStatus();
	}
	function hideLoadingStatus(){
		document.getElementById('dobot_loading').style.display = 'none';
	}
	function showErrorStatus(){
		document.getElementById('dobot_error_status').style.display = 'block';
		hideLoadingStatus();
	}
	function hideErrorStatus(){
		document.getElementById('dobot_error_status').style.display = 'none';

	}
	function showApp(){
		var appPanelElement = document.getElementById('dobot');
		hideLoadingStatus();
		appPanelElement.style.display = 'block';
	}
	injectAppPoint();
})(window);