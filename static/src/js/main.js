import Shapeshift from './shapeshift';

var item = document.getElementsByClassName('wavify')[0];
var shape = new Shapeshift(item, {
    fragment:"cloud",
//    vertex:"water",
    params:{
        fragment:{speed:0.02, x:10.1, y:0.8, z:0.12},
        vertex:{amplitude:0.05, frequency:1}
    }
});
