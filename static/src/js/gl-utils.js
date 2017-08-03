
Matrix.Translation = function (v)
{
	if (v.elements.length == 2){
		var r = Matrix.I(3);
		r.elements[2][0] = v.elements[0];
		r.elements[2][1] = v.elements[1];
		return r;
	}
	if (v.elements.length == 3){
		var r = Matrix.I(4);
		r.elements[0][3] = v.elements[0];
		r.elements[1][3] = v.elements[1];
		r.elements[2][3] = v.elements[2];
		return r;
	}
	throw "Invalid length for Translation";
}

Matrix.prototype.flatten = function ()
{
	var result = [];
	if (this.elements.length == 0)
		return [];

	for (var j = 0; j < this.elements[0].length; j++)
		for (var i = 0; i < this.elements.length; i++)
			result.push(this.elements[i][j]);
	return result;
}

Matrix.prototype.ensure4x4 = function()
{
	if (this.elements.length == 4 && this.elements[0].length == 4)
		return this;

	if (this.elements.length > 4 || this.elements[0].length > 4)
		return null;
	for (var i = 0; i < this.elements.length; i++) {
		for (var j = this.elements[i].length; j < 4; j++) {
			if (i == j)
				this.elements[i].push(1);
			else
				this.elements[i].push(0);
		}
	}
	for (var i = this.elements.length; i < 4; i++) {
		if (i == 0)
			this.elements.push([1, 0, 0, 0]);
		else if (i == 1)
			this.elements.push([0, 1, 0, 0]);
		else if (i == 2)
			this.elements.push([0, 0, 1, 0]);
		else if (i == 3)
			this.elements.push([0, 0, 0, 1]);
	}
	return this;
};

Matrix.prototype.make3x3 = function()
{
	if (this.elements.length != 4 || this.elements[0].length != 4)
		return null;

	return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
	[this.elements[1][0], this.elements[1][1], this.elements[1][2]],
	[this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

Vector.prototype.flatten = function ()
{
	return this.elements;
};

class GlUtils{
	constructor(){
		this.mvMatrixStack = [];
		this.mvMatrix = [];
	}
	webgl_support(canvas){
		try{
			return !! window.WebGLRenderingContext && ( 
				canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
		}catch( e ) { return false; } 
	}
	mht(m){
		var s = "";
		if (m.length == 16) {
			for (var i = 0; i < 4; i++) {
				s += "<span style='font-family: monospace'>[" + m[i*4+0].toFixed(4) + "," + m[i*4+1].toFixed(4) + "," + m[i*4+2].toFixed(4) + "," + m[i*4+3].toFixed(4) + "]</span><br>";
			}
		} else if (m.length == 9) {
			for (var i = 0; i < 3; i++) {
				s += "<span style='font-family: monospace'>[" + m[i*3+0].toFixed(4) + "," + m[i*3+1].toFixed(4) + "," + m[i*3+2].toFixed(4) + "]</font><br>";
			}
		} else {
			return m.toString();
		}
		return s;
	}
	makeLookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz){
		var eye = $V([ex, ey, ez]);
		var center = $V([cx, cy, cz]);
		var up = $V([ux, uy, uz]);

		var mag;

		var z = eye.subtract(center).toUnitVector();
		var x = up.cross(z).toUnitVector();
		var y = z.cross(x).toUnitVector();

		var m = $M([[x.e(1), x.e(2), x.e(3), 0],
		        [y.e(1), y.e(2), y.e(3), 0],
		        [z.e(1), z.e(2), z.e(3), 0],
		        [0, 0, 0, 1]]);

		var t = $M([[1, 0, 0, -ex],
		        [0, 1, 0, -ey],
		        [0, 0, 1, -ez],
		        [0, 0, 0, 1]]);
		return m.x(t);
	}
	makePerspective(fovy, aspect, znear, zfar){
		var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
		var ymin = -ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
	}
	makeFrustum(left, right, bottom, top, znear, zfar){
		var X = 2*znear/(right-left);
		var Y = 2*znear/(top-bottom);
		var A = (right+left)/(right-left);
		var B = (top+bottom)/(top-bottom);
		var C = -(zfar+znear)/(zfar-znear);
		var D = -2*zfar*znear/(zfar-znear);

		return $M([[X, 0, A, 0],
		[0, Y, B, 0],
		[0, 0, C, D],
		[0, 0, -1, 0]]);
	}
	makeOrtho(left, right, bottom, top, znear, zfar){
		var tx = - (right + left) / (right - left);
		var ty = - (top + bottom) / (top - bottom);
		var tz = - (zfar + znear) / (zfar - znear);

		return $M([[2 / (right - left), 0, 0, tx],
		[0, 2 / (top - bottom), 0, ty],
		[0, 0, -2 / (zfar - znear), tz],
		[0, 0, 0, 1]]);
	}
	loadIdentity(){
		this.mvMatrix = Matrix.I(4);
	}
	multMatrix(m){
		this.mvMatrix = this.mvMatrix.x(m);
	}
	scale(v) {
		var result = this.mvMatrix;
		console.log(result);
		var m = result.m;

		result[0][0] = v[0];
		result[0][1] = 0;
		result[0][2] = 0;
		result[0][3] = 0;

		result[1][0] = 0;
		result[1][1] = v[1];
		result[1][2] = 0;
		result[1][3] = 0;

		result[2][0] = 0;
		result[2][1] = 0;
		result[2][2] = v[2];
		result[2][3] = 0;

		result[3][0] = 0;
		result[3][1] = 0;
		result[3][2] = 0;
		result[3][3] = v[3];
		this.mvMatrix = result;
	}
	mvTranslate(v){
		this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
	}
	setMatrixUniforms(gl, shaderProgram, perspectiveMatrix){
		var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
		var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));
		var normalMatrix = this.mvMatrix.inverse();
		normalMatrix = normalMatrix.transpose();
		var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
		gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
	}
	mvPushMatrix(m){
		if (m) {
			this.mvMatrixStack.push(m.dup());
			mvMatrix = m.dup();
		} else {
			this.mvMatrixStack.push(this.mvMatrix.dup());
		}
	}
	mvPopMatrix(){
		if (!this.mvMatrixStack.length) {
			throw("Can't pop from an empty matrix stack.");
		}
		this.mvMatrix = this.mvMatrixStack.pop();
		return this.mvMatrix;
	}
	mvRotate(angle, v){
		var inRadians = angle * Math.PI / 180.0;
		var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
		this.multMatrix(m);
	}
	mvRotateMultiple(angleA, vA, angleB, vB){
		var inRadians = angleA * Math.PI / 180.0;
		var mA = Matrix.Rotation(inRadians, $V([vA[0], vA[1], vA[2]])).ensure4x4();
		inRadians = angleB * Math.PI / 180.0;
		var mB = Matrix.Rotation(inRadians, $V([vB[0], vB[1], vB[2]])).ensure4x4();
		var m = mA.x(mB);
		this.multMatrix(m);
	}
	mvScale(size){
		var m = Matrix.I(4);
		m.elements = [[size[0], 0, 0, 0],
				[0, size[1], 0, 0],
				[0, 0, size[2], 0],
				[0, 0, 0, 1]];
		this.multMatrix(m);
	}
}

export default GlUtils;