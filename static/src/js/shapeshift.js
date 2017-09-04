import html2canvas from 'html2canvas';
import ShaderHandler from './shader-handler';

// Shapeshift class transforms a DOM Element 'target' to an Image which will then be used as a texture.
// It also sets the fragment and vertex shaders and their parameters.
class Shapeshift{
	constructor(target, options){
		options = options || {};
		this.fragment = null;
		this.vertex = null;
		this.canvasInfo = null
        var action = (item) => {
			var positionStyle = getComputedStyle(item)["position"];
			if (positionStyle === "static" || positionStyle === "")
				item.style.position = "relative";
			html2canvas(item, {
				useCORS:true,
				onrendered: (canvas) => {
					item.style.border = 'none';
					var shader = new ShaderHandler(item, canvas.toDataURL('png'), options.fragment || 'default', options.vertex || 'default', options.params);
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