class GlUtils{
	webgl_support(canvas){
		try{
			return !! window.WebGLRenderingContext && ( 
				canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
		}catch( e ) { return false; } 
	}
}

export default GlUtils;