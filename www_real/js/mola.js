let last_el_id = 0;
let current_level = 1;
//let PAGE_NUMBER = 1; Определение в elements_class.js
let START_POINT = 1;
let ACTIVE_ELEMENT = [];
let TYPE_FOR_ELEMENT = [];
let PROPERTIES_INTERFACE_FOR_ELEMENT = [];
let EXTEND_PROPERTIES_VECTOR_TARGET;
let CONNECT_INTERFACE_VECTOR_TARGET;
let COLLECTED_INTERFACES_ARRAY__INTERFACES = [];
let COLLECTED_INTERFACES_ARRAY__TARGETS = [];
let COLLECTED_INTERFACES_ARRAY__I = 0;
let INTERFACES_ARRAY_SET__INTERFACE = [];
let INTERFACES_ARRAY_SET__TARGET = [];
let INTERFACES_ARRAY_SET__I = 0;
let SELECTED_ELEMENTS = [];
let REMOVED_ELEMENTS = [];
let COPIED_ELEMENTS = [];
let CURRENT_ELEMENT_VECTOR;

let main_window_first_element;
let main_window_top = 200;
let main_window_left = 200;
let uni = new Uni();
function test() {
	/*
	let elem = new ElementControl(1);
	let previous_array = elem.next_previous_id();
	let current_value;
	for (let el_id in previous_array){	
		current_value = uni.set_element_by_vector(previous_array[el_id], 2);
		current_value = uni.get_element_by_vector(previous_array[el_id]);
		console.log(current_value);
	}
	*/
}
function set_page(page_number_in, window_number) {
	WINDOWS[window_number]['page_number'] = page_number_in;
	CURRENT_ELEMENT_VECTOR = 1;
	select_window(window_number);
	show_pages();
	show_all();
}
function connect_properties_interface_step1(element_vector) {
	PROPERTIES_INTERFACE_FOR_ELEMENT = element_vector;
	show_all();
}
function set_type_step1(element_vector) {
	TYPE_FOR_ELEMENT = element_vector;
	show_all();
}
function show_page(window_number) {
	let page_numbers_length = PAGE_NUMBERS.length;
	let page_numbers_html = '';
	let page_title = '';
	let className = '';
	for (let current_page_number = 1; current_page_number < page_numbers_length; current_page_number++){	
		if (current_page_number == WINDOWS[window_number]['page_number']){
			className = 'active';
		} else {
			className = '';
		}
		page_title = PAGE_NUMBERS[current_page_number];
		page_numbers_html += '<button class="' + className + '" title="' + page_title + '" onclick="set_page(' + current_page_number + ', ' + window_number + ');">' + current_page_number + '</button>';
	}
	page_numbers_html += '<button title="Создать страницу" onclick="set_new_page();">+</button>';
	jsid('page_numbers' + window_number).innerHTML = page_numbers_html;
}
function show_pages() {
	for (let window_number in WINDOWS){	
		show_page(window_number);
	}
}
function set_new_page() {
	let new_page_number = PAGE_NUMBERS.length;
	PAGE_NUMBERS[new_page_number] = 'Новая страница';
	ELEMENTS[PROJECT_NAME][new_page_number] = [];
	ELEMENTS[PROJECT_NAME][new_page_number][0] = null;
	ELEMENTS[PROJECT_NAME][new_page_number][1] = copyObject(DEFAULT_ELEMENT);
	PAGE_NUMBER = new_page_number;
	CURRENT_ELEMENT_VECTOR = 1;
	show_all();
	show_pages();
}
function first_show_pages() {
	let page_numbers_length = ELEMENTS[PROJECT_NAME].length;
	for (let current_page_number = 1; current_page_number < page_numbers_length; current_page_number++){	
		PAGE_NUMBERS[current_page_number] = 'Страница ' + current_page_number;
	}
	show_pages();
}
function set_time() {
	let currentDate  = new Date;
	jsid('set__time').value = currentDate.yyyymmdd();
	jsid('set__time').value = getTimeStamp();
}
function move_screen_to_current_position(target_html_id) {
	main_window_first_element = qs('#' + target_html_id + ' > div:first-child');
	main_window_first_element.style.top = main_window_top + 'px';
	main_window_first_element.style.left = main_window_left + 'px';
}
function on_main_window_move(ev, target_html_id) {
	//ev.stopPropagation();
	main_window_first_element = qs('#' + target_html_id + ' > div:first-child');
	if (main_window_first_element  == undefined){
		return false;
	}
	main_window_top = parseInt(main_window_first_element.style.top);
	main_window_left = parseInt(main_window_first_element.style.left);
	if (isNaN(main_window_top)){
		main_window_top = 200;
	}
	if (isNaN(main_window_left)){
		main_window_left = 200;
	}
	onmousedownY = ev.pageY;
	onmousedownX = ev.pageX;
	let mouseDiffY;
	let mouseDiffX;
	let current_main_window_top;
	let current_main_window_left;
	document.onmousemove = function (e) {
		mouseDiffY = (-onmousedownY + e.pageY);
		mouseDiffX = (-onmousedownX + e.pageX);
		current_main_window_top = main_window_top + mouseDiffY;
		current_main_window_left = main_window_left + mouseDiffX;
		main_window_first_element.style.top = current_main_window_top + 'px';
		main_window_first_element.style.left = current_main_window_left + 'px';
	}
	document.onmouseup = function (e) {
		document.onmousemove = null;
		document.onmouseup = null; 
	}
}
function select_window(window_number) {
	jsid('select_window' + WINDOW_NUMBER).classList.remove('active');	
	WINDOW_NUMBER = window_number;
	PAGE_NUMBER = WINDOWS[window_number]['page_number'];
	jsid('select_window' + WINDOW_NUMBER).classList.add('active');	
}
	function join_elements(element_vector, array_in) {
		let result = '';
		let comma = '';
		let el_name;
		let current_element_vector = copyObject(element_vector);
		let current_element_vector_arg = vector_to_args(current_element_vector);
		let current_element;
		for (let el_id_a in array_in){	
			current_element_vector[2] = array_in[el_id_a];
			current_element_vector_arg = vector_to_args(current_element_vector);
			current_element = element_by_vector(current_element_vector);
			el_name = current_element['main']['description']['name'];
			result += comma + '<a href="#" onclick="show_all([' + current_element_vector_arg + ']);return false;">' + el_name + '('  + current_element_vector[2] + ')</a>';
			comma = ', <br/>';
		}
		return result;
	}
	function class_selector(data) {
		let class_name = '';
		if (data.tech.isInterface){
			class_name += ' isInterface';
		}
		return class_name;
	}

