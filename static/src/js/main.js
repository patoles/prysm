import Prysm from './prysm';

var target = document.getElementById('test');
var shape = new Prysm(target, {
    fragment:"water",
    vertex:"water",
    params:{
        fragment:{speed:0.02, amplitude:10.1, refraction:0.8, width:0.12},
        vertex:{amplitude:0.05, frequency:1}
    }
});
