<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
<style>
.element {
	border: 1px solid #000;		
	width: 350px;
	margin-top: 300px;
}
.previous_elements, .next_elements {
	height: 20px;
	border: 1px solid #000;		
	position: absolute;
	top: -130px;
}
</style>
<script>
	function get_element_html_id() {
		return 'new_element_id1';
	}
	function new_previous_element_parallel() {
		return 'new_element_id1';
	}
	function change_element_name() {
		return 'new_element_id1';
	}
	function open_file() {
		return 'new_element_id1';
	}
	function read_php() {
		return 'new_element_id1';
	}
	function roll_up() {
		return 'new_element_id1';
	}
	function show_element_info() {
		return 'new_element_id1';
	}
	function new_parents_element_parallel() {
		return 'new_element_id1';
	}
	function new_parents_element_between() {
		return 'new_element_id1';
	}
	function paste_next() {
		return 'new_element_id1';
	}
	let class_name = 'new_class';
	let window_id = '';
	let data = {};
	data['tech'] = {};
	data['tech']['id'] = 1;
	data['main'] = {};
	data['main']['description'] = {};
	data['main']['description']['name'] = 'name';
	let PROJECT_NAME = 'PROJECT_NAME';
	let PAGE_NUMBER = 'PAGE_NUMBER';
	let parents_line = 'parents_line';
	let childs_line = 'childs_line';
	let add_extend_properties = 'add_extend_properties';
	let element_html = '\
<div class="element element' + class_name + '" id="' + get_element_html_id(window_id, data.tech.id) + '">\
	<div class="previous_elements" id="previous_' + get_element_html_id(window_id, data.tech.id) + '"></div>\
	<div class="name">\
		<button onclick="toggle_element_selected(' + data.tech.id + ')" class="number" style="width: 2em;">' + data.tech.id + '</button>\
		<button onclick="new_previous_element_parallel(' + data.tech.id + ')" style="width: 2em;" title="New previous element parallel">+</button>\
		<button onclick="new_previous_element_between(' + data.tech.id + ')" style="width: 2em;" title="New previous element">|+|</button>\
		<input type="text" value="' + data.main.description.name + '" onchange="change_element_name(\'' + data.tech.id + '\', this)"/>\
	</div>\
	<div class="control">\
		<button onclick="open_file(' + data.tech.id + ')">File</button>\
		<button onclick="read_php(' + data.tech.id + ')">R PHP</button>\
		<button>Txt</button>\
		<button>Obj</button>\
		<button>Arr</button>\
		<button onclick="roll_up(' + data.tech.id + ')">h</button>\
		<button onclick="show_element_info([\'' + PROJECT_NAME + '\', ' + PAGE_NUMBER + ',' + data.tech.id + '])">i</button>\
	</div>\
	<div class="block_to_hide">\
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
			<button onclick="paste_next(' + data.tech.id + ')" title="Paste next element">Paste</button>\
			' + add_extend_properties + '\
		</div>\
	</div>\
	<div class="next_elements" id="next_' + get_element_html_id(window_id, data.tech.id) + '"></div>\
</div>\
';
</script>
</head>
<body>
	<div id="main_target"></div>
</body>
<script>
	document.getElementById('main_target').innerHTML = element_html;
	//document.getElementById('previous_new_element_id1').innerHTML = element_html;
	document.getElementById('next_new_element_id1').innerHTML = element_html;
</script>
</html>