function display_element2(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let data = element_by_vector(element_vector);
	/*
	 * data.id, data.description.name, data.parents, data.childs 
	 */
	let parents_line = join_elements(element_vector, data.tech.parents);
	let childs_line = join_elements(element_vector, data.tech.childs);
	let add_extend_properties = '';
	let class_name = class_selector(data);
	if (EXTEND_PROPERTIES_VECTOR_TARGET != undefined){
		add_extend_properties += '<button onclick="extend_properties_step2([\'' + project_name + '\', ' + page_number + ', ' + data.tech.id + ']);return false;">Extend This</button>';
	}
	if (CONNECT_INTERFACE_VECTOR_TARGET != undefined && data.tech.isInterface){
		add_extend_properties += '<button onclick="connect_interface_step2([\'' + project_name + '\', ' + page_number + ', ' + data.tech.id + ']);return false;">Connect This</button>';
	}
	if (TYPE_FOR_ELEMENT != undefined && TYPE_FOR_ELEMENT.length == 3){
		add_extend_properties += '<button onclick="connect_type_step2([\'' + project_name + '\', ' + page_number + ', ' + data.tech.id + ']);return false;">Add as type</button>';
	}
	if (PROPERTIES_INTERFACE_FOR_ELEMENT != undefined && PROPERTIES_INTERFACE_FOR_ELEMENT.length == 3){
		add_extend_properties += '<button onclick="connect_properties_interface_step2([\'' + project_name + '\', ' + page_number + ', ' + data.tech.id + ']);return false;">Connect Type Interface</button>';
	}
	SHOWED_ELEMENTS_ID.push(get_element_html_id(data.tech.id));
	let element_html = '\
<div class="element_box">\
	<div class="previous_elements" id="previous_of_' + get_element_html_id(data.tech.id) + '"></div>\
	<div class="element' + class_name + '" id="' + get_element_html_id(data.tech.id) + '">\
		<div class="name">\
			<button onclick="toggle_element_selected(' + data.tech.id + ')" class="number" style="width: 2em;">' + data.tech.id + '</button>\
			<input type="text" value="' + data.main.description.name + '" onchange="change_element_name(\'' + data.tech.id + '\', this)"/>\
			<button onclick="minimize(' + data.tech.id + ')">_</button>\
		</div>\
		<div class="block_to_hide">\
			<div class="control_previous">\
				<button onclick="new_previous_element_parallel(' + data.tech.id + ')" style="width: 2em;" title="New previous element parallel">+</button>\
				<button onclick="new_previous_element_between(' + data.tech.id + ')" style="width: 2em;" title="New previous element">|+|</button>\
				<button onclick="paste_elements(' + data.tech.id + ', \'previous\')" title="Paste previous element">P</button>\
			</div>\
			<div class="control">\
				<button onclick="open_file(' + data.tech.id + ')">File</button>\
				<button onclick="read_php(' + data.tech.id + ')">R&nbsp;PHP</button>\
				<button>Txt</button>\
				<button>Obj</button>\
				<button>Arr</button>\
				<button onclick="show_element_info([\'' + project_name + '\', ' + page_number + ',' + data.tech.id + '])">i</button>\
			</div>\
			<div>\
				<button onclick="new_parents_element_parallel(' + data.tech.id + ')" title="New parent element parallel">+</button>\
				<button onclick="new_parents_element_between(' + data.tech.id + ')" title="Insert between this and parent">|+|</button><span>P: ' + parents_line + '</span>\
			</div>\
			<div>\
				<button onclick="new_childs_element_parallel(' + data.tech.id + ')" title="New child element parallel">+</button>\
				<button onclick="new_childs_element_between(' + data.tech.id + ')" title="Insert between this and child">|+|</button><span>c: ' + childs_line + '</span>\
			</div>\
			<div>\
				<button onclick="new_next_element_parallel(' + data.tech.id + ')" title="New next element parallel">+</button>\
				<button onclick="new_next_element_between(' + data.tech.id + ')" title="New next element">|+|</button>\
				<button onclick="new_parallel_element(' + data.tech.id + ')" title="New parallel element">||</button>\
				<button onclick="paste_elements(' + data.tech.id + ', \'next\')" title="Paste next element">P</button>\
				<button onclick="paste_elements(' + data.tech.id + ', \'parallels\')" title="Paste parallel element">P||</button>\
				<button onclick="remove_link(' + data.tech.id + ', \'next\')" title="Remove Next link">L-</button>\
				<button onclick="add_link(' + data.tech.id + ', \'next\')" title="Add Next link">L+</button>\
				<button onclick="remove_link(' + data.tech.id + ', \'parallels\')" title="Remove parallel link">L|-</button>\
				<button onclick="add_link(' + data.tech.id + ', \'parallels\')" title="Add parallel link">L|+</button>\
				' + add_extend_properties + '\
			</div>\
		</div>\
	</div>\
	<div class="next_elements" id="next_of_' + get_element_html_id(data.tech.id) + '"></div>\
</div>\
';
	let element = document.createElement("template");
	element.innerHTML = element_html;
	return element.content;
}

