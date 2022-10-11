let val_tag_array = ['input', 'textarea'];
let HOLDER = [];
// Получить по ID
function jsid(elId) {
	return document.getElementById(elId);
}
function set_value_or_innerhtml(el, val) {
	if (val_tag_array.includes(el.tagName.toLowerCase())){
		el.value = val;
	} else {
		el.innerHTML = val;
	}
}
function set_content(msg, target_id) {
	let real_id = target_id;
	let el;
	let real_value;
	if (jsid(real_id) != undefined){
		el = jsid(real_id);
		if (typeof msg == 'object'){
			if (val_tag_array.includes(el.tagName.toLowerCase())){
				el.value = json_formatter( JSON.stringify(msg), 'file' );
			} else {
				el.innerHTML = json_formatter( JSON.stringify(msg), 'html' );
			}
		} else {
			set_value_or_innerhtml(el, msg);
		}
	} else {
		HOLDER[target_id] = msg;
	}
}

/* 
 * Показать данные из массива HOLDER внутри модального окна (id ввода модального окна, id внешней (отображаемой) части модального окна) при помощи функции func_each, которая выполняется для каждого элемента массива HOLDER[target_id]
 */
function from_holder_to_modal(target_id, func=undefined, modal_input_id='modal_input', modal_screen_id='modal_screen') {
	let modal_input;
	let modal_screen;
	if (HOLDER != undefined && HOLDER[target_id] != undefined){
		modal_input = jsid(modal_input_id);
		modal_screen = jsid(modal_screen_id);
		if (modal_input == undefined){
			alert('ID модального окна (' + modal_input_id + ') не определено!');
			return false;
		}
		if (modal_screen == undefined){
			alert('ID модального окна (' + modal_screen_id + ') не определено!');
			return false;
		}
		if (func == undefined){
			let explosion = '';
			if (Array.isArray(HOLDER[target_id])){
				for (let each_el in HOLDER[target_id]) {
					explosion += HOLDER[target_id][each_el] + "\n\n";
				}
				set_value_or_innerhtml(modal_input, explosion);
			} else {
				set_value_or_innerhtml(modal_input, HOLDER[target_id]);
			}
		} else {
			set_value_or_innerhtml(modal_input, func( HOLDER[target_id]) );
		}
		id_toggle(modal_screen_id);
		return true;
	}
	return false;
}
function set_error(error_in) {
	set_content(error_in, 'errors_log');
}
function insertAfter(element, newElement) {
	element.parentNode.insertBefore(newElement, element.nextSibling);
}
function insertBefore(element, newElement) {
	element.parentNode.insertBefore(newElement, element);
}
function jscl(classNames) {
	return document.getElementsByClassName(classNames);
}
function rmClass(el, ClassName) {
	let regExp = new RegExp('/\b' + ClassName +'\b/g');
	if (el != undefined && el.className != undefined){	
		el.className.replace(regExp, "");
	}
	return el;
}
function classList_toggle(obj, classList) {
	let className = '';
	let res_status = false;
	for (let class_id in classList) {
		className = classList[class_id];
		if (res_status){
			obj.classList.add(className);
			return;
		}
		if (obj.classList.contains(className)) {
			obj.classList.remove(className);
			res_status = true;
		}
	}
	className = classList[0];
	obj.classList.add(className);
}
function show_toggle(el_className, classes_array=undefined ) {
	let obj = document.querySelector('.' + el_className)
	let class_hide1 = 'hide1';
	let class_hide2 = 'hide2';
	let class_show = 'show1';
	if (classes_array != undefined){
		class_hide1 = classes_array[0];
		class_hide2 = classes_array[1];
		class_show = classes_array[2];
	}
	if (obj.classList.contains(class_hide1)){
		obj.classList.remove(class_hide1);
		obj.classList.add(class_hide2);
		setTimeout(function () {
			obj.classList.remove(class_hide2);
			obj.classList.add(class_show);
		}, 600);
	} else if(obj.classList.contains(class_show)){
		obj.classList.remove(class_show);
		obj.classList.add(class_hide2);
		setTimeout(function () {
			obj.classList.remove(class_hide2);
			obj.classList.add(class_hide1);
		}, 600);
	} else {
		obj.classList.add(class_hide1);
	}
}
function move_by_qs(qSelector, style_name_in_horizontal, style_name_in_vertical, event_in) {
	let target_el = document.querySelector(qSelector);
	onmousedownX = event_in.pageX;
	onmousedownY = event_in.pageY;
	let currentX_value = 0;
	let currentY_value = 0;
	let newX_value = 0;
	let newY_value = 0;
	event_in.preventDefault();
	document.onmousemove = function (e) {
		currentX_value = 0;
		currentY_value = 0;
		newX_value = 0;
		newY_value = 0;

		mouseDiffX = -(onmousedownX - e.pageX);
		mouseDiffY = -(onmousedownY - e.pageY);
		if (style_name_in_horizontal.indexOf('margin') >= 0){	
			mouseDiffX = -(onmousedownX - e.pageX);
			mouseDiffY = -(onmousedownY - e.pageY);
		} else if (style_name_in_horizontal.indexOf('padding') >= 0) {
			mouseDiffX = Math.abs(onmousedownX - e.pageX);
			mouseDiffY = Math.abs(onmousedownY - e.pageY);
		}
		if (style_name_in_horizontal == 'margin'){	
			target_el.style.margin = mouseDiffY + 'px ' + mouseDiffX + 'px';
		} else if (style_name_in_horizontal == 'margin-left'){	
			currentX_value = to_int(target_el.style.marginLeft);
			newX_value = currentX_value + mouseDiffX;
			target_el.style.marginLeft = newX_value + 'px';
		} else if (style_name_in_horizontal == 'margin-right') {
			mouseDiffX = -1 * mouseDiffX;
			currentX_value = to_int(target_el.style.marginRight);
			newX_value = currentX_value + mouseDiffX;
			target_el.style.marginRight = newX_value + 'px';
		} else if (style_name_in_horizontal == 'padding'){	
			target_el.style.padding = mouseDiffY + 'px ' + mouseDiffX + 'px';
		} else if (style_name_in_horizontal == 'padding-left'){	
			currentX_value = to_int(target_el.style.paddingLeft);
			newX_value = currentX_value + mouseDiffX;
			target_el.style.paddingLeft = newX_value + 'px';
		} else if (style_name_in_horizontal == 'padding-right') {
			mouseDiffX = -1 * mouseDiffX;
			currentX_value = to_int(target_el.style.paddingRight);
			newX_value = currentX_value + mouseDiffX;
			target_el.style.paddingRight = newX_value + 'px';
		} else if (style_name_in_horizontal == 'left'){	
			currentX_value = to_int(target_el.style.left);
			newX_value = currentX_value + mouseDiffX;
			target_el.style.left = newX_value + 'px';
		} else if (style_name_in_horizontal == 'right') {
			mouseDiffX = -1 * mouseDiffX;
			currentX_value = to_int(target_el.style.right);
			newX_value = currentX_value + mouseDiffX;
			target_el.style.right = newX_value + 'px';
		}

		if (style_name_in_vertical.indexOf('margin') >= 0){	
			mouseDiffX = -(onmousedownX - e.pageX);
			mouseDiffY = -(onmousedownY - e.pageY);
		} else if (style_name_in_vertical.indexOf('padding') >= 0) {
			mouseDiffX = Math.abs(onmousedownX - e.pageX);
			mouseDiffY = Math.abs(onmousedownY - e.pageY);
		}
		if (style_name_in_vertical == 'margin'){	
			target_el.style.margin = mouseDiffY + 'px ' + mouseDiffX + 'px';
		} else if (style_name_in_vertical == 'margin-top') {
			currentY_value = to_int(target_el.style.marginTop);
			newY_value = currentY_value + mouseDiffY;
			target_el.style.marginTop = newY_value + 'px';
		} else if (style_name_in_vertical == 'margin-bottom') {
			currentY_value = to_int(target_el.style.marginBottom);
			newY_value = currentY_value + mouseDiffY;
			target_el.style.marginBottom = newY_value + 'px';
		} else if (style_name_in_vertical == 'padding'){	
			target_el.style.padding = mouseDiffY + 'px ' + mouseDiffX + 'px';
		} else if (style_name_in_vertical == 'padding-top') {
			currentY_value = to_int(target_el.style.paddingTop);
			newY_value = currentY_value + mouseDiffY;
			target_el.style.paddingTop = newY_value + 'px';
		} else if (style_name_in_vertical == 'padding-bottom') {
			currentY_value = to_int(target_el.style.marginBottom);
			newY_value = currentY_value + mouseDiffY;
			target_el.style.paddingBottom = newY_value + 'px';
		} else if (style_name_in_vertical == 'top') {
			currentY_value = to_int(target_el.style.top);
			newY_value = currentY_value + mouseDiffY;
			target_el.style.top = newY_value + 'px';
		} else if (style_name_in_vertical == 'bottom') {
			currentY_value = to_int(target_el.style.bottom);
			newY_value = currentY_value + mouseDiffY;
			target_el.style.bottom = newY_value + 'px';
		}
		onmousedownX = e.pageX;
		onmousedownY = e.pageY;

		document.getElementById('diffX').innerHTML = mouseDiffX;
		document.getElementById('diffY').innerHTML = mouseDiffY;
	}
	document.onmouseup = function (e) {
		document.onmousemove = null;
		document.onmouseup = null; 
		document.getElementById('diffX').innerHTML = '';
		document.getElementById('diffY').innerHTML = '';
	}
		
}
function equal_height(selector) {
	let selector_elements = document.querySelectorAll(".info .text");
	if (selector_elements == undefined){
		return false;
	}
	let max_height = 0;
	let current_height = 0;
	let element_computed_style;

	selector_elements.forEach(function(selector_element){
		selector_element.style.minHeight = 0 + 'px';	
	});

	selector_elements.forEach(function(selector_element){
		element_computed_style = window.getComputedStyle( selector_element, null ); 		
		current_height = parseInt(element_computed_style.getPropertyValue("height"));
		if (current_height > max_height){
			max_height = current_height;
		}
	});

	selector_elements.forEach(function(selector_element){
		selector_element.style.minHeight = max_height + 'px';	
	});
}
function i(some_var) {
	return parseInt(some_var);
}
function to_int(current_value) {
	let val = parseInt(current_value);
	if (!Number.isInteger(val)){
		val = 0;
	}
	return val;
}
function c(some_var) {
	return console.log(some_var);
}
function ap(el_child, el) {
	return el.appendChild(el_child);
}
// set attribute
function said(el_id, attr_name, new_value) {
	try {
		jsid(el_id).setAttribute(attr_name, new_value);
	} catch (e){
		c(el_id);
		c(e);
	}
}
// set attribute
function sa(el, attr_name, new_value) {
	try {
		el.setAttribute(attr_name, new_value);
	} catch (e){
		c(el);
		c(e);
	}
}
// set attribute ns
function sans(el, attr_name, new_value) {
	try {
		el.setAttributeNS(null, attr_name, new_value);
	} catch (e){
		c(el);
		c(e);
	}
}
// get attribute
function ga(el_id, attr_name) {
	jsid(el_id).getAttribute(attr_name, new_value);
}
function qs(qSelector) {
	return document.querySelector(qSelector);
}
function qsa(qSelector) {
	return document.querySelectorAll(qSelector);
}
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(let i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
Object.size = function(obj) {
	  var size = 0,
		    key;
	  for (key in obj) {
		  if (obj.hasOwnProperty(key)) size++;
	  }
	  return size;
};
function sizeof(obj_or_array) {
	if (typeof obj_or_array == 'array'){
		return obj_or_array.length
	} else if (typeof obj_or_array == 'object') {
		return Object.size(obj_or_array);
	}
}
Object.push = function(obj, new_element) {
	let size = 0;
	let key = 0;
	if (typeof obj != 'object' && typeof obj != 'array'){
		obj = {};
	}
	while (obj[key] != undefined) {
		key++;
	}
	obj[key] = new_element;
	return ++key;
};
function object_names_diff_recursive(object1, object2, current_name='') {
	let found_array = [];
	for (let object1_id1 in object1){	
		for (let object2_id1 in object2){	
			if (object1_id1 == object2_id1){
				if (typeof object1_id1 == 'object' && typeof object2_id1 == 'object'){
					current_name += '[' + object1_id1 + ']';
					object_names_diff_recursive(object1[object1_id1], object2[object2_id1], current_name);
				} else {
					found_array.push();
				}
			}
		}
	}
	return found_array;
}
function is(input_var) {
	if (input_var != undefined && input_var != null && input_var != false){
		return true;
	}
	return false;
}
function isEmpty(input_var) {
	if (typeof(input_var) == 'string'){	
		if (input_var == undefined || input_var == null || input_var == ''){	
			return true;
		} else {
			return false;
		}
	}
}
function cleanComments(parentN) {
	for (let i=0;i<startNode.childNodes.length;i++) {
		if (parentN.childNodes[i].nodeType == 8) {
			parentN.childNodes[i].remove();
		}
	}
}
function time() {
	let currentDate = new Date();
	return currentDate.getHours() + ':' + currentDate.getMinutes() + ':' +currentDate.getSeconds() + '.' + currentDate.getMilliseconds() + ',' +   currentDate.getDate() + ',' + currentDate.getMonth() + ',' + currentDate.getFullYear();
}
// Показать/скрыть элемент по ID
function id_toggle(el_id, mode='block') {
	let el = jsid(el_id);
	let element_computed_style = window.getComputedStyle( el, null ); 		
	let display = element_computed_style.getPropertyValue("display");
	if (display == 'none' || display == ''){	
		el.style.display = mode;
		return true;
	} else {
		el.style.display = 'none';
		return false;
	}
}
function class_toggle(obj, className) {
	if (obj.classList.contains(className)) {
		    obj.classList.remove(className);
	} else {
		    obj.classList.add(className);
	}
}

// Объекты
// Копировать объект
function copyObject(obj) {
	let a = JSON.stringify(obj);
	return JSON.parse(a);
}

// Трасформировать JSON в читаемый вид
// json_string = json_formatter(json_string);


	var tab_iterator = 0;
	var tab_str = "\t";
	var tabs_str = "";
	function json_formatter_replacer(str, offset, input) {
		if (str.match(/\{\}/)){	
			return str;
		} else if (str.match(/\{\,/)){	
			tab_iterator++;
		} else if (str.match(/{/)){	
			tab_iterator++;
		} else if (str.match(/}/)) {
			tab_iterator--;
		}
		tabs_str = "";
		for (var i=0; i<tab_iterator; i++){
			tabs_str += tab_str;
		}
		if (str.match(/}/)) {
			return "\n" + tabs_str + str + "\n" + tabs_str;
		}
		return str + "\n" + tabs_str;
	}
	let tab_str_html = "&nbsp;&nbsp;&nbsp;&nbsp;";
	function json_html_formatter_replacer(str, offset, input) {
		if (str.match(/\{\}/)){	
			return str;
		} else if (str.match(/\{\,/)){	
			tab_iterator++;
		} else if (str.match(/{/)){	
			tab_iterator++;
		} else if (str.match(/}/)) {
			tab_iterator--;
		}
		tabs_str = "";
		for (var i=0; i<tab_iterator; i++){
			tabs_str += tab_str_html;
		}
		if (str.match(/}/)) {
			return "<br/>\n" + tabs_str + str + "<br/>\n" + tabs_str;
		}
		return str + "<br/>\n" + tabs_str;
	}
function json_formatter(json_txt, mode='file') {
	tab_iterator = 0;
	tab_str = "\t";
	tabs_str = "";
	if (mode=='file'){
		json_txt = json_txt.replace(/\{\}|\}\,|[\{\}\,]/g, json_formatter_replacer);
	} else if (mode=='html'){
		json_txt = json_txt.replace(/\{\}|\}\,|[\{\}\,]/g, json_html_formatter_replacer);
	}
	//input_text = input_text.replace(/\"([\d])*"\s*:/g, "$1:");
	return json_txt;
}

	var portable_tags = ['div', 'label', 'form', 'header', 'article', 'footer', 'section', 'nav', 'a'];
	var lined_portable_tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul','li', 'svg', 'path'];
	var html_formatter_iterator = 0;
	function html_formatter_replacer(str, offset, input) {
		var re1;
		var re2;
		var tab = '';
		var i=0;
		var k=0;
		for (i=0; i < lined_portable_tags.length; i++) {
			re1 = new RegExp("<" + lined_portable_tags[i] + "[^<>]*>");
			if (str.match(re1)){
				html_formatter_iterator++;
				for (k=1; k<html_formatter_iterator; k++) {
					tab += "\t";	
				}
				return "\n" + tab + str;
			}
			re2 = new RegExp("<\/" + lined_portable_tags[i] + ">");
			if (str.match(re2)){
				html_formatter_iterator--;
				return str;
			}
		}
		for (i=0; i < portable_tags.length; i++) {
			re1 = new RegExp("<" + portable_tags[i] + "[^<>]*>");
			if (str.match(re1)){
				html_formatter_iterator++;
				for (k=1; k<html_formatter_iterator; k++) {
					tab += "\t";	
				}
				return "\n" + tab + str;
			}
			re2 = new RegExp("<\/" + portable_tags[i] + ">");
			if (str.match(re2)){
				for (k=1; k<html_formatter_iterator; k++) {
					tab += "\t";	
				}
				html_formatter_iterator--;
				return "\n" + tab + str;
			}
		}
		return str;
	}

