<?php
$_POST['file_name'] = '/home/10e10.ru/php/models/model.php';

function get_var_names_from_file($file_name) {
	$file_content = file_get_contents($file_name);
	preg_match_all('/^\s*+\$([\w]+?)/Umsi', $file_content, $preg_var_names);
	$var_names_array;
	$var_names_uniq;
	//var_dump($preg_var_names);
	foreach ($preg_var_names[1] as $preg_var_id1){	
		$var_names_array[] = $preg_var_id1;
	}
	$var_names_uniq = array_unique($var_names_array);
	return $var_names_uniq;
}

if (!empty($_POST['file_name'])){
	$file_name = $_POST['file_name'];
	if (file_exists($file_name)){
		$var_names = get_var_names_from_file($file_name);
		if (!empty($var_names)){
			include($file_name);
			$result = [];
			foreach ($var_names as $var_name){	
				if (!empty($$var_name)){
					$result[$var_name] = $$var_name;
				}
				//var_dump($$var_name);
			}
			echo json_encode($result);
			//var_dump($var_names);
		}
	}
}