function minimize(el_id) {
	let element = jsid('main_window' + WINDOW_NUMBER +'_element_' + el_id);
	let block_to_hide = element.querySelector('.block_to_hide');
	let block_to_hide_cs = window.getComputedStyle(block_to_hide);
	let display_status = block_to_hide_cs.getPropertyValue('display');
	//let display_status = element.querySelector('.block_to_hide').style.display;
	if (display_status != 'none'){
		element.querySelector('.block_to_hide').style.display = 'none';
	} else {
		element.querySelector('.block_to_hide').style.display = 'block';
	}
}
function get_element(project_name_in, page_number_in, el_id_in) {
	if (ELEMENTS[project_name_in] == undefined){
		load_project(project_name_in);
	}
	return ELEMENTS[project_name_in][page_number_in][el_id_in];
}
function new_el_id() {
	if (last_el_id == 0){
		for (let el_id_a in ELEMENTS[PROJECT_NAME][PAGE_NUMBER]) {
			last_el_id = parseInt(el_id_a);
		}
	}
	last_el_id++;
	return last_el_id;
}
function set_this_element_prop(el_id, obj) {
	let project_name = PROJECT_NAME;
	let page_number = PAGE_NUMBER;
	let command_base = 'ELEMENTS[\'' + project_name + '\'][' + page_number + '][' + el_id + ']';
	let command = command_base + obj.getAttribute('target') + ' = \'' + obj.value + '\'';
	eval(command);
	save_all();
	show_all();
	set_active([project_name, page_number, el_id]);
}
function set_element_props2(el_id) {
	let project_name = PROJECT_NAME;
	let page_number = PAGE_NUMBER;
	if (el_id <= 0 ){
		return;
	}
	let childs = jsid('right_main').childNodes;
	let command_base = 'ELEMENTS[\'' + project_name + '\'][' + page_number + '][' + el_id + ']';
	let command = '';
	for (let child_id in childs){	
		if (childs[child_id].nodeName  == 'INPUT'){
			if (childs[child_id].getAttribute('target') != undefined){
				if (childs[child_id].getAttribute('target') != "['id']"){
					command = command_base + childs[child_id].getAttribute('target') + ' = \'' + childs[child_id].value + '\'';
					//console.log(command);
					eval(command);
				}
			}
		}
		
	}
	save_all();
	show_all();
	set_active([project_name, page_number, el_id]);
}
function set_element_props(el_id, el_props_in=undefined) {
	let el_props = {};
	if (el_props_in != undefined){
		el_props = el_props_in;
	} else {
		if (jsid('set__description__name') != undefined && jsid('set__description__text') != undefined && jsid('set__description__text') != undefined){
			el_props = {
				description: {
					name: jsid('set__description__name').value,
					text: jsid('set__description__text').value,
					image: jsid('set__description__image').value,
				},
				content:  {
					file: jsid('set__content__file').value,
					text: jsid('set__content__text').value,
				}, 
				//type: jsid('set__type').value,
			};
		}
	}

	for (let prop_id_1 in el_props) {
		for (let prop_id_2 in el_props[prop_id_1]) {
			ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id]['main'][prop_id_1][prop_id_2] = el_props[prop_id_1][prop_id_2];
		}
	}
}
function prop_type_value_change(obj) {
	if (obj.value == "array"){
		jsid("prop_type").style.display = 'block';
	} else if (obj.value == "string"){
		jsid("prop_type").style.display = 'none';
	}
}
//description.name
//content.file
function re_set_props_for_selected_in() {
	let target_prop_name = jsid('target_prop_name').value;
	let target_prop_name_array = target_prop_name.split('.');
	let set_prop_name = jsid('set_prop_name').value;
	let set_prop_name_array = set_prop_name.split('.');
	let el_id;
	let el_target = '';
	let el_value = '';
	let temp_prop_val;
	for(let el_temp_id in SELECTED_ELEMENTS) {
		el_id = SELECTED_ELEMENTS[el_temp_id];
		el_target = 'ELEMENTS[' + PAGE_NUMBER + '][' + el_id + ']';
		el_value = el_target;
		for (let array_temp_id in target_prop_name_array){
			temp_prop_val = target_prop_name_array[array_temp_id];
			el_target  += '[\'' + temp_prop_val + '\']';
		}
		for (let array_temp_id in set_prop_name_array){
			temp_prop_val = set_prop_name_array[array_temp_id];
			el_value  += '[\'' + temp_prop_val + '\']';
		}
		eval(el_target + ' = ' + el_value);
	}
	hide_modal();
	save_all();
	show_all(START_POINT);
}
function re_set_props_for_selected() {
	let modal_content = '\
		<input id="target_prop_name" type="text" name="" value="description.name" placeholder="Имя целевого свойства">\
		<input id="set_prop_name" type="text" name="" value="content.file" placeholder="Имя свойства в качестве значения">\
		<button onclick="re_set_props_for_selected_in();">Задать</button>';
	show_modal('Параметры переназначения свойств', modal_content);
}
function add_element_prop_box(el_id) {
	let prop_name = jsid("prop_name").value;
	if (prop_name == undefined || prop_name == ''){
		return false;
	}
	let current_element = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id];
	let current_property =  {
			prop_name:jsid("prop_name").value,
			prop_value:jsid("prop_value").value,
			prop_type:jsid("prop_type").value,
			prop_type_value:jsid("prop_type_value").value
	};
	Object.push(current_element['personal'], current_property);
	show_element_info([PROJECT_NAME, PAGE_NUMBER, el_id]);
	save_all();
}
function set_new_element(el_id, el_props_in=undefined) {

	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id] = copyObject(DEFAULT_ELEMENT);
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id]['tech']['id'] = el_id;
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id]['tech']['start_point'] = START_POINT;
	/*
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id] = {
		id: el_id, 
		start_point: START_POINT, 
		description: {
			name: '',
			text: '',
			image: '',
		},
		content:{
			file: '',
			text: '',
		},
		type: 'object', // object, struct, group
		isListElement: false,
		next: [],
		previous: [],
		parents: [],
		childs: [],
		level: current_level,
		time: 0, // необходимо для моделирования динамических процессов
	};
	*/
	set_element_props(el_id, el_props_in);

}
function set_active(element_vector) {
	ACTIVE_ELEMENT = element_vector;
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let element_vector_id = element_vector[2];
	let active_elements = document.getElementsByClassName('element active');
	Array.prototype.forEach.call(active_elements, function(el) {
		el.classList.toggle('active');
	});
	let obj = jsid(element_vector_id);
	if (obj != undefined){
		obj.classList.add('active');
	}
}
function new_previous_element_between(el_id) {
	new NewElement(el_id, 'previous');
}
function new_next_element_between(el_id) {
	new NewElement(el_id, 'next');
}
function new_previous_element_parallel(el_id) {
	new NewElement(el_id, 'previousParallel');
}
function new_next_element_parallel(el_id) {
	new NewElement(el_id, 'nextParallel');
}
function new_childs_element_parallel(el_id) {
	new NewElement(el_id, 'childsParallel');
}
function new_parents_element_parallel(el_id) {
	new NewElement(el_id, 'parentsParallel');
}
function new_childs_element_between(el_id) {
	new NewElement(el_id, 'childs');
}
function new_parents_element_between(el_id) {
	new NewElement(el_id, 'parents');
}
function new_between_element(previous_target_id, next_target_id) {
	hide_modal();
	new NewElement(previous_target_id, 'next', {sibling_id: next_target_id});
}
function new_between_element_inside(parents_target_id, childs_target_id) {
	hide_modal();
	new NewElement(parents_target_id, 'childs', {sibling_id: childs_target_id});
}
function new_parallel_element(el_id_in) {
	new NewElement(el_id_in, 'parallels');
	/*
	hide_modal();
	let current_id = new_el_id();
	set_new_element(current_id);

	let elem_in = new ElementControl(el_id_in);
	let current_elem = new ElementControl(current_id);
	let previous_el_id = elem_in.previous()[0];
	let previous_elem;

	if (previous_el_id != undefined){
		previous_elem = new ElementControl(previous_el_id);
		previous_elem.next(current_id);
		current_elem.previous(previous_el_id);
	} else {
		elem_in.parallels(current_id);
	}

	save_all();
	show_all();
	return current_id;
	*/
}
function new_lists_element(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let element_vector_id = element_vector[2];
	let next_id = new_el_id();

	set_new_element(next_id);
	ELEMENTS[project_name][page_number][next_id]['tech']['isListElement'] = true;

	show_lists(element_vector);
	return next_id;
}
function compare_elements(target_element_vector, element_to_extend_vector) {
	let target_element = element_by_vector(target_element_vector);
	let element_to_extend = element_by_vector(element_to_extend_vector);
	let block_names_array = ['personal', 'extended', 'interfaced'];
	let different_props = {};
	let isFound = false;
	let target_prop;
	let current_prop;
	for (let block_name_target of block_names_array){
		for (let target_prop_temp_id in target_element[block_name_target]){	
			target_prop = target_element[block_name_target][target_prop_temp_id];
			for (let block_name_current of block_names_array){	
				for (current_prop_temp_id in element_to_extend[block_name_current]){	
					current_prop = element_to_extend[block_name_current][current_prop_temp_id];
					if (target_prop['prop_name'] == current_prop['prop_name']){
						isFound = true;
					}
				}
			}
			if (!isFound){
				if (different_props[block_name_target] == undefined){
					different_props[block_name_target] = {};
				}
				Object.push(different_props[block_name_target], target_prop);
			}
			isFound = false;
		}
	}
	return different_props;
}
function extend_properties_step1(element_vector) {
	EXTEND_PROPERTIES_VECTOR_TARGET = element_vector;
	save_all();
	show_all();
}
function element_by_vector(...element_vector) {
	let project_name;
	let page_number;
	let id;
	if ((typeof element_vector == 'array' || typeof element_vector == 'object') && sizeof(element_vector) == 3 ) {
		project_name = element_vector[0];
		page_number = element_vector[1];
		id = element_vector[2];
	} else if ((typeof element_vector[0] == 'array' || typeof element_vector[0] == 'object') && sizeof(element_vector[0]) == 3 ) {
		project_name = element_vector[0][0];
		page_number = element_vector[0][1];
		id = element_vector[0][2];
	} else if (Number.isInteger(element_vector[0])){
		project_name = PROJECT_NAME;
		page_number = PAGE_NUMBER;
		id = element_vector;
	} else {
		console.log('не попал');
		console.log(element_vector);
		return false;
	}
	if (ELEMENTS[project_name] == undefined){
		return false;
	} else if (ELEMENTS[project_name][page_number] == undefined) {
		return false;
	} else if (ELEMENTS[project_name][page_number][id] == undefined) {
		return false;
	}
	return ELEMENTS[project_name][page_number][id];
}
function vector_by_vector(...element_vector) {
	let project_name;
	let page_number;
	let id;
	if ((typeof element_vector == 'array' || typeof element_vector == 'object') && sizeof(element_vector) == 3 ) {
		project_name = element_vector[0];
		page_number = element_vector[1];
		id = element_vector[2];
	} else if ((typeof element_vector[0] == 'array' || typeof element_vector[0] == 'object') && sizeof(element_vector[0]) == 3 ) {
		project_name = element_vector[0][0];
		page_number = element_vector[0][1];
		id = element_vector[0][2];
	} else if ( (typeof element_vector[0] == 'number') || (typeof element_vector[0] == 'string')){
		project_name = PROJECT_NAME;
		page_number = PAGE_NUMBER;
		id = element_vector[0];
	} else {
		console.log('не попал');
		console.log(element_vector);
		return false;
	}
	if (ELEMENTS[project_name] == undefined){
		return false;
	} else if (ELEMENTS[project_name][page_number] == undefined) {
		return false;
	} else if (ELEMENTS[project_name][page_number][id] == undefined) {
		return false;
	}
	return [project_name, page_number, id];
}
function ebv(...element_vector) {
	return element_by_vector(element_vector);
}
function extend_properties(source_element_vector, element_to_extend_vector) {
	let diff = compare_elements(source_element_vector, element_to_extend_vector);
	let diff_prop;
	let target__path_txt = vector_to_txt(source_element_vector); // basis.js
	let block_names_array = ['personal', 'extended'];
	let element_to_extend = element_by_vector(element_to_extend_vector);
	for (let block_name of block_names_array){
		if (diff[block_name] != undefined){
			for (let diff_prop_temp_id in diff[block_name]){	
				diff_prop = diff[block_name][diff_prop_temp_id];
				if (diff_prop['path_txt'] == undefined){
					diff_prop['path_txt'] = {};
					diff_prop['path_txt'] = target__path_txt;
				} else {
					diff_prop['path_txt'] += target__path_txt;
				}

				if (diff_prop['path_vector'] == undefined){
					diff_prop['path_vector'] = {};
					diff_prop['path_vector'] = source_element_vector;
				} else {
					Object.push(diff_prop['path_vector'], source_element_vector);
				}

				if (diff_prop['real_path'] == undefined){
					diff_prop['real_path'] = {};
					diff_prop['real_path'] = source_element_vector;
				} 

				Object.push(element_to_extend['extended'], diff_prop);
			}
		}
	}
}
function extend_properties_step2(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let element_vector_id = element_vector[2];
	let extended__path;
	let element_to_extend;
	let source_element_vector = [project_name, page_number, element_vector_id];
	let target_element = element_by_vector(source_element_vector);
	if (EXTEND_PROPERTIES_VECTOR_TARGET != undefined){
		element_to_extend = element_by_vector(EXTEND_PROPERTIES_VECTOR_TARGET);

		if (element_to_extend['main']['extended'] == undefined){
			element_to_extend['main']['extended'] = '';
		}
		element_to_extend['main']['extended'] += vector_to_txt(source_element_vector);

		extend_properties(source_element_vector, EXTEND_PROPERTIES_VECTOR_TARGET);
		show_element_info(EXTEND_PROPERTIES_VECTOR_TARGET);
		EXTEND_PROPERTIES_VECTOR_TARGET = undefined;
	}
	save_all();
	show_all();
}
function connect_interface_step1(element_vector) {
	CONNECT_INTERFACE_VECTOR_TARGET = element_vector;
	save_all();
	show_all();
}
function set_interface(interface_element_vector, element_to_extend_vector) {
	if (!INTERFACES_ARRAY_SET__TARGET.includes(element_to_extend_vector[2])){
		extend_properties(interface_element_vector, element_to_extend_vector);

		INTERFACES_ARRAY_SET__INTERFACE[INTERFACES_ARRAY_SET__I] = interface_element_vector[2];
		INTERFACES_ARRAY_SET__TARGET[INTERFACES_ARRAY_SET__I] = element_to_extend_vector[2];
		INTERFACES_ARRAY_SET__I++;
	}
}
function collect_interfaces_array(interface_element_vector, element_to_extend_vector) {
	let element_to_extend_id;
	let interface_element_sibling_size = 0;
	let virtual_element_vector;
	let interface_element = element_by_vector(interface_element_vector);
	let element_to_extend = element_by_vector(element_to_extend_vector);
	let found_interface_element;
	let found_element_to_extend_vector = copyObject(element_to_extend_vector);
	for (let sibling of SIBLINGS){	
		interface_element_sibling_size = sizeof(interface_element[sibling]);
		for (let temp_interface_id in interface_element[sibling]){	
			interface_element_vector[2] = interface_element[sibling][temp_interface_id];
			found_element_to_extend_vector[2] = element_to_extend[sibling][temp_interface_id];

			found_interface_element = element_by_vector(interface_element_vector);

			if (found_interface_element['tech']['isInterface'] && 
					!INTERFACES_ARRAY_SET__INTERFACE.includes(interface_element_vector[2]) && 
					!COLLECTED_INTERFACES_ARRAY__INTERFACES.includes(interface_element_vector[2])){
				if (interface_element_sibling_size == 1){
					for (let temp_target_id in element_to_extend[sibling]){	
						COLLECTED_INTERFACES_ARRAY__INTERFACES[COLLECTED_INTERFACES_ARRAY__I] = interface_element_vector[2];
						COLLECTED_INTERFACES_ARRAY__TARGETS[COLLECTED_INTERFACES_ARRAY__I] = element_to_extend[sibling][temp_target_id];
						COLLECTED_INTERFACES_ARRAY__I++;
					}
				} else if (interface_element_sibling_size > 1) {
					if (element_by_vector(found_element_to_extend_vector)){
						COLLECTED_INTERFACES_ARRAY__INTERFACES[COLLECTED_INTERFACES_ARRAY__I] = interface_element_vector[2];
						COLLECTED_INTERFACES_ARRAY__TARGETS[COLLECTED_INTERFACES_ARRAY__I] = element_to_extend[sibling][temp_interface_id];
						COLLECTED_INTERFACES_ARRAY__I++;
					} else {
						virtual_element_vector = new NewElement(element_to_extend_vector, sibling, {isVirtual:true}).vector; 
						COLLECTED_INTERFACES_ARRAY__INTERFACES[COLLECTED_INTERFACES_ARRAY__I] = interface_element_vector[2];
						COLLECTED_INTERFACES_ARRAY__TARGETS[COLLECTED_INTERFACES_ARRAY__I] = virtual_element_vector[2];
						COLLECTED_INTERFACES_ARRAY__I++;
					}
				}
			}
		}
	}
}
function interfacer(interface_element_vector, element_to_extend_vector) {
	let interface_element = element_by_vector(interface_element_vector);
	if (!interface_element['tech']['isInterface']){
		alert('В качестве интерфейса установлен не интерфейс!');
		return false;
	}
	COLLECTED_INTERFACES_ARRAY__INTERFACES = [];
	COLLECTED_INTERFACES_ARRAY__TARGETS = [];
	COLLECTED_INTERFACES_ARRAY__I = 0;

	COLLECTED_INTERFACES_ARRAY__INTERFACES[COLLECTED_INTERFACES_ARRAY__I] = interface_element_vector[2];
	COLLECTED_INTERFACES_ARRAY__TARGETS[COLLECTED_INTERFACES_ARRAY__I] = element_to_extend_vector[2];

	while (sizeof(COLLECTED_INTERFACES_ARRAY__INTERFACES) != 0){	
		interface_element_vector[2] = COLLECTED_INTERFACES_ARRAY__INTERFACES[COLLECTED_INTERFACES_ARRAY__I];
		element_to_extend_vector[2] = COLLECTED_INTERFACES_ARRAY__TARGETS[COLLECTED_INTERFACES_ARRAY__I];

		COLLECTED_INTERFACES_ARRAY__INTERFACES.splice(COLLECTED_INTERFACES_ARRAY__I, 1);
		COLLECTED_INTERFACES_ARRAY__TARGETS.splice(COLLECTED_INTERFACES_ARRAY__I, 1);

		set_interface(interface_element_vector, element_to_extend_vector);

		collect_interfaces_array(interface_element_vector, element_to_extend_vector);
	}
}
function connect_interface_step2(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let element_vector_id = element_vector[2];
	let target_element = {};
	if (CONNECT_INTERFACE_VECTOR_TARGET != undefined){
		target_element = element_by_vector(CONNECT_INTERFACE_VECTOR_TARGET);
		if (target_element['interface'] != undefined){
			target_element['interface'] += project_name + ':' + page_number + ':' + element_vector_id + ';';
		} else {
			target_element['interface'] = project_name + ':' + page_number + ':' + element_vector_id + ';';
		}
		interfacer([project_name, page_number, element_vector_id], CONNECT_INTERFACE_VECTOR_TARGET);
		show_element_info(CONNECT_INTERFACE_VECTOR_TARGET);
		CONNECT_INTERFACE_VECTOR_TARGET = undefined;
	}
	save_all();
	show_all();
}
function connect_type_step2(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let element_vector_id = element_vector[2];
	let target_element = {};
	if (TYPE_FOR_ELEMENT != undefined){
		target_element = element_by_vector(TYPE_FOR_ELEMENT);
		if (target_element['main']['types'] == undefined || typeof(target_element['main']['types']) != 'object'){
			target_element['main']['types'] = {};
		}
		Object.push(target_element['main']['types'], {
			project_name: project_name, 
			page_number: page_number, 
			id: element_vector_id
		});
		show_element_info(TYPE_FOR_ELEMENT);
		TYPE_FOR_ELEMENT = undefined;
	}
	save_all();
	show_all();
}
function connect_properties_interface_step2(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let element_vector_id = element_vector[2];
	let target_element = {};
	if (PROPERTIES_INTERFACE_FOR_ELEMENT != undefined){
		target_element = element_by_vector(PROPERTIES_INTERFACE_FOR_ELEMENT);
		if (target_element['main']['type_interfaces'] == undefined || typeof(target_element['main']['type_interfaces']) != 'object'){
			target_element['main']['type_interfaces'] = {};
		}
		Object.push(target_element['main']['type_interfaces'], {
			project_name: project_name, 
			page_number: page_number, 
			id: element_vector_id
		});
		show_element_info(PROPERTIES_INTERFACE_FOR_ELEMENT);
		PROPERTIES_INTERFACE_FOR_ELEMENT = undefined;
	}
	save_all();
	show_all();
}
function insert_copied_elements_between(previous_target_id, next_target_id, elements_array) {
	let previous_elem = new ElementControl(previous_target_id);
	let next_elem = new ElementControl(next_target_id);
}

