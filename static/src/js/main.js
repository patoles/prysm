import Shapeshift from './shapeshift';

var item = document.getElementsByClassName('wavify')[0];
var shape = new Shapeshift(item, "shockwave", null, {speed:0.02, x:10.1, y:0.8, z:0.1});
setInterval(() => {
    shape.fragment.setWavePos(shape.canvasInfo.center);
}, 2000);