function get_json_result(msg_txt) {
	return JSON.parse(msg_txt)['result'];
}
function default_json_handler(json_txt) {
	let full_read_result = {};
	full_read_result = get_json_result(msg_txt);
	let names_list = show_object_names_list(el_id, full_read_result);
	show_modal('Выберите имя объекта из файла:', names_list);
}
function file_commander(input_object_command, output_handler) {
	$.ajax( {
		type: "POST",
		url: "/mola/save_load.php",
		data:  input_object_command,
		success: output_handler,
		dataType: 'text'
	});
}
function file_commander_sync(input_object_command, output_handler) {
	$.ajax( {
		type: "POST",
		url: "/mola/save_load.php",
		data:  input_object_command,
		success: output_handler,
		async: false, 
		dataType: 'text'
	});
}
function exec_commander(input_object_command, output_handler) {
	$.ajax( {
		type: "POST",
		url: "/executor/index.php",
		data:  input_object_command,
		success: output_handler,
		dataType: 'text'
	});
}
function show_object_names_list(el_id, object_in) {
	let result = '';
	for (let object_name in object_in) {
		result  += '<a href="#" onclick="insert_object_to_element(' + el_id + ', \'' + object_name + '\'); return false;">' + object_name + '</a><br/>';
	}
	return result;
}

function read_file_handler(msg_txt) {
	let full_read_result = get_json_result(msg_txt);
	let names_list = show_object_names_list(el_id, full_read_result);
	show_modal('Выберите имя объекта из файла:', names_list);
}
function read_file() {
	file_commander({read_file_name: file_name}, read_file_handler);
}
function read_php(el_id) {
	let file_name = ELEMENTS[PROJECT_NAME][PAGE_NUMBER][el_id]['main']['content']['file'];
	if (file_name != ''){
		read_file(el_id, file_name);
	} else {
		alert('Не задан файл!');
	}
}

function vim_open_file_handler(msg_txt) {
	if (msg_txt == '1'){
		show_status('Файл открыт!');
	}
}
function vim_open_file() {
	exec_commander(
	{
		vim_open_file_name: file_name,
		page_number: page_number,
		mode: 'load'
	}, 
	vim_open_file_handler);
}
function open_file(el_id) {
	let el_temp = ELEMENTS[page_number][el_id];
	let file_name = ELEMENTS[page_number][el_id]['main']['content']['file'];
	if (file_name != undefined && file_name.trim() != ''){
		vim_open_file(file_name);
	} else {
		show_element_info(el_id);
	}
}

function read_folder_handler(msg_txt) {
	jsid('main_window' + WINDOW_NUMBER).classList.remove('display_horizontal');
	let full_read_result = {};
	let result = '';
	full_read_result = get_json_result(msg_txt);
	for (let temp_id in full_read_result){	
		result += '<a href="#" onclick="open_project(\'' + full_read_result[temp_id]['file_name'] + '\');return false;">' + full_read_result[temp_id]['file_name'] + '</a><br/>';
	}
	jsid('main_window' + WINDOW_NUMBER).innerHTML = result;
}
function read_folder(path) {
	file_commander({read_folder: path}, read_folder_handler);
}