function html_formatter(input_text, html_formatter_iterator=0) {
	if (typeof input_text == 'string'){
		input_text = input_text.replace(/(?:\r\n|\r|\n|\t)/g, "");
		input_text = input_text.replace(/(?:\s{2,})/g, " ");
		input_text = input_text.replace(/current_element/g, "");
		input_text = input_text.replace(/select_this_element/g, "");
		input_text = input_text.replace(/<[^><]*>/g, html_formatter_replacer);
		return input_text;
	} else {
		console.log('Для форматирование передана не строка:');
		console.log(input_text);
		return false;
	}
}
function json_unformatter(json_txt) {
	json_txt = json_txt.replace(/\t/g, '');
	json_txt = json_txt.replace(/\n/g, '');
	json_txt = json_txt.replace(/\r/g, '');
	return json_txt;
}
function eval_vector(var_name, vector) {
	let result = var_name;
	let current_value;
	for (let temp_id in vector){	
		current_value = vector[temp_id];
		result += '[\'' + current_value + '\']';
	}
	return result;
}
function eval_vector_equal(var_name, vector, new_value) {
	let eval_expression = eval_vector(var_name, vector);
	if (isNumeric(new_value)){
		eval_expression += ' = ' +  new_value + ';';
	} else {
		eval_expression += ' = ' + '\'' + new_value + '\';';
	}
	return eval_expression;
}
function vector_to_txt(vector){	
	let result = '';
	let current_value;
	for (let temp_id in vector){	
		current_value = vector[temp_id];
		result += '[\'' + current_value + '\']';
	}
	return result;
}
function vector_to_args(vector){	
	let result = '';
	let current_value;
	let comma = '';
	for (let temp_id in vector){	
		if (typeof vector[temp_id] == 'string'){
			current_value = '\'' + vector[temp_id] + '\'';
		} else if (typeof vector[temp_id] == 'number') {
			current_value = vector[temp_id];
		} else  {
			console.log('Ошибка в векторе ' + vector);
			console.log(vector);
			alert('Ошибка в векторе! ' + vector);
		}
		result += comma + current_value;
		comma = ', ';
	}
	return result;
}
function includes(target_object, needle) {
	let current_value;
	for (let temp_id in target_object){	
		current_value = target_object[temp_id];
		if (current_value == needle){
			return true;
		}
	}
	return false;
}
function args_to_vector_txt(...args){
	let result = '';
	let current_value;
	for (let temp_id in args){	
		current_value = args[temp_id];
		result += '[\'' + current_value + '\']';
	}
	return result;
}
function args_to_vector(...args){
	let result = [];
	let current_value;
	for (let temp_id in args){	
		current_value = args[temp_id];
		result.push(current_value);
	}
	return result;
}
// Рекурсивный анализ объекта
function get_object_recursive(obj) {
	let object_array = [];
	let result_levels_int = [];
	let result_array = {};
	let result_names = [];
	let result_names_array = [];
	let result_names_array_element = [];
	object_array[0] = obj;
	result_names[0] = '';
	result_levels_int[0] = 0;
	result_names_array[0] = [];
	let i = 0;
	let k = 1;
	let j = 0;
	let set_value;
	while (object_array[i] != undefined) {
		for(let object_temp_id in object_array[i]) {
			if (typeof object_array[i][object_temp_id] == 'object' && Object.size(object_array[i][object_temp_id]) != 0){
				object_array[k] = object_array[i][object_temp_id];
				result_names[k] = result_names[i] + '[\'' + object_temp_id + '\']';
				if (result_names_array[k] == undefined){
					result_names_array[k] = [];
				}
				if (result_names_array[i] != undefined){
					result_names_array[k] = result_names_array[i].concat(object_temp_id);
				} else {
					result_names_array[k].push( object_temp_id );
				}
				result_levels_int[k] = result_levels_int[i] + 1;
				k++;
			} else {
				result_names_array_element = result_names_array[i].concat(object_temp_id);
				if (typeof object_array[i][object_temp_id] == 'object' && Object.size(object_array[i][object_temp_id]) == 0){
					set_value = '';
				} else {
					set_value = object_array[i][object_temp_id];
				}
				result_array[j] =  {
					value: set_value, 
					level: result_levels_int[i], 
					field_array: result_names_array_element, 
					field_name: result_names[i] + '[\'' + object_temp_id + '\']' 
				};
				j++;
			}
		}
		i++;
	}
	return result_array;
}
function get_array_value(array_in, ...keys) {
	let current = array_in;
	let key;
	let key_inner;
	if (current == undefined){
		return false;
	}
	for (let temp_key of keys){	
		key = keys[temp_key];
		if (typeof key == 'object'){
			for (let key_temp_key in key){	
				key_inner = key[key_temp_key];
				if (current[key_inner] != undefined){
					current = current[key_inner];
				} else {
					return false;
				}
			}
		} else {
			if (current[key] != undefined){
				current = current[key];
			} else {
				return false;
			}
		}
	}
	return current;
}
function set_array_value(array_in, array_value, ...keys) {
	let current = array_in;
	let key;
	let key_inner;
	if (current == undefined){
		return false;
	}
	for (let temp_key of keys){	
		key = keys[temp_key];
		if (typeof key == 'object'){
			for (let key_temp_key in key){	
				key_inner = key[key_temp_key];
				if (current[key_inner] != undefined){
					current = current[key_inner];
				} else {
					return false;
				}
			}
		} else {
			if (current[key] != undefined){
				current = current[key];
			} else {
				return false;
			}
		}
	}
	current = array_value;
	return current;
}
// добавить в объект или массив
function push(obj, new_value) {
	let max_id = 0;
	if ((typeof obj).toLowerCase() == 'object') {
		for (let id in obj){	
			if (parseInt(id) > max_id){
				max_id = parseInt(id);
			}
		}
		max_id++;
		obj[max_id] = new_value;
		return true;
	} else if ((typeof obj).toLowerCase() == 'array') {
		obj.push(new_value);
		return true;
	} else  {
		return false;
	}
}

