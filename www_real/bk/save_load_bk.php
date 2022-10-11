<?php
class Save_load {
	private $base_path = '/home/tornado2/www/';
	function __construct() {
		// Init
		$result = [
			'result' => '',
			'comment' => '',
			'load_type' => $load_type,
			'page_number' => '',
			'status' => false
		];
		if (!empty($_POST)){
			foreach($_POST as $get_name=>$get_value){	
				$$get_name = $_POST[$get_name];
			}
		}
		if (!empty($_GET)){
			foreach($_GET as $get_name=>$get_value){	
				$$get_name = $_GET[$get_name];
			}
		}

		//Body
		if (!empty($read_folder)){
			$folder_path = $this->filter_file_path($read_folder);
			$result = $this->read_folder($folder_path);
		}
		if (!empty($read_file_name)){
			$read_file_name = $this->filter_file_path($read_file_name);
			if (file_exists($read_file_name)){
				$var_names = $this->get_var_names_from_file($read_file_name);
				if (!empty($var_names)){
					include($read_file_name);
					foreach ($var_names as $var_name){	
						if (!empty($$var_name)){
							$result[$var_name] = $$var_name;
						}
						unset($$var_name);
						//var_dump($$var_name);
					}
				}
			}
		}
		if (!empty($mode) && !empty($load_type) && !empty($content) && !empty($project_name)){
			$props = $this->import_props("projects/$project_name/props.php");
			if ($mode == 'save' && $load_type == 'ELEMENTS'){
				$page_number = $_POST['page_number'];
				mkdir("projects/$project_name/pages/$page_number/", 0777, true);
				while (file_exists("projects/$project_name/pages/$page_number/page_$i.txt")){
					$i++;
				}
				file_put_contents("projects/$project_name/pages/$page_number/page_$i.txt", $content);
				$result['status'] = true;
				$result['page_number'] = $page_number;
				$result['comment'] = 'BLADE_PAGE_PROPERTIES_JSON сохранён';
			} else if ($mode == 'load' && $load_type == 'ELEMENTS') {
				$page_number = $_POST['page_number'];
				$result['status'] = true;
				$result['result'] = file_get_contents("projects/$project_name/pages/$page_number/page_$i.txt");
				$result['comment'] = 'ELEMENTS загружен с диска';
			}
			$this->export_props("projects/$project_name/props.php",  $props);
		}

		//Output
		if (!empty($result)){
			$this->output_array($result);
		}
	}
	function filter_file_path($name_var) {
		preg_match("/[0-9\w\/\абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ_.]+?/Umsi", $name_var, $result);
		return $result[0];
	}
	function read_folder($dir) {
		$result = [];
		$current_file_info = [];
		if ($dir[0] != '/'){
			if (is_dir($this->base_path.$dir)){
				$dir = $this->base_path.$dir;
			} else {
				return false;
			}
		}
		if (is_dir($dir)) {
			if ($dh = opendir($dir)) {
				while (($file = readdir($dh)) !== false) {
					if ($file != '.' && $file != '..'){
						$current_file_info['file_name'] = $file; 
						$current_file_info['full_file_name'] = $dir.$file; 
						$current_file_info['file_type'] = filetype($dir.$file); 
						$result[] = $current_file_info;
					}
				}
				closedir($dh);
			}
		}
		return $result;
	}
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
	function output_array($array_in) {
		$result = json_encode($array_in);
		echo $result;
	}
	function import_props($full_file_name) {
		eval( file_get_contents($full_file_name) );
		return $i;
	}
	function export_props($full_file_name, $props) {
		file_put_contents($full_file_name, var_export($props));
	}
}
$save_load = new Save_load();

$props = [
	'i'=>1,
];

$mode = $_POST['mode'];
$load_type = $_POST['load_type'];
$content = $_POST['content'];
$project_name = $_POST['project_name'];

$result = [
	'result' => '',
	'comment' => '',
	'load_type' => $load_type,
	'page_number' => '',
	'status' => false
];

$props = $save_load->import_props("projects/$project_name/props.php");

if (empty($i)){
	$i=1;
}

if ($mode == 'save' && $load_type == 'ELEMENTS'){
	$page_number = $_POST['page_number'];
	mkdir("projects/$project_name/pages/$page_number/", 0777, true);
	while (file_exists("projects/$project_name/pages/$page_number/page_$i.txt")){
		$i++;
	}
	file_put_contents("projects/$project_name/pages/$page_number/page_$i.txt", $content);
	$result['status'] = true;
	$result['page_number'] = $page_number;
	$result['comment'] = 'BLADE_PAGE_PROPERTIES_JSON сохранён';
} else if ($mode == 'load' && $load_type == 'ELEMENTS') {
	$page_number = $_POST['page_number'];
	$result['status'] = true;
	$result['result'] = file_get_contents("projects/$project_name/pages/$page_number/page_$i.txt");
	$result['comment'] = 'ELEMENTS загружен с диска';
}
$save_load->export_props("projects/$project_name/props.php",  $props);

echo json_encode($result);