function get_child_ids_recursive(el_id) {
	let result_array = [];
	let child_ids;
	let previous_ids;
	let next_ids;
	let child_el_temp_id;
	let el_obj_id_in = 0;
	let el_temp_id_in;
	result_array.push(el_id);
	while (el_obj_id_in < result_array.length) {
		el_temp_id_in = result_array[el_obj_id_in];
		if (ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_temp_id_in]['tech']['childs'] != undefined){
			child_ids = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_temp_id_in]['tech']['childs'];
			for(let child_temp_id in child_ids) {
				if (!result_array.includes(child_ids[child_temp_id])){
					result_array.push(child_ids[child_temp_id]);
				}
			}
		}
		if (el_temp_id_in == el_id){
			el_obj_id_in++;
			continue;
		}
		if (ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_temp_id_in]['tech']['previous'] != undefined){
			previous_ids = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_temp_id_in]['tech']['previous'];
			for(let previous_temp_id in previous_ids) {
				if (!result_array.includes(previous_ids[previous_temp_id])){
					result_array.push(previous_ids[previous_temp_id]);
				}
			}
		}
		if (ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_temp_id_in]['tech']['next'] != undefined){
			next_ids = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_temp_id_in]['tech']['next'];
			for(let next_temp_id in next_ids) {
				if (!result_array.includes(next_ids[next_temp_id])){
					result_array.push(next_ids[next_temp_id]);
				}
			}
		}
		el_obj_id_in++;
	}
	return result_array;
}
function mark_selected() {
	for (let el_temp_id in SELECTED_ELEMENTS) {
		if (jsid('element' + SELECTED_ELEMENTS[el_temp_id]) != undefined){
			jsid('element' + SELECTED_ELEMENTS[el_temp_id]).classList.add('selected');
		}
	}
}
function add_element_to_selected(el_id) {
	let is_select_inner = jsid('is_select_inner').checked;
	let child_el_array;
	if (is_select_inner){
		let child_el_array = get_child_ids_recursive(el_id);
		let child_el_id;
		for (let child_el_temp_id in child_el_array){	
			child_el_id = child_el_array[child_el_temp_id];
			if (!SELECTED_ELEMENTS.includes(child_el_id)){
				SELECTED_ELEMENTS.push(child_el_array[child_el_temp_id]);
			}
		}
	} else {
		if (!SELECTED_ELEMENTS.includes(el_id)){
			SELECTED_ELEMENTS.push(el_id);
		}
	}
	mark_selected();
}
function remove_element_from_selected(el_id) {
	for (let el_temp_id in SELECTED_ELEMENTS) {
		if (SELECTED_ELEMENTS[el_temp_id] == el_id){
			SELECTED_ELEMENTS.splice(el_temp_id, 1);
			if (jsid('element' + el_id) != undefined){
				jsid('element' + el_id).classList.remove('selected');
			}
		}
	}
}
function remove_element_from_selected_button(el_id) {
	let is_select_inner = jsid('is_select_inner').checked;
	let child_el_array;

	if (is_select_inner){
		child_el_array = get_child_ids_recursive(el_id);
		for (let child_el_temp_id in child_el_array){	
			remove_element_from_selected(child_el_array[child_el_temp_id]);
		}
	} else {
		remove_element_from_selected(el_id);
	}
}
function toggle_element_selected(el_id) {
	if (SELECTED_ELEMENTS.includes(el_id)){
		remove_element_from_selected_button(el_id);
	} else {
		add_element_to_selected(el_id);
	}
	show_selected_list();
}
// Антаготисты
function mode_antagonist(mode_in) {
	let antagonist_array = new Map([
		['next', 'previous'],
		['previous', 'next'],
		['parents', 'childs'],
		['childs', 'parents'],
		['dependent', 'masters'],
		['masters', 'dependent'],
		['parallels', 'parallels'],
		['linked', 'linked'],
	]);
	return antagonist_array.get(mode_in);
}

