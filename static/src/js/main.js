import Shapeshift from './shapeshift';

window.addEventListener("load", () => {
	var item = document.getElementsByClassName('wavify')[0];
	new Shapeshift(item);
//	new Shapeshift('wavify');
});
