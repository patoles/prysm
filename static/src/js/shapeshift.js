import html2canvas from 'html2canvas';
import CanvasShader from './canvas-shader.js';

class Shapeshift{
	constructor(targetClass){
        var action = (item) => {
			var positionStyle = getComputedStyle(item)["position"];
			if (positionStyle === "static" || positionStyle === "")
				item.style.position = "relative";
			html2canvas(item).then(function(canvas) {
				item.style.border = 'none';
				new CanvasShader({parent:item, id:'canvas-wavify-' + Date.now(), hd:true, texture:canvas.toDataURL('png')});
			});
        }
        if (typeof(targetClass) === "string")
            [].forEach.call(document.getElementsByClassName(targetClass), (item) => {action(item);});
        else
            action(targetClass);
	}
}

export default Shapeshift;