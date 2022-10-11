let PROJECT_NAME = 'default';
let GLOBAL_PROPERTIES =  {
	i: 1, // итератор текущего слепка модели
};
function save_properties_on_disk_handler(msg_txt) {
	//console.log(msg_txt);	  
}
function save_properties_on_disk(load_type, content) {
	file_commander(
		{
			load_type: load_type,
			project_name: PROJECT_NAME,
			page_number: PAGE_NUMBER,
			mode: 'save',
			content: content
		}, save_properties_on_disk_handler);
}

function set_GLOBAL_PROPERTIES(GLOBAL_PROPERTIES_json) {
	let isLoaded = false;
	GLOBAL_PROPERTIES = JSON.parse( GLOBAL_PROPERTIES_json );
	if (GLOBAL_PROPERTIES['PROJECT_NAME'] != undefined){
		if (GLOBAL_PROPERTIES['PROJECT_NAME'] != undefined){
			PROJECT_NAME = GLOBAL_PROPERTIES['PROJECT_NAME'];
		}
		if (GLOBAL_PROPERTIES['PAGE_NUMBER'] != undefined){
			PAGE_NUMBER = GLOBAL_PROPERTIES['PAGE_NUMBER'];
		}
		if (GLOBAL_PROPERTIES['START_POINT']){
			START_POINT = GLOBAL_PROPERTIES['START_POINT'];
		}
		isLoaded = true;
	}
	return isLoaded;
}
function load_GLOBAL_PROPERTIES_from_localStorage() {
	let isLoaded = false;
	if (localStorage.getItem('GLOBAL_PROPERTIES') != undefined && localStorage.getItem('GLOBAL_PROPERTIES') != ''){
		isLoaded = set_GLOBAL_PROPERTIES( localStorage.getItem('GLOBAL_PROPERTIES') );
	}
	return isLoaded;
}

function load_properties_from_disk_handler(msg_txt) {
	let msg = JSON.parse(msg_txt);
	let project_name = msg['project_name'];
	if (msg['load_type'] == 'ELEMENTS'){
		if (msg['status'] == true && msg['result'] != ''){
			ELEMENTS[project_name] = JSON.parse(msg['result']);
		} else {
			show_GLOBAL_PROPERTIES();
		} 
		show_status(msg['comment']);
	} else if (msg['load_type'] == 'ELEMENTS_FORMATTED'){
		if (msg['status'] == true && msg['result'] != ''){
			ELEMENTS[project_name] = JSON.parse(json_unformatter(msg['result']));
		} else {
			show_GLOBAL_PROPERTIES();
		} 
		show_status(msg['comment']);
	} else if (msg['load_type'] == 'GLOBAL_PROPERTIES') {
		if (msg['status'] == true && msg['result'] != ''){
			if ( !set_GLOBAL_PROPERTIES(msg['result']) ){ 
				alert('Не удалось загрузить GLOBAL_PROPERTIES!');
			}
		}
	}
}
function load_properties_from_disk(load_type, project_name_in=PROJECT_NAME) {
	file_commander_sync(
		{
			load_type: load_type,
			project_name: project_name_in,
			page_number: PAGE_NUMBER,
			mode: 'load'
		}, load_properties_from_disk_handler); 
}
function load_GLOBAL_PROPERTIES() {
	if (!load_GLOBAL_PROPERTIES_from_localStorage()){
		load_properties_from_disk('GLOBAL_PROPERTIES');
	}
}
function load_project(project_name_in) {
	let ELEMENTS_temp;
	let result;
	if (localStorage.getItem('PROJECT_' + project_name_in) != undefined && localStorage.getItem('PROJECT_' + project_name_in) != ''){
		ELEMENTS_temp = localStorage.getItem('PROJECT_' + project_name_in);
	} 
	if ((ELEMENTS_temp != 'undefined') && ($.trim(ELEMENTS_temp) != "")) {
		ELEMENTS[project_name_in] = JSON.parse(ELEMENTS_temp);
	} else {
		load_properties_from_disk('ELEMENTS', project_name_in);
	}
}
function set_default_element() {
	if (ELEMENTS == undefined){
		ELEMENTS = [];
	}
	if (ELEMENTS[0] == undefined){
		ELEMENTS[0] = [];
	}
	if (ELEMENTS[0][0] == undefined){
		ELEMENTS[0][0] = [];
	}
	if (ELEMENTS[0][0][0] == undefined){
		ELEMENTS[0][0][0] = [];
	}
	ELEMENTS[0][0][0] = copyObject(DEFAULT_ELEMENT);
}
function load_all(isLoadGLOBAL_PROPERTIES=true) {
	if (isLoadGLOBAL_PROPERTIES){
		load_GLOBAL_PROPERTIES();
	}

	load_project(PROJECT_NAME);
	set_default_element();
	show_all(START_POINT);
}
function save_GLOBAL_PROPERTIES_to_localStorage() {
	GLOBAL_PROPERTIES['PROJECT_NAME'] = PROJECT_NAME;
	GLOBAL_PROPERTIES['PAGE_NUMBER'] = PAGE_NUMBER;
	GLOBAL_PROPERTIES['START_POINT'] = START_POINT;
	let GLOBAL_PROPERTIES_txt = JSON.stringify(GLOBAL_PROPERTIES);
	localStorage.setItem('GLOBAL_PROPERTIES', GLOBAL_PROPERTIES_txt);
	return GLOBAL_PROPERTIES_txt;
}
function save_all() {
	let ELEMENTS_txt = JSON.stringify(ELEMENTS[PROJECT_NAME]);
	localStorage.setItem('PROJECT_' + PROJECT_NAME, ELEMENTS_txt);
	let GLOBAL_PROPERTIES_txt = save_GLOBAL_PROPERTIES_to_localStorage();
	//localStorage.setItem('ELEMENTS', ELEMENTS_txt);
	save_properties_on_disk('ELEMENTS', ELEMENTS_txt);
	save_properties_on_disk('GLOBAL_PROPERTIES', GLOBAL_PROPERTIES_txt);
}
function save_formatted() {
	let ELEMENTS_txt = JSON.stringify(ELEMENTS[PROJECT_NAME]);
	save_properties_on_disk('ELEMENTS_FORMATTED', json_formatter(ELEMENTS_txt));
}
function to_linear_obj() {
	let current_element = new ElementControl(ACTIVE_ELEMENT);
	let linear_object = current_element.to_linear();
	let linear_object_txt = JSON.stringify(linear_object);
	alert(linear_object_txt);
}
function clean_files() {
	if (confirm('Удалить все файлы?')){
		save_properties_on_disk('CLEAN_FILES', '');
		clean_all();
	}
}
function load_formatted() {
	load_properties_from_disk('ELEMENTS_FORMATTED');
	set_default_element();
	show_all(START_POINT);
}
function open_project(project_name) {
	PROJECT_NAME = project_name;
	START_POINT = 1;
	load_all(false);
}
