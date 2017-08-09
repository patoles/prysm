import html2canvas from 'html2canvas';
//import DomToCanvas from './domToCanvas';
import CanvasShader from './canvas-shader';

class Shapeshift{
	constructor(target, fragmentShader, vertexShader, params){
        var action = (item) => {
			var positionStyle = getComputedStyle(item)["position"];
			if (positionStyle === "static" || positionStyle === "")
				item.style.position = "relative";
			/*
				DomToCanvas.getCanvas(item).then(function(canvas){
					new CanvasShader({parent:item, id:'canvas-wavify-' + Date.now(), hd:true, texture:canvas.toDataURL('png')});
				});
			*/
			html2canvas(item, {
				onrendered: function(canvas) {
					item.style.border = 'none';
					new CanvasShader(item, canvas.toDataURL('png'), fragmentShader || 'shockwave', vertexShader || 'default', params);
				}
			});
		}
        if (typeof(target) === "string")
            [].forEach.call(document.getElementsByClassName(target), (item) => {action(item);});
        else
            action(target);
	}
}

export default Shapeshift;