let collected_elements_list = [];
function add_to_collected_elements_list(el_id_array, target_id, insertion_mode) {
	let is_added = false;
	let element_temp;
	let is_found = false;
	let id_array_temp = [];
	let current_id;
	let found_target_id_array = [];
	for (let el_id_temp in el_id_array) {
		current_id = el_id_array[el_id_temp];
		is_found = false;
		for (let id_temp in collected_elements_list) {
			//for (let id_temp2 in collected_elements_list[id_temp]['id_array']) {
				//if (collected_elements_list[id_temp]['id_array'][id_temp2] == el_id_array[el_id_temp]){
				if (collected_elements_list[id_temp]['target_id'] == target_id && 
				collected_elements_list[id_temp]['insertion_mode'] == insertion_mode &&
				collected_elements_list[id_temp]['id_array'].includes(current_id)
				){
					is_found = true;
					continue;
				}
				if (collected_elements_list[id_temp]['target_id'] == current_id){
					if (insertion_mode == 'before'){
						// Проверка на антагониста
						if (collected_elements_list[id_temp]['insertion_mode'] == 'after' && 
							collected_elements_list[id_temp]['id_array'].includes(current_id) ){
							is_found = false;
						} else {
							is_found = true;
							found_target_id_array.push(collected_elements_list[id_temp]['target_id']);
						}
					} else if (insertion_mode == 'after'){
						// Проверка на антагониста
						if (collected_elements_list[id_temp]['insertion_mode'] == 'before' && 
							collected_elements_list[id_temp]['id_array'].includes(current_id) ){
							is_found = false;
						} else {
							is_found = true;
							found_target_id_array.push(collected_elements_list[id_temp]['target_id']);
						}
					} else if (insertion_mode == 'parallel'){
						// Проверка на антагониста
						if (collected_elements_list[id_temp]['insertion_mode'] == 'parallel' && 
							collected_elements_list[id_temp]['id_array'].includes(current_id) ){
							is_found = false;
						} else {
							is_found = true;
							found_target_id_array.push(collected_elements_list[id_temp]['target_id']);
						}
					}
				}
			//}
		}
		if (!is_found){
			id_array_temp.push( current_id );
		}
	}
	if (id_array_temp.length > 0){
		element_temp =  {
			id_array: id_array_temp, // массив
			target_id: target_id,
			insertion_mode: insertion_mode
		};
		collected_elements_list.push( element_temp );

		is_added = true;
	}
	return is_added;
}

