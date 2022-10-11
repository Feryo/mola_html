<?php

$mode = $_POST['mode'];
$load_type = $_POST['load_type'];
$content = $_POST['content'];

$result = [
	'result' => '',
	'comment' => '',
	'load_type' => $load_type,
	'page_number' => '',
	'status' => false
];

if ($mode == 'save' && $load_type == 'ELEMENTS'){
	$page_number = $_POST['page_number'];
	file_put_contents("save/page_properties/page_$page_number.txt", $content);
	$result['status'] = true;
	$result['page_number'] = $page_number;
	$result['comment'] = 'BLADE_PAGE_PROPERTIES_JSON сохранён';
} else if ($mode == 'load' && $load_type == 'ELEMENTS') {
	$page_number = $_POST['page_number'];
	$result['status'] = true;
	$result['result'] = file_get_contents("save/page_properties/page_$page_number.txt");
	$result['comment'] = 'ELEMENTS загружен с диска';
}

echo json_encode($result);
