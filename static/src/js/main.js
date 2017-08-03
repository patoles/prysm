import html2canvas from 'html2canvas';
import Canvas3D from './canvas3d.js';

window.addEventListener("load", () => {
	var waveItemList = document.getElementsByClassName("wavify");
	[].forEach.call(waveItemList, (item, key) => {
		var positionStyle = getComputedStyle(item)["position"];
		if (positionStyle === "static" || positionStyle === "")
			item.style.position = "relative";
		html2canvas(item).then(function(canvas) {
			item.style.border = 'none';
			var speed = (item.dataset.waveSpeed && parseFloat(item.dataset.waveSpeed)) || 0.02;
			var x = item.dataset.waveX && parseFloat(item.dataset.waveX);
			var y = item.dataset.waveY && parseFloat(item.dataset.waveY);
			var z = item.dataset.waveZ && parseFloat(item.dataset.waveZ);
			var shockParams = [x || 10.1, y || 0.8, z || 0.1];
			new Canvas3D({parent:item, id:'canvas-wavify-' + key, hd:true, hide:false, texture:canvas.toDataURL('png'), waveParams:{shockParams, speed}});
		});
	});
});