function id_generator(array_in) {
	let result = 'set';
	for(let array_id in array_in) {
		result += '__' + array_in[array_id];
	}
	return result;
}
function parallel_elements_collector(el_id_array) {
	let element;
	let is_added = false;
	let el_id;
	for (let el_id_i in el_id_array){	
		el_id = el_id_array[el_id_i];
		element = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id];
		if (element == undefined){
			continue;
		}
		/*
		console.log(element['id']);
		console.log(element['previous']);
		console.log(element['next']);
		*/
		if (Object.size(element['tech']['previous']) > 0){
			is_added = is_added || add_to_collected_elements_list(element['tech']['previous'], el_id, 'before');
		}
		if (Object.size(element['tech']['next']) > 0){
			is_added = is_added || add_to_collected_elements_list(element['tech']['next'], el_id, 'after');
		}
		if (Object.size(element['tech']['parallels']) > 0){
			is_added = is_added || add_to_collected_elements_list(element['tech']['parallels'], el_id, 'parallel');
		}
	}
	return is_added;

}
function make_element_interactive(html_id) {
	if (jsid(html_id) == undefined){
		return false;
	}
	jsid(html_id).addEventListener("mouseenter", function( event ) {
		// highlight the mouseenter target
		event.target.style.zIndex = 10;
	}, false);
	jsid(html_id).addEventListener("mouseleave", function( event ) {
		// highlight the mouseenter target
		event.target.style.zIndex = 1;
	}, false);
}
function show_collection(collection) {
	let collection_line;
	SHOWED_ELEMENTS_ID = [];
	jsid(WINDOW_ID + WINDOW_NUMBER).innerHTML = '';
	let collection_props = {
		'project_name': collection.project_name,
		'page_number': collection.page_number
	}
	if (WINDOWS[WINDOW_NUMBER]['page_number'] != collection.page_number){
		WINDOWS[WINDOW_NUMBER]['page_number'] = collection.page_number;
		show_page(WINDOW_NUMBER);
	}
	for (let temp_id in collection['collection']){	
		collection_line = collection['collection'][temp_id];
		show_element2(collection_line, collection_props);
	}
	/*
	for (let temp_id in SHOWED_ELEMENTS_ID) {
		make_element_interactive(SHOWED_ELEMENTS_ID[temp_id]);
	}
	*/
}
function get_element_html_id(element_id) {
	return WINDOW_ID + WINDOW_NUMBER + '_element_' + element_id;
}
function show_element2(collection_line, collection_props) {
	let project_name = collection_props.project_name;
	let page_number = collection_props.page_number;

	let el_id_array = collection_line['id_array'];
	let target_el_id = collection_line['target_el_id']; // null для первого элемента (target - текущее окно)
	let target_el_html_id;
	let target_obj;
	let target_obj_prev;
	let target_obj_next;
	if (target_el_id !== null){
		target_el_html_id = get_element_html_id(target_el_id);
		target_obj = jsid(target_el_html_id);
		target_obj_prev = jsid('previous_of_' + target_el_html_id);
		target_obj_next = jsid('next_of_' + target_el_html_id);
	}
	let insertion_mode = collection_line['mode'];
	if (insertion_mode == null){
		insertion_mode='next';
	}

	let result;
	let parallel;
	let parallel_column;
	parallel = cr('div');
	parallel.className = 'parallel';
	let el_id;
	for (let el_id_i in el_id_array){	
		el_id = el_id_array[el_id_i];
		// удаление элементов может приводить к undefined
		if (el_id == undefined){
			continue;
		}
		let element = ELEMENTS[project_name][page_number][el_id];
		if (element == undefined){
			continue;
		}
		let el_html = display_element2([project_name, page_number, el_id]);
		parallel_column = cr('div');
		parallel_column.className = 'parallel_column';
		parallel_column.appendChild(el_html);
		parallel.appendChild(parallel_column);
	}
	result = parallel;

	if (target_el_id === null){
		jsid(WINDOW_ID + WINDOW_NUMBER).appendChild(result);
	} else if(insertion_mode == 'next'){
		/*
		if (target_obj.parentNode.parentNode.nextSibling != undefined && 
			target_obj.parentNode.parentNode.nextSibling.className == 'parallel'){
			target_obj.parentNode.parentNode.nextSibling.appendChild(result);
		} else {
			parallel.appendChild(result);
			insertAfter(target_obj.parentNode.parentNode, parallel);
		}*/
		//insertAfter(target_obj, result);
		target_obj_next.appendChild(result);
	} else if(insertion_mode == 'previous'){
		/*
		if (target_obj.parentNode.parentNode.previousSibling != undefined){
			insertAfter(target_obj.parentNode.parentNode.previousSibling.parentNode, result);
		} else {
			parallel.appendChild(result);
			insertBefore(target_obj.parentNode.parentNode, parallel);
		}*/
		target_obj_prev.appendChild(result);
	} else if(insertion_mode == 'parallels'){
		if (target_obj.parentNode.parentNode.parentNode != undefined && 
			target_obj.parentNode.parentNode.parentNode.className == 'parallel'){
			for (let ch_id = 0; ch_id <= result.childNodes.length; ch_id++) {
				target_obj.parentNode.parentNode.parentNode.appendChild(result.childNodes[0]);
			}
		} else {
			alert('mola.js - очень странная ошибка');
			//parallel.appendChild(result);
			//insertBefore(target_obj.parentNode.parentNode, parallel);
		}
	} else if(insertion_mode == 'append'){
		//parallel.appendChild(result);
		target_obj.appendChild(parallel);
	}
}

