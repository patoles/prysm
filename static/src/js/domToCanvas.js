class DomToCanvas{
    getCanvas(target){
        return new Promise((resolve, reject) => {
            var wrap = document.createElement('div');
            var targetCopy = target.cloneNode(true);
            target.appendChild(targetCopy);
            var computedStyle = getComputedStyle(target);
            var backgroundImage = computedStyle["background-image"];
            targetCopy.style = computedStyle["cssText"];
            targetCopy.style.margin = '0';
            targetCopy.style.padding = '0';
            targetCopy.style.WebkitTextFillColor = '';

/*
            var getChild = (main) => {
                [].forEach.call(main, (child, key) => {
//                    childCopy.style = getComputedStyle(child)["cssText"];
                    if (child.hasChildNodes())
                        getChild(child.children);
                });
            }
            getChild(target.children, targetCopy);
*/

            var getSVG = (bgImg) => {
                var width = computedStyle["width"].replace('px', '');
                var height = computedStyle["height"].replace('px', '');
                if (bgImg)
                {
                    var bgURI = this.getBase64Canvas(bgImg, width, height).toDataURL('png');
                    targetCopy.style.backgroundImage = 'url("' + bgURI + '")';
                }
                wrap.appendChild(targetCopy);
                this.addDOMElement(resolve, wrap.innerHTML, width, height);
            }
            if (backgroundImage && backgroundImage !== "" && backgroundImage !== 'none')
            {
                backgroundImage = backgroundImage.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
                var bgImg = new Image();
                bgImg.onload = () => {getSVG(bgImg);};
                this.setCrossOrigin(bgImg, backgroundImage);
//                bgImg.src = backgroundImage;
                var loadBgInterval = setInterval(() => {
                    if (bgImg.complete || bgImg.width+bgImg.height > 0)
                    {
                        bgImg.onload();
                        clearInterval(loadBgInterval);
                    }
                }, 50);
            }
            else
                getSVG();
        })
    }
    getBase64Canvas(img, width, height) {
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext("2d");
        var devicePixelRatio = window.devicePixelRatio || 1;
		var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
		var pixelRatio = devicePixelRatio / backingStoreRatio;
        if (devicePixelRatio !== backingStoreRatio)
		{
			canvas.width = width * pixelRatio;
			canvas.height = height * pixelRatio;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
            ctx.scale(pixelRatio, pixelRatio);
		}
        ctx.drawImage(img, 0, 0, width, height);
		return canvas;
	}
	setCrossOrigin(img, imageSource){
		if (imageSource.substring(0,4).toLowerCase() === 'http')
			img.crossOrigin = '';
		else
			img.crossOrigin = null;
	}
	addDOMElement(resolve, html, width, height){
		var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" xmlns:xlink= "http://www.w3.org/1999/xlink">' +
		            '<foreignObject width="' + width + '" height="' + height + '">' +
		            '<div xmlns="http://www.w3.org/1999/xhtml" style="display:block;width:100%;height:100%;position:relative">' + html +
		            '</div>' +
		            '</foreignObject>' +
                    '</svg>';
        var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
        var img = new Image();
        img.addEventListener("load", (e) => {
            var canvas = this.getBase64Canvas(img, width, height);
            resolve(canvas);
        });
        img.src = url;
	}
}

const _DomToCanvas = new DomToCanvas();

export default _DomToCanvas;