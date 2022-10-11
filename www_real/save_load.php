<?php
class Save_load {
	private $base_path = __DIR__.'/';
	private $php_props;
	private $save_i;
	function __construct() {
		// Init
		$result = [
			'result' => '',
			'comment' => '',
			'load_type' => 'not set',
			'project_name' => '',
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
		if (!empty($load_type)){
			$result['load_type'] = $load_type;
		}

		//Body
		//Содержимое папки
		if (!empty($read_folder)){
			$folder_path = $this->filter_file_path($read_folder);
			$result['result'] = $this->read_folder($folder_path);
		}
		//Содержимое PHP-модели
		if (!empty($read_file_name)){
			$read_file_name = $this->filter_file_path($read_file_name);
			if (file_exists($read_file_name)){
				$var_names = $this->get_var_names_from_file($read_file_name);
				if (!empty($var_names)){
					include($read_file_name);
					foreach ($var_names as $var_name){	
						if (!empty($$var_name)){
							$result['result'][$var_name] = $$var_name;
						}
						unset($$var_name);
						//var_dump($$var_name);
					}
				}
			}
		// Свойства проекта
		} else if (!empty($project_name)){
			$result['project_name'] = $project_name;
			$this->import_props("projects/$project_name/php_props.json");
			//Загрузка главных свойств
			if (!empty($load_type) && $load_type == 'GLOBAL_PROPERTIES' && !empty($mode) && $mode == 'load'){
				$result['result'] = file_get_contents("projects/$project_name/js_props.json");
				$result['status'] = true;
			} else
			if (!empty($load_type) && $load_type == 'GLOBAL_PROPERTIES' && !empty($mode) && $mode == 'save' && !empty($content)){
				if ( file_put_contents("projects/$project_name/js_props.json", $content) !== false){
					$result['status'] = true;
				}
			} else
			//Загрузка папки проекта
			if (!empty($load_type) && !empty($page_number) && !empty($mode) && !empty($project_name)){
				if ($mode == 'save' && $load_type == 'ELEMENTS' && !empty($content)){
					if (!is_dir("projects/$project_name/pages/$page_number/")){
						mkdir("projects/$project_name/pages/$page_number/", 0777, true);
					}
					while (file_exists("projects/$project_name/pages/$page_number/page_$this->save_i.txt")){
						$this->save_i++;
					}
					file_put_contents("projects/$project_name/pages/$page_number/page_$this->save_i.txt", $content);
					$result['status'] = true;
					$result['page_number'] = $page_number;
					$result['comment'] = 'ELEMENTS сохранён';
				} else if ($mode == 'load' && $load_type == 'ELEMENTS') {
					$page_number = $_POST['page_number'];
					$result['status'] = true;
					$result['result'] = file_get_contents("projects/$project_name/pages/$page_number/page_$this->save_i.txt");
					$result['comment'] = 'ELEMENTS загружен с диска';
				} else

				if ($mode == 'save' && $load_type == 'ELEMENTS_FORMATTED' && !empty($content)){
					file_put_contents("ELEMENTS_json.txt", $content);
					$result['status'] = true;
					$result['page_number'] = $page_number;
					$result['comment'] = 'ELEMENTS_json.txt сохранён';
				} else if ($mode == 'load' && $load_type == 'ELEMENTS_FORMATTED') {
					$page_number = $_POST['page_number'];
					$result['status'] = true;
					$result['result'] = file_get_contents("ELEMENTS_json.txt");
					$result['comment'] = 'ELEMENTS_json.txt загружен с диска';
				} else if ($load_type == 'CLEAN_FILES' && empty($content)){
					echo shell_exec("rm ./projects/default/pages/$page_number/*");
					$this->save_i = 1;
				}
			}
			$this->export_props("projects/$project_name/php_props.json");
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
					if ($file != '.' && $file != '..' && $file != 'php_props.json'){
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
	function import_props($prop_file_path) {
		$prop_file_path = $this->base_path.$prop_file_path;
		$props_txt = file_get_contents($prop_file_path);
		$php_props = json_decode($props_txt);
		if (!empty($php_props->save_i)){
			$this->save_i = intval($php_props->save_i);
			if ($this->save_i >= 1){
			} else {
				$this->save_i = 1;
			}
		} else {
			$this->save_i = 1;
		}
		$this->php_props = $php_props;
	}
	function export_props($full_file_name) {
		$this->php_props->save_i = $this->save_i;
		file_put_contents($full_file_name, json_encode($this->php_props));
	}
}
$save_load = new Save_load();