let is_id_equal_callable_counter = 0;
let is_id_equal_callable_target_id = 0;
function is_id_equal_callable(target_element, mode, newcomer_id) {
	if (target_element['tech'][mode][newcomer_id] == is_id_equal_callable_target_id){
		is_id_equal_callable_counter++;
	}
}
function is_uniq(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let element_vector_id = element_vector[2];

	is_id_equal_callable_counter = 0;
	is_id_equal_callable_target_id = element_vector_id;

	let el_id;
	let current_element;
	for (let temp_el_id in ELEMENTS[project_name][page_number]){	
		current_element = ELEMENTS[project_name][page_number][temp_el_id];
		each_sibling(current_element, is_id_equal_callable);
	}
	if (is_id_equal_callable_counter == 0){
		alert("Ошибка при поиске уникального элемента!");
		return false;
	} else if (is_id_equal_callable_counter > 1){
		return false;
	} else {
		return true;
	}
}
function remove_element(element_vector) {
	let project_name = element_vector[0];
	let page_number = element_vector[1];
	let element_vector_id = element_vector[2];
	if (element_vector_id == START_POINT){
		alert('Начальный элемент нельзя удалять!');
		return false;
	}
	let elem = new ElementControl(element_vector);
	let previous_elem;
	let next_elem;
	let el_in_previous = elem.previous();
	let el_in_next = elem.next();

	let el_id_previous_return = el_in_previous[0];
	let el_id_previous;
	let el_id_next;

	for (let temp_el_id_next in el_in_next){	
		el_id_next = el_in_next[temp_el_id_next];
		for (let temp_el_id_previous in el_in_previous){	
			el_id_previous = el_in_previous[temp_el_id_previous];
			//el_in_previous[temp_el_id_previous] = el_id_next;
			previous_elem = new ElementControl(el_id_previous);
			previous_elem.previous(el_id_next);
		}
	}
	for (let temp_el_id_previous in el_in_previous){	
		el_id_previous = el_in_previous[temp_el_id_previous];
		for (let temp_el_id_next in el_in_next){	
			el_id_next = el_in_next[temp_el_id_next];
			//el_in_next[temp_el_id_next] = el_id_previous;
			next_elem = new ElementControl(el_id_next);
			next_elem.previous(el_id_previous);
		}
	}

	if (is_uniq(element_vector_id)){
		REMOVED_ELEMENTS.push(ELEMENTS[project_name][page_number][element_vector_id]);
		ELEMENTS[project_name][page_number][element_vector_id] = undefined;
		//ELEMENTS[PROJECT_NAME][PAGE_NUMBER].splice(el_id_in, 1);
	} 
	return el_id_previous_return;
}
function remove_active_element() {
	let previous_el_id;
	let project_name = PROJECT_NAME;
	let page_number = PAGE_NUMBER;
	let active_element_id = ACTIVE_ELEMENT[2];
	for (let el_temp_id in ELEMENTS[project_name][page_number][active_element_id]['tech']['previous']){	
		previous_el_id = ELEMENTS[project_name][page_number][active_element_id]['tech']['previous'][el_temp_id];
		break;
	}
	remove_element(ACTIVE_ELEMENT);
	set_active([project_name, page_number, previous_el_id]);
	save_all();
	show_all();
}
function remove_selected_elements() {
	let project_name = PROJECT_NAME;
	let page_number = PAGE_NUMBER;
	let el_id;
	let previous_el_id;
	let temp_array = copyObject(SELECTED_ELEMENTS);
	for(let el_temp_id in temp_array) {
		el_id = temp_array[el_temp_id];	
		if (el_id != undefined){
			previous_el_id = remove_element([project_name, page_number, el_id]);
		}
		SELECTED_ELEMENTS.splice(el_temp_id, 1);
	}
	show_selected_list();
	set_active([project_name, page_number, previous_el_id]);
	save_all();
	show_all();
}
function copy_selected_elements() {
	COPIED_ELEMENTS = [];
	for (let el_temp_id in SELECTED_ELEMENTS){	
		let el_id = SELECTED_ELEMENTS[el_temp_id];
		COPIED_ELEMENTS.push(ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id]);
	}
}
function find_id_in_the_chain(el_id_in, elements_array) {
	for (let el_id in elements_array){
		if (elements_array[el_id]['tech']['id'] == el_id_in){
			return true;
		}
	}
	return false;
}
function if_related(element1, element2) {
	let prev_or_next_array = ['previous', 'next', 'parallels', 'parents', 'childs', 'linked'];
	let id1_found = false;
	let id2_found = false;
	for (let prev_or_next1 of prev_or_next_array){	
		for (let prev_or_next2 of prev_or_next_array){	
			for (let id1 in element1['tech'][prev_or_next1]){
				if (id1 = element2['tech']['id']){
					id1_found = true;
				}
			}
			for (let id2 in element2['tech'][prev_or_next2]){
				if (id2 = element1['tech']['id']){
					id2_found = true;
				}
			}
			if (id1_found && id2_found){
				return true;
			}
		}
	}
	
	return false;

}
function check_the_chain2(elements_array) { // Bad
	let prev_or_next_array = ['previous', 'next', 'parallels', 'parents', 'childs', 'linked'];
	let prev_id;
	for (let el_id_array_temp in elements_array){	
		for (let prev_or_next in prev_or_next_array){	
			prev_id = el_id_array_temp;
			if (el_id_array_temp == 0 && prev_or_next == 'previous'){
				continue;
			}
			for (let el_id_in in elements_array[el_id_array_temp][prev_or_next]) {
				if (false){
				}
			}
		}
	}
}
function check_the_chain(elements_array) {
	let elements_array_length = Object.size(elements_array);
	let elements_array_current_size = 0;
	let found_array = [];
	let prev_or_next_array = ['previous', 'next', 'parallels', 'parents', 'childs', 'dependent', 'masters', 'linked'];
	let prev_or_next;
	let prev_or_next_el_id;
	for (let prev_or_next of prev_or_next_array){	
		for (let el_id_temp in elements_array){	
			let element = elements_array[el_id_temp];
			if (el_id_temp == 0 && prev_or_next == 'previous'){
				continue;
			}
			if (el_id_temp == (elements_array_length - 1) &&  prev_or_next == 'next'){
				continue;
			}
			for (let prev_or_next_el_id_temp in element['tech'][prev_or_next]){	
				let prev_or_next_el_id = element['tech'][prev_or_next][prev_or_next_el_id_temp];
				if (prev_or_next_el_id != undefined && find_id_in_the_chain(prev_or_next_el_id, elements_array)){
					if (found_array.indexOf(prev_or_next_el_id) == -1){
						elements_array_current_size++;
						found_array.push(prev_or_next_el_id);
						//console.log('current is: ' + prev_or_next_el_id);
					} 
				}
			}
		}
	}
	//console.log(elements_array_length + ' and ' + elements_array_current_size);
	if (elements_array_length == elements_array_current_size){
		return true;
	} else {
		return false;
	}
}
function each_sibling(target_element, callback_function, mode=undefined) {
	if (mode != undefined){
		for (let el_id in target_elem['tech'][mode]) {
			callback_function(target_element, mode, target_elem['tech'][mode][el_id]);
		}
	} else {
		let modes = ['previous', 'next', 'parallels', 'parents', 'childs', 'linked'];
		let mode;
		for (let mode_temp_id in modes){	
			mode = modes[mode_temp_id];
			for (let el_id in target_elem['tech'][mode]) {
				callback_function(target_element, mode, target_elem['tech'][mode][el_id]);
			}
		}
	}
}

