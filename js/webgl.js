// Функция инициализации скрипта
var InitWebGL = function() {
	// Объявляем переменные для шейдеров
	var VSText, FSText;

	// Загружаем вершинный шейдер
	loadTextResource('/shaders/vertexShader.glsl')
	.then(function(result) {
		// Помещаем загруженный шейдер в соответствующую переменную
		VSText = result;

		// Загружаем фрагментный шейдер
		return loadTextResource('/shaders/fragmentShader.glsl');
	})
	.then(function(result){
		// Помещаем загруженный шейдер в соответствующую переменную
		FSText = result;

		// Запускаем webGL
		return StartWebGL(VSText, FSText);
	})
	.catch(function(error) {
		// Если что то пошло не так, возвращаем информацию об ошибке
		alert('Error with loading resources. See console.');
		console.error(error);
	})
}

// Объявление глобальных переменных
var gl, program, vertexArray = [];

// Запуск webGL
var StartWebGL = function (vertexShaderText, fragmentShaderText) {
	// Получение канвы со страницы
	var canvas = document.getElementById('example-canvas');
	// Получение контекста WebGL
	gl = canvas.getContext('webgl');

	// Проверка доступен ли webGL для текущего бразуера
	if (!gl) {
		// Если webGL не доступен выдаем оповещение и завершаем функцию
		alert('Your browser does not support WebGL');
		return;
	}

	// Задание размеров холста
	canvas.height = gl.canvas.clientHeight;
	canvas.width = gl.canvas.clientWidth;


	// Создание обработчика события на клик
	canvas.addEventListener('mousedown', function(event){
		onmousedown(event, canvas);
	})

	// Задаем размер вьюпорта (области отрисовки)
	gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

	// Создание шейдеров
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);

	// Создание программы
	program = createProgram(gl, vertexShader, fragmentShader);
	
	// Рисование
	draw();

};

// Рисование
var draw = function(){

	// Создаем буфер данных
	var vertexBuffer = gl.createBuffer();

	// Задаем точку связывания (наш буфер будет содержать вершинные атрибуты)
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Помещаем в буфер массив данных
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

	// Создаем атрибут вершинного шейдера
	var positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');

	// Определяем кол-во вершин, которые необходимо отрисовать
	var vertices_number = vertexArray.length / 2;

	// Задаем параметры для атрибута
	gl.vertexAttribPointer(
		positionAttribLocation, // ссылка на атрибут
		2, // кол-во элементов на 1 итерацию
		gl.FLOAT, // тип данных
		gl.FALSE, // нормализация
		2 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
		0 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
	);

	// Активируем атрибут
	gl.enableVertexAttribArray(positionAttribLocation);

	// Задаем цвет заднего фона
	gl.clearColor(0.75, 0.9, 1.0, 1.0);
	// Очищаем буферы цвета и глубины
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Сообщаем браузеру что необходимо проверять глубину каждого пикселя
	gl.enable(gl.DEPTH_TEST);
	// Включаем программу
	gl.useProgram(program);
	// Рисуем треугольинки
	gl.drawArrays(gl.TRIANGLES, 0, vertices_number);
	// Рисуем точки
	gl.drawArrays(gl.POINTS, 0, vertices_number);
	// Рисуем непрерывную линию
	gl.drawArrays(gl.LINE_STRIP, 0, vertices_number);
}


// Функция клика
function onmousedown(event, canvas){

	// Определяем координаты клика (на странице) по обеим осям
	var x = event.clientX;
	var y = event.clientY;

	// Определяем центр холста по обеим осям
	var middle_X = gl.canvas.width / 2;
	var middle_Y = gl.canvas.height / 2;

	// Получаем информацию размере холста и его положении на странице
	var rect = canvas.getBoundingClientRect();

	// Переводим координаты клика в понятный для webGL вид (от -1 до 1)
	x = ((x - rect.left) - middle_X) / middle_X;
	y = (middle_Y - (y - rect.top)) / middle_Y;

	// Помещаем координаты в конец массива вершин
	vertexArray.push(x);
	vertexArray.push(y);

	// Рисование
	draw();
}


document.addEventListener('DOMContentLoaded', function() {
	// Запускаем скрипт при полной загрузке страницы
	InitWebGL();
});