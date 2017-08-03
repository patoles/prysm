import html2canvas from 'html2canvas';
import Canvas3D from './canvas3d.js';

class Shapeshift{
	constructor(targetClass){
        var action = (item) => {
			var positionStyle = getComputedStyle(item)["position"];
			if (positionStyle === "static" || positionStyle === "")
				item.style.position = "relative";
			html2canvas(item).then(function(canvas) {
				item.style.border = 'none';
				new Canvas3D({parent:item, id:'canvas-wavify-' + Date.now(), hd:true, texture:canvas.toDataURL('png')});
			});
        }
        if (typeof(targetClass) === "string")
        {
            var itemList = document.getElementsByClassName(targetClass);
            [].forEach.call(itemList, (key) => {action(item);});
        }
        else
            action(targetClass);
	}
}

export default Shapeshift;