attribute vec2 vertexPosition;

varying vec3 fragColor;

void main(){

	// Передаем во фразментный шейдер varying переменную 
	fragColor = vec3(vertexPosition, 0.5);

	// Задаем созицию вершины
	gl_Position = vec4(vertexPosition, 0, 1);

	// Задаем размер точки
	gl_PointSize = 10.0;
}