// Выполнить функцию над каждым элементом массива
function forEachEl(targetArray, funcName) {
	for (let el in targetArray) {
		funcName(el, targetArray[el]);
	}
}

// Случайное целое
function randInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

// Случайное Float
function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}


// Задать шрифт2
function setFont2(fontName, fontPath, fontFormat) {
	jsid('font_style').apendChild(document.createTextNode("\
@font-face {\
    font-family: " + fontName + ";\
    src: url('" + fontPath + "') format('fontFormat');\
}\
"));
}
//
function cr(elem_name) {
	return document.createElement(elem_name);
}
// Создание таблицы из объекта
function create_table_from_object(obj) {
	let table = document.createElement('table');
	let tr = document.createElement('tr');
	let td = document.createElement('td');
	for (let obj_line in obj) {
		tr = document.createElement('tr');
		for (let obj_el in obj_line) {
			td = document.createElement('td');
			td.innerHTML = obj[obj_line][obj_el];
			tr.appendChild(td);
			//console.log(obj_line);
			//console.log(obj_el);
			//console.log(obj[obj_line][obj_el]);
		}
		table.appendChild(tr);
		break;
	}
	return table;
}
function el(tagName, props={}) {
	let element = document.createElement(tagName);
	for (propName in props) {
		element[propName] = props[propName];
	}
	return element;
}
function fullIFrame(src) {
	let props = {
		'width':window.innerWidth,
		'height':window.innerHeight,
		'src':src,
		'frameborder':0,
		'allow':'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
		'allowfullscreen':true
	};
	return el('iframe', props);
}
function css_implant_local(styles, media_txt='screen', id_el='') {
	let css = document.createElement('style');
	if (id_el!=''){	
		css.id = id_el;
	}
	css.type = 'text/css';
	css.media = media_txt;
	if (css.styleSheet) {
		css.styleSheet.cssText = styles;
	} else {
		css.appendChild(document.createTextNode(styles));
	}
	document.getElementsByTagName("head")[0].appendChild(css);
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function start(start_function) {
	document.addEventListener("DOMContentLoaded", start_function);
}

//AJAX!!!
function json_parse(msg_txt) {
	return JSON.parse(msg_txt.replace(/\\n/g,""));
}
function getXmlHttp(){
	let xmlhttp;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}
/*
 * options['result_id': 'target_id']; или
 * options['result_id': 
 *		[
 *			'function': my_function, // исполняемая функция
 *			'target_id': 'my_target_id', 
 *		], 
 *	];
 */
function ajax_default_callback(msg, options=undefined) {
	let real_id;
	let msg_json;
	let option_value;
	let func;
	try {
		msg_json = json_parse(msg);
		//console.log(msg);
		//console.log(msg_json);
	} catch (e) {
		set_error('Ошибка при получении Ajax');
		console.error(e);
		console.log(msg);
	}
	for (let msg_name in msg_json) {
		real_id = msg_name;
		if (options != undefined && options[msg_name] != undefined){
			option_value = options[msg_name];
			if (msg_json[msg_name] !== undefined && typeof option_value === 'object'){
				if (option_value['target_id'] !== undefined ){
					real_id = option_value['target_id'];
				} 
				if (option_value['function'] !== undefined && typeof option_value['function'] === 'function'){
					func = option_value['function'];
					if (option_value['target_id'] !== undefined ){
						set_content(func(msg_json[msg_name]), option_value['target_id']);
					} else {
						set_content(func(msg_json[msg_name]), msg_name);
					}
					continue;
				}
			} else {
				real_id = options[msg_name];
			}
		}
		set_content(msg_json[msg_name], real_id);
	}
}
function input_grabber(id_array, target_array) {
	let el;
	let current_id;
	for (let temp_id in id_array) {
		current_id = id_array[temp_id];
		el = jsid(current_id);
		if (el != undefined){
			if (el.value != undefined){
				target_array[current_id] = el.value;
			} else if (el.checked != undefined) {
				target_array[current_id] = el.checked;
			}
		}
	}
}

/*
 * sendAjax('post', 'ajax.php', { 'theCode': theCode, 'theCSS': theCSS }, null);
 */
function sendAjax(method, filename, inputArray, callbackF) {
	let xmlhttp = getXmlHttp();
	let param = null;
	let params = '';
	let amp = '';
	for (let elId in inputArray) {
		params += amp + elId + '=' + encodeURIComponent(inputArray[elId]);
		amp = '&';
	}
	if ((method == 'POST') || (method == 'post')) {
		xmlhttp.open('POST', filename, true);
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		param = params;
	} else {
		xmlhttp.open('GET', filename + '?' + params, true);
	}
	xmlhttp.onreadystatechange = function() {
	  if (xmlhttp.readyState == 4) {
		 if(xmlhttp.status == 200) {
			if ((callbackF !== undefined) && (callbackF !== null)) {
				callbackF(xmlhttp.responseText);
			}
		 }
	  }
	};
	xmlhttp.send(param);
}
// Function to download data to a file
function download(data, filename, type) {
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
				url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
}
function createFragmentFromString(str){
	    var template = document.createElement("template");
	    template.innerHTML = str;
	    return template.content;
}

Date.prototype.yyyymmdd = function() {
	  var mm = this.getMonth() + 1; // getMonth() is zero-based
	  var dd = this.getDate();

	  return [this.getFullYear(),
		            (mm>9 ? '' : '0') + mm,
		            (dd>9 ? '' : '0') + dd
		           ].join('_');
};
function getTimeStamp() {
    var now = new Date();
    return ( 
		(now.getDate()) + '_' +
		(now.getMonth() + 1) + '_' +
             now.getFullYear() + " " +
             now.getHours() + ':' +
             ((now.getMinutes() < 10)
                 ? ("0" + now.getMinutes())
                 : (now.getMinutes())) + ':' +
             ((now.getSeconds() < 10)
                 ? ("0" + now.getSeconds())
                 : (now.getSeconds())));
}

// Подключение блока кнопок управления окном
let window_control_props = {};
let window_control_propArray = ['padding', 'position', 'top', 'left', 'width', 'height'];
function maximize_window_control_block(obj) {
	let controled_block = obj.parentNode.parentNode;
	controled_block.style.padding = '20px';
	controled_block.style.position = 'fixed';
	controled_block.style.top = '0px';
	controled_block.style.left = '0px';
	controled_block.style.width = '100%';
	controled_block.style.height = '800px';
}
function minimize_window_control_block(obj) {
	let window_control_block_id =  obj.parentNode.getAttribute('window_control_block_id');
	let controled_block = obj.parentNode.parentNode;
	let propName = '';
	for (let p_id in window_control_propArray) {
		propName = window_control_propArray[p_id];
		controled_block.style[propName] = window_control_props[window_control_block_id][propName];
	}
}
function init_window_control_block() {
	let window_control_block_array = document.getElementsByClassName('window_control_block');
	let elementComputed;
	let propName = '';
	if (window_control_block_array != undefined){
		for (let i=0; i < window_control_block_array.length; i++) {
			// Маркировка блока
			window_control_block_array[i].setAttribute('window_control_block_id', i);
			// Computed Styles
			elementComputed = window.getComputedStyle(window_control_block_array[i].parentNode);
			if (window_control_props[i] == undefined){
				window_control_props[i] = {};
			}
			for (let p_id in window_control_propArray) {
				propName = window_control_propArray[p_id];
				window_control_props[i][propName] = elementComputed.getPropertyValue(propName);
			}

			// Кнопки
			window_control_block_array[i].innerHTML = '\
<button id="maximize_window_control_block' + i + '" onclick="maximize_window_control_block(this);return false;">^</button>\
<button id="minimize_window_control_block' + i + '" onclick="minimize_window_control_block(this);return false;">_</button>\
			';
		}
	}
}
setTimeout(init_window_control_block, 1000);
