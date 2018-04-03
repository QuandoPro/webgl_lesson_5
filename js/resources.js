// Загрузка ресурсов

var loadTextResource = function(url) {
	// Создаем промис
	return new Promise(function(resolve, reject){

		// Создаем запрос к серверу
		var request = new XMLHttpRequest();

		// Инициализируем запрос
		request.open('GET', url, true);

		// Обработчик события при выполнении запроса
		request.onload = function () {
			if (request.status >= 200 && request.status < 300) {
				// Если запрос выполнился без ошибок
				resolve(request.responseText);
			}else{
				// Ошибка
				reject('Error: HTTP status - ' + request.status + ' on resource ' + url);
			}
		}
		// Отправляем запрос (обязательно после создания всех обработчиков)
		request.send();
		
	});
}


// Функция создания шейдера

var createShader = function(gl, type, source){

	// Создаем новый шейдер
	var shader = gl.createShader(type);

	// Прикрепляем загруженный текст шейдера
	gl.shaderSource(shader, source);

	// Компилируем шейдер
	gl.compileShader(shader);

	// Проверяем на то что компиляция прошла успешно
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

		// Если произошла ошибка, возвращаем информацию о ней и выходим из функции
		alert('Error compiling shader!');
		console.error('Shader error info: ', gl.getShaderInfoLog(shader));
		return false;
	}

	// Возвращаем шейдер
	return shader;

}




// Функция создания программы

var createProgram = function(gl, vertexShader, fragmentShader){

	// Создаем программу
	var program = gl.createProgram();

	// Прикрепляем оба шейдера к программе
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	// Линкуем программу и проверяем ее на валидность
	gl.linkProgram(program);
	gl.validateProgram(program);


	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		// Если программа невалидна, возвращаем информацию об ошибке и выходим из функции
		console.error('Error validating program ', gl.getProgramInfoLog(program));
		return false;
	}

	// Возвращаем программу
	return program;
}