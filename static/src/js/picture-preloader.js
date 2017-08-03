class PicturePreloader{
	init(pictureList, loader, cb){
		this.preloaderCount = 0;
		this.preloaderElemCount = 0;
		this.cb = cb;
		this.loader = loader;
		if (pictureList.length > 0)
			this.loadImages(pictureList);
		else
			this.cb();
	}
	testImageCache(picture, url){
		picture.src = url;
		return picture.complete || picture.width+picture.height > 0;
	}
	loadImages(pictureList){
		this.preloaderCount = 0;
		this.preloaderElemCount = 0;

		pictureList.forEach((element, index) => {
			var loadingImage = new Image();
			this.preloaderCount++;
			if (this.testImageCache(loadingImage, element))
				this.loadAction(pictureList.length);
			else
			{
				loadingImage.onload = () => {
					this.loadAction(pictureList.length);
				};
			}
		});
	}
	loadAction(pictureLength){
		this.preloaderElemCount++;
		var percent = Math.floor(this.preloaderElemCount / this.preloaderCount * 100);
		percent = percent > 100 ? 100 : percent;
		this.loader.setPercent(percent);
		if (this.preloaderElemCount >= this.preloaderCount && this.preloaderCount >= pictureLength)
			this.cb();
	}
}

var _PicturePreloader = new PicturePreloader();

export default _PicturePreloader;