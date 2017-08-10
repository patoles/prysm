import html2canvas from 'html2canvas';
//import DomToCanvas from './domToCanvas';
import CanvasShader from './canvas-shader';

class Shapeshift{
	constructor(target, fragmentShader, vertexShader, params){
		this.fragment = null;
		this.vertex = null;
		this.canvasInfo = null
        var action = (item) => {
			var positionStyle = getComputedStyle(item)["position"];
			if (positionStyle === "static" || positionStyle === "")
				item.style.position = "relative";
			html2canvas(item, {
				onrendered: (canvas) => {
					item.style.border = 'none';
					var shader = new CanvasShader(item, canvas.toDataURL('png'), fragmentShader || 'shockwave', vertexShader || 'default', params);
					this.fragment = shader.fragment;
					this.vertex = shader.vertex;
					this.canvasInfo = shader.canvasInfo;
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