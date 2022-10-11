function show_projects() {
	jsid(WINDOW_ID + WINDOW_NUMBER).innerHTML = '';
	read_folder('projects/');
}
function show_lists(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let current_element_vector = new Array;
	current_element_vector[0] = element_vector[0];
	current_element_vector[1] = element_vector[1];
	let element_vector_id = element_vector[2];
	jsid(WINDOW_ID + WINDOW_NUMBER).innerHTML = '';
	let el_html;
	let parallel;
	let parallel_column;
	parallel = cr('div');
	parallel.className = 'parallel';
	for (let el_id in ELEMENTS[project_name][page_number]){	
		if (ELEMENTS[project_name][page_number][el_id] != undefined && ELEMENTS[project_name][page_number][el_id] != null && ELEMENTS[project_name][page_number][el_id]['tech']['isListElement']){
			current_element_vector[2] = el_id;
			el_html = display_element2(current_element_vector);
			parallel_column = cr('div');
			parallel_column.className = 'parallel_column';
			parallel_column.appendChild(el_html);
			parallel.appendChild(parallel_column);
		}
	}
	jsid(WINDOW_ID + WINDOW_NUMBER).appendChild(parallel);
}
function show_interfaces() {
	jsid(WINDOW_ID + WINDOW_NUMBER).innerHTML = '';
	let el_html;
	let parallel;
	let parallel_column;
	let element_vector = new Array;
	parallel = cr('div');
	parallel.className = 'parallel';
	for (let project_name in ELEMENTS){	
		element_vector[0] = project_name;
		for (let page_number in ELEMENTS[project_name]){	
			element_vector[1] = page_number;
			for (let el_id in ELEMENTS[project_name][page_number]){	
				element_vector[2] = el_id;
				if (ELEMENTS[project_name][page_number][el_id] != undefined && ELEMENTS[project_name][page_number][el_id] != null && ELEMENTS[project_name][page_number][el_id]['tech']['isInterface']){
					el_html = display_element2(element_vector);
					parallel_column = cr('div');
					parallel_column.className = 'parallel_column';
					parallel_column.appendChild(el_html);
					parallel.appendChild(parallel_column);
				}
			}
		}
	}
	jsid(WINDOW_ID + WINDOW_NUMBER).appendChild(parallel);
}
function show_selected_list() {
	if (SELECTED_ELEMENTS.length > 0){
		let selected_list_txt = '';
		let el_id;
		let el_name;
		let temp_array = copyObject(SELECTED_ELEMENTS);
		for (let el_temp_id in temp_array){	
			el_id = temp_array[el_temp_id];
			if (ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id] == undefined){
				SELECTED_ELEMENTS.splice(el_temp_id, 1);
				continue;
			}
			el_name = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id]['main']['description']['name'];
			selected_list_txt += '<a href="#" onclick="point_to(' + el_id + ');return false">' + el_name + '(' + el_id + ')</a><br/>';
		}
		jsid('left_main_left_panel_header').innerHTML = '<span>Selected List:</span>';
		jsid('left_main_left_panel_content').innerHTML = selected_list_txt;
	} else {
		jsid('left_main_left_panel_header').innerHTML = '';
		jsid('left_main_left_panel_content').innerHTML = '';
	}
}
function roll_up(el_id) {
	let element = jsid('element' + el_id);
	let display_status = element.querySelector('.block_to_hide').style.display;
	if (display_status != 'none'){
		element.querySelector('.block_to_hide').style.display = 'none';
	} else {
		element.querySelector('.block_to_hide').style.display = 'block';
	}
}
function change_element_name(el_id, obj) {
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id]['main']['description']['name'] = obj.value;
	save_all();
	show_all();
}
function get_element_types(element_vector) {
	let project_name_current;
	let page_number_current;
	let id_current;
	let current_control_element = new ElementControl(element_vector);
	let current_element = current_control_element.element;
	let current_control_element_in;
	let current_element_in;
	let result = '';
	let type_name;
	for (let temp_el_id in current_element['main']['types']){	
		project_name_current = current_element['main']['types'][temp_el_id]['project_name'];
		page_number_current = current_element['main']['types'][temp_el_id]['page_number'];
		id_current = current_element['main']['types'][temp_el_id]['id'];
		current_control_element_in = new ElementControl([project_name_current, page_number_current, id_current]);
		current_element_in = current_control_element_in.element;
		type_name = current_element_in['main']['description']['name'];
		result += '<a href="#" onclick="show_all([\'' + project_name_current + '\', ' + page_number_current + ', ' + id_current + ']);return false">' + type_name + '</a><br/>';
	}
	if (result == ''){
		result = 'Отсутствуют';
	}
	return result;
}
function get_element_type_interfaces(element_vector) {
	let project_name_current;
	let page_number_current;
	let id_current;
	let current_control_element = new ElementControl(element_vector);
	let current_element = current_control_element.element;
	let current_control_element_in;
	let current_element_in;
	let result = '';
	let type_name;
	for (let temp_el_id in current_element['main']['type_interfaces']){	
		project_name_current = current_element['main']['type_interfaces'][temp_el_id]['project_name'];
		page_number_current = current_element['main']['type_interfaces'][temp_el_id]['page_number'];
		id_current = current_element['main']['type_interfaces'][temp_el_id]['id'];
		current_control_element_in = new ElementControl([project_name_current, page_number_current, id_current]);
		current_element_in = current_control_element_in.element;
		type_name = current_element_in['main']['description']['name'];
		result += '<a href="#" onclick="show_all([\'' + project_name_current + '\', ' + page_number_current + ', ' + id_current + ']);return false">' + type_name + '</a><br/>';
	}
	if (result == ''){
		result = 'Отсутствуют';
	}
	return result;
}
function element_path_generator(element_vector_in) {
	let element_vector = vector_by_vector(element_vector_in);
	let is_exists = true;
	let result = '';
	let separator = '';
	let current_element = element_by_vector(element_vector);
	let counter = 1;
	while (is_exists){
		if (current_element != undefined){
			result = current_element['main']['description']['name'] + separator + result;
			separator = ' > ';
			if (current_element['tech']['parents'][0] != undefined){
				element_vector[2] = current_element['tech']['parents'][0];
				current_element = element_by_vector(element_vector);
			} else {
				is_exists = false;
			}
		} else {
			is_exists = false;
		}
	}
	result = PROJECT_NAME + ': ' + result;
	return result;
}
function show_prop_value(el_id, current_property, current_element) {
	let field_name = current_property['field_name'];
	let field_array = current_property['field_array'];
	let values_array;
	let value;
	let result = '<input type="text" onchange="set_this_element_prop(' + el_id + ', this)" id="' + id_generator(current_property['field_array']) + '" target="' + current_property['field_name'] + '" value="' + current_property['value'] + '" /><br/>';
	let property_type = get_array_value(current_element['property_types'], field_array);
	if (property_type){
		values_array = property_type.split(',');
		if (values_array.length > 0){
			result = '<select>';
			for (let temp_id in values_array){	
				value = values_array[temp_id];
				result += '<option>' + value + '</option>'
			}
			result += '</select><br/>';
		}
	}
	return result;
}
function hide_property_block(block_id) {
	if (jsid(block_id).style.display == 'none'){
		jsid(block_id).style.display = 'block';
	} else {
		jsid(block_id).style.display = 'none';
	}
}
function show_element_info_options_block(current_element, block_name, el_id, isHidden=false) {
	right_panel(true);
	let the_object = get_object_recursive(current_element[block_name]); // из basis.js
	let hidden_style = '';
	if (isHidden){
		hidden_style = ' style="display:none;"';
	}
	let empty_class = '';
	if ( sizeof(the_object) == 0 ){
		empty_class = ' empty';
	}
	let result = '<button class="property_block_button' + empty_class + '" onclick="hide_property_block(\'property_block_' + block_name + '\');return false;">' + block_name + '</button>';
	result += '<div id="property_block_' + block_name + '"' + hidden_style + '>';
	let current_property;
	let offset = '';
	for (let obj_temp_id in the_object){	
		current_property = the_object[obj_temp_id];
		if (current_property != undefined && current_property['field_name'] != undefined){
			offset = '';
			for (let i = 0; i < current_property['level']; i++ ){	
				offset += '&nbsp;&nbsp;&nbsp;&nbsp;>';  
			}
			result += '</span>' + offset + '</span><span>' + current_property['field_name'] + ':</span><br/>';
			if (current_property['value'] == undefined){
				current_property['value'] = '';
			}
			if (current_property['value'].toString().length < 100){
				result += show_prop_value(el_id, current_property, current_element);
				//result += '<input type="text" onchange="set_this_element_prop(' + el_id + ', this)" id="' + id_generator(current_property['field_array']) + '" target="' + current_property['field_name'] + '" value="' + current_property['value'] + '" /><br/>';
			} else {
				result += '<textarea>' + current_property['value'] + '</textarea><br/>';
			}
		}
	}
	result += '</div>';
	return result;
}
function show_element_info(element_vector) {
	let current_element = element_by_vector(element_vector);
	if (current_element == undefined){
		alert('Попытка получить свойства пустого объекта ID='+el_id);
		return false;
	}
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let el_id = element_vector[2];
	let target_el_html_id = get_element_html_id(el_id);
	set_active([project_name, page_number, el_id]);
	let types_txt = get_element_types(element_vector);
	let type_interfaces_txt = get_element_type_interfaces(element_vector);

	let result = element_path_generator(element_vector) + '<input type="hidden" value="' + project_name + '" id="info_element_project_name"/><br/>';
	result += '<div><strong>Присвоенные типы:</strong><div id="element_types_list">' + types_txt + '</div></div>';
	result += '<button onclick="set_type_step1([\'' + project_name + '\', ' + page_number + ', ' + el_id + ']); return false;" title="Назначить дополнительный тип для элемента">Добавить тип</button><br/>';
	result += '<div><strong>Подключенные интерфейсы типов:</strong><div id="element_type_interfaces_list">' + type_interfaces_txt + '</div></div>';
	result += '<button onclick="connect_properties_interface_step1([\'' + project_name + '\', ' + page_number + ', ' + el_id + ']); return false;" title="Подключить интерфейс типов">Подключить интерфейс типов</button><br/>';
	result += '<button onclick="extend_properties_step1([\'' + project_name + '\', ' + page_number + ', ' + el_id + ']); return false;" title="Наследовать свойства других элементов">Наследовать свойства</button><br/>';
	result += '<button onclick="connect_interface_step1([\'' + project_name + '\', ' + page_number + ', ' + el_id + ']); return false;" title="Подключить интерфейс из списка интерфейсов">Подключить интерфейс</button><br/>';
	result += show_element_info_options_block(current_element, 'tech', el_id, true);
	result += show_element_info_options_block(current_element, 'main', el_id, true);
	result += show_element_info_options_block(current_element, 'personal', el_id, true);
	result += show_element_info_options_block(current_element, 'extended', el_id, true);
	result += show_element_info_options_block(current_element, 'interfaced', el_id, true);

	result += '<input type="text" id="prop_name" placeholder="Имя свойства"/>'
	result += '<select id="prop_type_value" onchange="prop_type_value_change(this); return false;">\
	<option value="string">Строка</option>\
	<option value="array">Массив</option>\
		</select>'
	result += '<input type="text" id="prop_type" placeholder="Параметры типа" style="display: none;"/>'
	result += '<textarea type="text" id="prop_value" placeholder="Значение свойства"></textarea>'
	result += '<button onclick="add_element_prop_box(' + el_id + '); return false;">Добавить свойство</button><br/>'
	result += '<button onclick="set_element_props2(' + el_id + '); return false;">Сохранить</button>'
	jsid('right_main').innerHTML = result;	
}
function toggle_active_as_list_element() {
	let project_name = ACTIVE_ELEMENT[0];
	let page_number = ACTIVE_ELEMENT[1];
	let active_element_id = ACTIVE_ELEMENT[2];
	if (ELEMENTS[project_name] == undefined || ELEMENTS[project_name][page_number] == undefined || ELEMENTS[project_name][page_number][active_element_id] == undefined){
		console_it('Активный элемент не выбран');
		return false;
	}
	if (ELEMENTS[project_name][page_number][active_element_id]['tech']['isListElement']){
		ELEMENTS[project_name][page_number][active_element_id]['tech']['isListElement'] = false;
	} else {
		ELEMENTS[project_name][page_number][active_element_id]['tech']['isListElement'] = true;
	}
}
/*
function toggle_active_as_main_interface() {
	let project_name = ACTIVE_ELEMENT[0];
	let page_number = ACTIVE_ELEMENT[1];
	let active_element_id = ACTIVE_ELEMENT[2];
	if (ELEMENTS[project_name][page_number][active_element_id]['tech']['isMainInterface']){
		ELEMENTS[project_name][page_number][active_element_id]['tech']['isMainInterface'] = false;
		ELEMENTS[project_name][page_number][active_element_id]['tech']['isInterface'] = false;
	} else {
		ELEMENTS[project_name][page_number][active_element_id]['tech']['isMainInterface'] = true;
		ELEMENTS[project_name][page_number][active_element_id]['tech']['isInterface'] = true;
	}
	show_all(START_POINT);
}
*/
function toggle_active_as_interface() {
	let project_name = ACTIVE_ELEMENT[0];
	let page_number = ACTIVE_ELEMENT[1];
	let active_element_id = ACTIVE_ELEMENT[2];
	if (ELEMENTS[project_name][page_number][active_element_id]['tech']['isInterface']){
		ELEMENTS[project_name][page_number][active_element_id]['tech']['isInterface'] = false;
	} else {
		ELEMENTS[project_name][page_number][active_element_id]['tech']['isInterface'] = true;
	}
	show_all(START_POINT);
}
function show_modal(modal_name, modal_content) {
	jsid('modal_main').style.display = 'flex';
	jsid('modal_main_header').innerHTML = modal_name;
	jsid('modal_main_content').innerHTML = modal_content;
}
function hide_modal() {
	jsid('modal_main').style.display = 'none';
}
function close_it(obj) {
	obj.parentNode.parentNode.style.display = 'none';
}
function show_status(msg) {
	alert(msg);	
}
function horizontal_vertical_toggle() {
	jsid(WINDOW_ID + WINDOW_NUMBER).classList.toggle('display_horizontal');
}
function second_window() {
	if ( jsid('window_box2').style.display != 'none'){
		jsid('window_box2').style.display = 'none';
		jsid('window_box1').style.height = '100%';
	} else {
		jsid('window_box2').style.display = 'block';
		jsid('window_box1').style.height = '50%';
	}
}
function right_panel(mode=null) {
	if (typeof mode == 'boolean'){
		if (!mode){
			jsid('right').style.display = 'none';
			jsid('left').style.width = '100%';
		} else {
			jsid('right').style.display = 'block';
			jsid('left').style.width = '70%';
		}
	}  else {
		if (jsid('right').style.display != 'none'){
			jsid('right').style.display = 'none';
			jsid('left').style.width = '100%';
		} else {
			jsid('right').style.display = 'block';
			jsid('left').style.width = '70%';
		}
	}
}
function console_it(input_string) {
	let date = new Date();
	let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	jsid('console').innerHTML = '<span class="console_time">' + time + '> </span> ' + input_string + "<br/>\n" + jsid('console').innerHTML;
}