let each_sibling_recursive_collector = [];
function each_sibling_recursive(target_element, real_target_id, callback_function, mode_in=undefined, mode_limit=undefined, mode_except=undefined, line_execption_array=undefined) {
	let modes = ['previous', 'next', 'parallels', 'parents', 'childs', 'linked'];
	let mode;
	let mode_and_id = '';
	let next_element;
	let temp_el_id;
	let target_element_id = target_element['tech']['id'];
	if (mode_limit != undefined){
		for (let el_id in target_element['tech'][mode]) {
			mode_and_id = temp_el_id + '_' + mode_in + '_' + el_id;
			if (each_sibling_recursive_collector.includes(mode_and_id)){
				continue;
			}
			each_sibling_recursive_collector.push(mode_and_id);
			callback_function(target_element, real_target_id, mode_in, target_element['tech'][mode][el_id]);
		}
	} else {
		real_target_id = callback_function(target_element, real_target_id, mode_in, target_element_id); // Сам элемент
		for (let mode_temp_id in modes){	
			mode = modes[mode_temp_id];
			if (mode_except != undefined){
				if (mode_except.includes(mode)){
					continue;
				}
			}
			if (line_execption_array != undefined){
				if (line_execption_array.includes(target_element_id + mode + real_target_id)){ // требует ввода понятия "связь"
					continue;
				}
			}
			for (let el_id in target_element['tech'][mode]) {
				mode_and_id = temp_el_id + '_' + mode + '_' + el_id;
				if (each_sibling_recursive_collector.includes(mode_and_id)){
					continue;
				}
				each_sibling_recursive_collector.push(mode_and_id);
				//callback_function(target_element, real_target_id, mode, target_element['tech'][mode][el_id]);
				temp_el_id = target_element['tech'][mode][el_id];
				next_element = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][temp_el_id];
				//console.log(next_element);
				// mode_limit и mode_except только для верхнего уровня:
				each_sibling_recursive(next_element, real_target_id, callback_function, mode, undefined, undefined, line_execption_array);
			}
		}
	}
}
function paste_element_callable(target_element, real_target_id, mode_in, el_id) {
	//console.log(real_target_id);
	//console.log(mode_in);
	//console.log(el_id);
	let new_el = new NewElement(real_target_id, mode_in, {
		'tech': {
			'parallels':[]
		}
	}, el_id);
	return new_el.id;
}
function paste_elements(el_id, mode_in) {
	let elements_array = copyObject(COPIED_ELEMENTS);
	let is_paste_recursive = jsid('is_paste_recursive').checked;
	if (!is_paste_recursive){
		for (let el_id_array in elements_array){
			each_sibling_recursive_collector = [];
			each_sibling_recursive(elements_array[el_id_array], el_id, paste_element_callable, mode_in, undefined, ['previous', 'next', 'parents', 'parallels']);
		}
	} else {
		let target_element = elements_array[0];
		let line_execption_array = [];
		for (let el_id_array in elements_array){
			if (el_id_array == 0){
				continue;
			}
			each_sibling_recursive_collector = [];
			each_sibling_recursive(elements_array[el_id_array], el_id, paste_element_callable, mode_in, undefined, undefined, line_execption_array);
		}

	}
	save_all();
	show_all();
}
function remove_link_execute(el_id_in, mode_in, temp_id_id_in) {
	let mode_an = mode_antagonist(mode_in);
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id_in]['tech'][mode_in].splice(temp_id_id_in, 1);
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][temp_id_id_in]['tech'][mode_an].splice(el_id_in, 1);
	hide_modal();
	save_all();
	show_all();
}
function remove_link(el_id_in, mode_in) {
	let element = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id_in];
	let PAGE_ELEMENTS = ELEMENTS[PROJECT_NAME][PAGE_NUMBER];
	let modal_content = '';
	let el_id_temp;
	if (sizeof(element['tech'][mode_in]) == 1){
		element['tech'][mode_in] = [];
		save_all();
		show_all();
	} else if (sizeof(element['tech'][mode_in]) > 1) {
		for (let el_id_id_temp in element['tech'][mode_in]){	
			el_id_temp = element['tech'][mode_in][el_id_id_temp];
			modal_content += '<a href="#" onclick="remove_link_execute(\'' + el_id_in + '\', \'' + mode_in + '\', \''+ el_id_id_temp + '\');return false;">' + PAGE_ELEMENTS[el_id_temp]['main']['description']['name'] + '(' + element['tech'][mode_in][el_id_id_temp] + ')' + '</a><br/>'
		}
		show_modal('Связь с каким элементом удалить?', modal_content);
	}
}
function add_link_execute(el_id_in, mode_in, elem_id_in) {
	Object.push(ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id_in]['tech'][mode_in], elem_id_in);
	let mode_an = mode_antagonist(mode_in);
	Object.push(ELEMENTS[PROJECT_NAME][PAGE_NUMBER][elem_id_in]['tech'][mode_an], el_id_in);
	hide_modal();
	save_all();
	show_all();
}
function add_link(el_id_in, mode_in) {
	let modal_content = '';
	let PAGE_ELEMENTS = ELEMENTS[PROJECT_NAME][PAGE_NUMBER];
	for (let el_id in PAGE_ELEMENTS){	
		if (PAGE_ELEMENTS[el_id] == undefined){
			continue;
		}
		modal_content += '<a href="#" onclick="add_link_execute(\'' + el_id_in + '\', \'' + mode_in + '\', \''+ PAGE_ELEMENTS[el_id]['tech']['id'] + '\');return false;">' + PAGE_ELEMENTS[el_id]['main']['description']['name'] + '(' + PAGE_ELEMENTS[el_id]['tech']['id'] + ')' + '</a><br/>'
	}
	show_modal('Какой элемент подключить?', modal_content);
}
function insert_object_to_element(el_id_in, object_name) {
	let is_first = true;
	let next_id;
	let next_id_first;
	for(let obj_id in FULL_READ_RESULT[object_name]) {
		if (is_first){
			next_id = new_childs_element(el_id_in);
			next_id_first = next_id;
			is_first = false;
		} else {
			next_id = new_next_element(next_id);
		}
		ELEMENTS[PROJECT_NAME][PAGE_NUMBER][next_id]['main']['content']['object'] = {};
		ELEMENTS[PROJECT_NAME][PAGE_NUMBER][next_id]['main']['description']['name'] = obj_id;
		ELEMENTS[PROJECT_NAME][PAGE_NUMBER][next_id]['main']['content']['object'] = FULL_READ_RESULT[object_name][obj_id];
	}
	hide_modal();
	save_all();
	START_POINT = next_id_first;
	show_all();
}
function clean_all() {
	ELEMENTS[PROJECT_NAME] = [];
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER] = [];
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][1] = copyObject(DEFAULT_ELEMENT);
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][1]['isListElement'] = true;
	ELEMENTS[PROJECT_NAME][PAGE_NUMBER][1]['main']['description']['name'] = 'Элементы';
	START_POINT = 1;
	show_all();
}
function go_backward(window_number) {
	select_window(window_number);
	let history_id = --HISTORY_ID[WINDOW_NUMBER];
	console.log(history_id);
	if (HISTORY[WINDOW_NUMBER][history_id] !== undefined){
		show_all(HISTORY[WINDOW_NUMBER][history_id], false);
	} else {
		console.log('HISTORY[WINDOW_NUMBER][history_id] не определён');
	}
}
function go_forward(window_number) {
	select_window(window_number);
	let history_id = ++HISTORY_ID[WINDOW_NUMBER];
	if (HISTORY[WINDOW_NUMBER][history_id] !== undefined){
		show_all(HISTORY[WINDOW_NUMBER][history_id], false);
	} else {
		console.log('HISTORY[WINDOW_NUMBER][history_id] не определён');
	}
}
function show_all(element_vector=undefined, save_step=true) {
	let history_id;
	if (element_vector == undefined){
		if (CURRENT_ELEMENT_VECTOR == undefined){
			element_vector = START_POINT;
		} else {
			element_vector = CURRENT_ELEMENT_VECTOR;
		}
	} 
	CURRENT_ELEMENT_VECTOR = element_vector;
	let start_element_vector = vector_by_vector(element_vector);

	if (save_step){
		if (HISTORY_ID[WINDOW_NUMBER] !== undefined){
			history_id = HISTORY_ID[WINDOW_NUMBER];
		} else {
			history_id = -1;
		}
		history_id++;
		HISTORY_ID[WINDOW_NUMBER] = history_id;
		if (HISTORY[WINDOW_NUMBER] == undefined){
			HISTORY[WINDOW_NUMBER] = [];
		}
		HISTORY[WINDOW_NUMBER][history_id] = [];
		HISTORY[WINDOW_NUMBER][history_id] = start_element_vector;
	}

	let start_element = element_by_vector(start_element_vector);
	let start_point = start_element['tech']['start_point'];
	let start_vector = [start_element_vector[0], start_element_vector[1], start_point];
	let collection = new ElementsCollector(start_vector);
	show_collection(collection);
	mark_selected();
	move_screen_to_current_position(WINDOW_ID + WINDOW_NUMBER);
	save_GLOBAL_PROPERTIES_to_localStorage();
}
document.addEventListener("DOMContentLoaded", function () {
	//show_all(1);
	clean_all();
	load_all();
	first_show_pages();
	test();
});
