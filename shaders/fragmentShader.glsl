precision mediump float;

varying vec3 fragColor;

void main(){
	
	// Задаем цвет вершины
	gl_FragColor = vec4(fragColor, 1.0);
}