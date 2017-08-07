//import html2canvas from 'html2canvas';
import DomToCanvas from './domToCanvas';
import CanvasShader from './canvas-shader';

class Shapeshift{
	constructor(target){
        var action = (item) => {
			var positionStyle = getComputedStyle(item)["position"];
			if (positionStyle === "static" || positionStyle === "")
				item.style.position = "relative";
			DomToCanvas.getCanvas(item).then((canvas) => {
				new CanvasShader({parent:item, id:'canvas-wavify-' + Date.now(), hd:true, texture:canvas.toDataURL('png')});
			});
			/*
			var positionStyle = getComputedStyle(item)["position"];
			if (positionStyle === "static" || positionStyle === "")
				item.style.position = "relative";
			html2canvas(item).then(function(canvas) {
				item.style.border = 'none';
				new CanvasShader({parent:item, id:'canvas-wavify-' + Date.now(), hd:true, texture:canvas.toDataURL('png')});
			});
			*/
		}
        if (typeof(target) === "string")
            [].forEach.call(document.getElementsByClassName(target), (item) => {action(item);});
        else
            action(target);
	}
}

export default Shapeshift;