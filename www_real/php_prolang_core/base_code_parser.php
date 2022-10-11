<?php
define('TIME_OUT_STEPS_NORMAL', 0);
class BaseCodeParser {
	// Полный текст
	static $file_content;
	static $symbol_position;
	static $file_content_length;

	// Языковые конструкции языка
	static $lang_constructions;

	// Результирующие параметры разбора
	static $code_status;
	static $code_options;
	static $functions;
	static $made_operations;

	// Переменные выполнения
	static $memory_current;
	static $memory_previous;
	static $memory_next;
	static $current_function;
	static $found_var;
	static $found_vars;
	static $memory_siblings;
	static $code_siblings;
	static $memory_siblings_options;
	static $memory_array;
	static $code_array;
	static $char;
	static $char_timer_off_array;
	static $command_timer_off_array;

	// Первичная настройка
	static function init() {
		self::$memory_array = [];
		self::$memory_siblings_options = [];
		self::$code_options = [];
		self::$functions = [];
		self::$code_siblings = [];
		self::$found_var = [];
		self::$found_vars = [];

		self::$code_status = [];
		self::$code_status['brace_level'] = 0;
		self::$code_status['bracket_level'] = 0;
		self::$code_status['square_bracket_level'] = 0;
		self::$symbol_position = -1;
		self::set_lang_constructions();
	}
	// Исполнение статического объекта
	static function make($file_path) {
		self::init();
		self::$file_content = file_get_contents($file_path);	
		self::$file_content_length = strlen(self::$file_content);
		
		while (self::$symbol_position <= self::$file_content_length){

			// Перейти к следующему символу (параллельный анализ)
			self::next_char();

			// Таймер отключения, отсчитывающий каждый символ, отключающий флаги заданные с помощью set_char_timer_off($timer_off_id, $target_array, $steps)
			self::char_timer_off();

			// Запись в результирующие переменные по ID
			self::char_saver('set_class_name', 'code_options', 'class_name');
			self::char_saver('set_var_name', 'found_var', 'name');
			self::char_saver('set_function_name', 'current_function', 'name');
			self::char_saver('set_function_args', 'current_function', 'args');
			self::char_saver('set_function_content', 'current_function', 'content');

			// Гарантированная попытка исполнения команд в собранном массиве $memory_array и его обнуление
			if (self::$char !== '' && (self::$char == ' ' || self::$char == '	' )){
				self::is_in_lang();
				self::make_operation();
				self::$memory_array = [];

			// Сбор в массив $memory_array и попытка исполнения его команд, если они есть
			} else if (self::is_first_char()){
				self::add_char();
				self::$memory_array[] = self::$char;
				//echo 'memory_array='."\n";
				//var_dump(self::$memory_array);
				self::is_in_lang();
				self::make_operation();

			// Просто добавить символ
			} else {
				self::add_char();
			}

			// Дебагинг
			//echo self::$char;
			//echo 'code_options'."\n";
			//var_dump(self::$code_options);
		}
		//echo "\n".'code_array';
		//var_dump(self::$code_array);
		//echo '$code_status[set_class_name]'."\n";
		//var_dump(self::$code_status['set_class_name']);
		//echo '$self::$functions'."\n";
		//var_dump(self::$code_status);
		var_dump(self::$code_options);
		var_dump(self::$current_function);

	}
	static function save_prev($memory) {
		if (!empty(self::$memory_siblings['current'])){
			self::$memory_siblings['prev'] = self::$memory_siblings['current'];
		}
		self::$memory_siblings['current'] = $memory;
	}
	static function set_prev_code($code_status_id, $code_value) {
		self::$code_array[] = [$code_status_id=>$code_value];
		self::$code_siblings['prev'] = [$code_status_id=>$code_value];
	}
	static function is_prev_code($code_status_id) {
		if (!empty(self::$code_siblings['prev']) && !empty(self::$code_siblings['prev'][$code_status_id]) && self::$code_siblings['prev'][$code_status_id] ){
			return true;
		} else {
			return false;
		}
	}
	static function add_char() {
		$char = self::$char;
		foreach (self::$memory_array as $memory_id=>$memory) {
			self::$memory_array[$memory_id] .= $char; 
		}
	}
	static function is_first_char() {
		$char = self::$char;
		foreach (self::$lang_constructions as $lc=>$lc_id) {
			if (mb_substr($lc, 0, 1) == $char){
				return true;
			}
		}
		return false;
	}
	static function char_saver($code_status, $target, $target_id) {
		$char = self::$char;
		if (self::is_code_status($code_status)){
			if ($target == 'current_function'){
				if (!empty(self::$current_function[$target_id])){
					self::$current_function[$target_id] .= $char;
				} else {
					self::$current_function[$target_id] = $char;
				}
			} else if ($target == 'code_options') {
				if (!empty(self::$code_options[$target_id])){
					self::$code_options[$target_id] .= $char;
				} else {
					self::$code_options[$target_id] = $char;
				}
			} else if ($target == 'found_var') {
				if (!empty(self::$found_var[$target_id])){
					self::$found_var[$target_id] .= $char;
				} else {
					self::$found_var[$target_id] = $char;
				}
			}
		} /*else {
			if ($target == 'current_function'){
				self::$current_function[$target_id] = '';
			} else if ($target == 'code_options') {
				self::$code_options[$target_id] = '';
			}
		}*/
	}
	static function save_code_sibling_to($target, $field_name, $sibling, $set_options=[]) {
		if (!empty(self::$memory_siblings_options)){
			foreach (self::$memory_siblings_options as $s_option) {
				$field_name_opt = $s_option['field_name'];
				if ($target == 'current_function'){
					self::$current_function[$field_name_opt] = self::$memory_siblings['current'];
				} else if ($target == 'code_options') {
					self::$code_options[$field_name_opt] = self::$memory_siblings['current'];
				}
			}
			self::$memory_siblings_options = [];
		}
		if ($sibling == 'current' || $sibling == 'prev'){
			if ($target == 'current_function'){
				self::$current_function[$field_name] = self::$memory_siblings[$sibling];
			} else if ($target == 'code_options') {
				self::$code_options[$field_name] = self::$memory_siblings[$sibling];
			}
		} else if ($sibling == 'next') {
			self::$memory_siblings_options[] = ['field_name'=>$field_name];
			foreach ($set_options as $option_name=>$option_value) {
				self::$code_status[$option_name] = $option_value;
			}
		}
	}
	static function code_status_off($code_status_id) {
		if (empty(self::$code_status[$code_status_id])){
			self::$code_status[$code_status_id] = true;
		} else {
			self::$code_status[$code_status_id] = false;
		}
	}
	static function is_code_status($code_status_id) {
		if (!empty(self::$code_status[$code_status_id])){
			return true;
		} else {
			return false;
		}
	}
	static function next_char() {
		self::$symbol_position++;
		self::$char = mb_substr(self::$file_content, self::$symbol_position, 1);
	}
	static function set_lang_constructions() {
		self::$lang_constructions = [
			//'Конструкция'=>'Логическое значение конструкции', 
			// self::$code_status[]:
			'<?php'=>0, 
			'<?'=>1, // 0, 1 - начало кода - php_started (true, false)
			'?>'=>2, // 2 - конец кода
			'//'=>3, // 3 - начало однострочного комментария - line_comment (true, false)
			'/*'=>4, // 4 - начало многострочного комментария - multiline_comment (true, false)
			'*/'=>5, // 5 - конец многострочного комментария -
			'class'=>6,  // 6 - начало класса - set_class_name (true, false)
			'static'=>7, // 7 - статический модификатор - set_function_modifier (true, false)
			'public'=>8, // 8 - публичный модификатор -
			'private'=>9, // 9 - частный модификатор -
			'protected'=>10, // 10 - защищённый модификатор -
			'function'=>11, // 11 - имя функции - set_function_name (true, false)
			'{'=>12, // 12 - вход в блок - brace_opened (true, false)
			'}'=>13, //	13 - выход из блока - brace_closed (true, false)
			'('=>14, // 14 - открытие круглой скобки - bracket_opened (true, false)
			')'=>15, // 15 - закрытие круглой скобки - bracket_closed (true, false)
			'['=>16, // 16 - открытие квадратной скобки - square_bracket_opened (true, false)
			']'=>17, // 17 - закрытие квадратной скобки - square_bracket_closed (true, false)
			"'"=>18, // 18 - начало и конец строки с одной ковычкой - one_quote_string (true, false)
			'"'=>19, // 19 - начало и конец строки с двумя ковычками - two_quote_string (true, false)
			"\r"=>20, // 20 - перенос строки R-типа - next_line_r (true, false)
			"\n"=>21, // 21 - перенос строки N-типа - next_line_n (true, false)
			"$"=>22, // 22 - переменная - set_var_name (true, false)
			";"=>23, // 23 - точка с запятой - set_semicolon (true, false)
			"="=>24, // 24 - равно - set_equal (true, false)
		];
	}
	/*
	 * self::$code_status[]:
	 * 
	 * comment (true, false)
	 * function_modifier_set (true, false) - make_operation
	 * function_name_set (true, false) - make_operation
	 * brace_level (int)
	 * bracket_level (int)
	 * square_bracket_level (int)
	 * quote_string (true, false)
	 * next_line (true, false)
	 *
	 * class_name_set (true, false) - make_operation
	 * set_function_content (true, false) - make_operation
	 */



	static function is_in_lang() {
		foreach (self::$memory_array as $memory_id=>$memory) {
			if (!empty(self::$lang_constructions[$memory])){
				$fp = self::$lang_constructions[$memory];
				self::save_prev($memory);
			} else {
				continue;
			}
			//echo 'fp = '.$fp.'; $memory='.$memory."\n";


			if ($fp !== false ){
				if (in_array($fp, [0, 1])){
					if (self::is_not_comment_or_string()){
						self::$code_status['php_started'] = true;
					}
				} else if (in_array($fp, [2])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['php_started'] = false;
						self::set_prev_code('php_started', false);
					}
				} else if (in_array($fp, [3])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['line_comment'] = true;
						self::$code_status['comment'] = true;
						self::set_prev_code('comment', true);
					}
				} else if (in_array($fp, [4])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['multiline_comment'] = true;
						self::$code_status['comment'] = true;
						self::set_prev_code('comment', true);
					}
				} else if (in_array($fp, [5])) {
					if (self::is_not_string()){
						self::$code_status['multiline_comment'] = false;
						self::$code_status['comment'] = false;
						self::set_prev_code('comment', false);
					}
				} else if (in_array($fp, [6])) {
					if (self::is_not_comment_or_string()){
						if (self::is_prev_code('next_line')){
							self::$code_status['set_class_name'] = true;
							self::set_prev_code('set_class_name', true);
						}
					}
				} else if (in_array($fp, [7, 8, 9, 10])) {
					if (self::is_not_comment_or_string()){
						if (!self::is_code_status('function_modifier_set')){
							self::$code_status['set_function_modifier'] = true;
							self::set_prev_code('set_function_modifier', true);
						}
					}
				} else if (in_array($fp, [11])) {
					if (self::is_not_comment_or_string()){
						if (!self::is_code_status('function_modifier_set')){
							self::$code_status['set_function_name'] = true;
							self::set_prev_code('set_function_name', true);
						}
					}
				} else if (in_array($fp, [12])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['brace_opened'] = true;
						self::set_prev_code('brace_opened', true);
						self::set_char_timer_off('brace_opened', 'code_status', TIME_OUT_STEPS_NORMAL);
						self::$code_status['brace_level'] += 1;
					}
				} else if (in_array($fp, [13])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['brace_closed'] = true;
						self::set_prev_code('brace_closed', true);
						self::set_char_timer_off('brace_closed', 'code_status', TIME_OUT_STEPS_NORMAL);
						self::$code_status['brace_level'] -= 1;
					}
				} else if (in_array($fp, [14])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['bracket_opened'] = true;
						self::set_prev_code('bracket_opened', true);
						self::set_char_timer_off('bracket_opened', 'code_status', TIME_OUT_STEPS_NORMAL);
						self::$code_status['bracket_level'] += 1;
					}
				} else if (in_array($fp, [15])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['bracket_closed'] = true;
						self::set_prev_code('bracket_closed', true);
						self::set_char_timer_off('bracket_closed', 'code_status', TIME_OUT_STEPS_NORMAL);
						self::$code_status['bracket_level'] -= 1;
					}
				} else if (in_array($fp, [16])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['square_bracket_opened'] = true;
						self::set_prev_code('square_bracket_opened', true);
						self::set_char_timer_off('square_bracket_opened', 'code_status', TIME_OUT_STEPS_NORMAL);
						self::$code_status['square_bracket_level'] += 1;
					}
				} else if (in_array($fp, [17])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['square_bracket_closed'] = true;
						self::set_prev_code('square_bracket_closed', true);
						self::set_char_timer_off('square_bracket_closed', 'code_status', TIME_OUT_STEPS_NORMAL);
						self::$code_status['square_bracket_level'] -= 1;
					}
				} else if (in_array($fp, [18])) {
					if (!self::is_code_status('comment') && !self::is_code_status('two_quote_string')){
						if (self::is_code_status('one_quote_string')){
							self::$code_status['one_quote_string'] = false;
							self::$code_status['quote_string'] = false;
							self::set_prev_code('quote_string', false);
						} else {
							self::$code_status['one_quote_string'] = true;
							self::$code_status['quote_string'] = true;
							self::set_prev_code('quote_string', true);
						}
					}
				} else if (in_array($fp, [19])) {
					if (!self::is_code_status('comment') && !self::is_code_status('one_quote_string')){
						if (self::is_code_status('two_quote_string')){
							self::$code_status['two_quote_string'] = false;
							self::$code_status['quote_string'] = false;
							self::set_prev_code('quote_string', false);
						} else {
							self::$code_status['two_quote_string'] = true;
							self::$code_status['quote_string'] = true;
							self::set_prev_code('quote_string', true);
						}
					}
				} else if (in_array($fp, [22])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['set_var_name'] = true;
						self::set_prev_code('set_var_name', true);
						self::set_char_timer_off('set_var_name', 'code_status', TIME_OUT_STEPS_NORMAL);
					}
				} else if (in_array($fp, [23])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['set_semicolon'] = true;
						self::set_prev_code('set_semicolon', true);
						self::set_char_timer_off('set_semicolon', 'code_status', TIME_OUT_STEPS_NORMAL);
					}
				} else if (in_array($fp, [24])) {
					if (self::is_not_comment_or_string()){
						self::$code_status['set_equal'] = true;
						self::set_prev_code('set_equal', true);
						self::set_char_timer_off('set_equal', 'code_status', TIME_OUT_STEPS_NORMAL);
					}
				}

				if (in_array($fp, [20])) {
					self::$code_status['next_line_r'] = true;
					self::set_char_timer_off('next_line_r', 'code_status', TIME_OUT_STEPS_NORMAL);
					self::$code_status['next_line'] = true;
					self::set_prev_code('next_line', true);
					self::set_char_timer_off('next_line', 'code_status', TIME_OUT_STEPS_NORMAL);

					self::$memory_array = [];

				} else if (in_array($fp, [21])) {
					self::$code_status['next_line_n'] = true;
					self::set_char_timer_off('next_line_n', 'code_status', TIME_OUT_STEPS_NORMAL);
					self::$code_status['next_line'] = true;
					self::set_prev_code('next_line', true);
					self::set_char_timer_off('next_line', 'code_status', TIME_OUT_STEPS_NORMAL);

					self::$memory_array = [];

				} 

			}
		}
	}
	static function make_operation() {
		// Задать имя класса
		$is_found = false;
		if (self::is_code_status('set_class_name') && (self::is_code_status('brace_opened') || self::is_code_status('bracket_opened'))){
			if (!self::is_code_status('class_name_set')){
				/*echo 'brace_opened'."\n";
				var_dump(self::is_code_status('brace_opened'))."\n";
				echo 'bracket_opened'."\n";
				var_dump(self::is_code_status('bracket_opened'))."\n";*/
	

				self::$code_status['set_class_name'] = false;
				self::set_prev_code('set_class_name', false);
				self::$code_status['class_name_set'] = true;
				$is_found = true;
			}
		} 
		// Задать модификатор функции
		if (self::is_code_status('set_function_modifier') && !self::is_code_status('function_modifier_set')){
			self::save_code_sibling_to('current_function', 'modifier', 'current');
			self::$code_status['set_function_modifier'] = false;
			self::set_prev_code('set_function_modifier', false);
			$is_found = true;
		}
		// Задать имя функции
		if (self::is_code_status('set_function_name') && self::is_code_status('bracket_opened') && !self::is_code_status('function_name_set')){
			self::$code_status['set_function_name'] = false;
			self::set_prev_code('set_function_name', false);
			self::$code_status['function_name_set'] = true;
			$is_found = true;
		}
		// Задать аргументы функции
		if (self::is_code_status('function_name_set') && self::is_code_status('bracket_opened') && !self::is_code_status('function_args_set')){
			self::$code_status['set_function_args'] = true;
			self::set_prev_code('set_function_args', true);
			self::$code_options['set_function_args_bracket_level'] = self::$code_status['bracket_level'];
			$is_found = true;
		}
			if (self::is_code_status('set_function_args') && !self::is_code_status('function_args_set')){
				if (self::is_in_brackets('bracket')){
					self::$code_status['set_function_args'] = false;
					self::set_prev_code('set_function_args', false);
					self::$code_status['function_args_set'] = true;
					$is_found = true;
				}
			}
		// Задать содержимое функции и внести все захваченные параметры и обнулить захваченные параметры
		if (self::is_code_status('function_args_set') && self::is_code_status('brace_opened')){
			self::$code_status['set_function_content'] = true;
			self::set_prev_code('set_function_content', true);
			self::$code_options['set_function_args_brace_level'] = self::$code_status['brace_level'];
			$is_found = true;
		}
			if (self::is_code_status('set_function_content')){
				if (self::$code_status['brace_level'] < self::$code_options['set_function_args_brace_level']){
					self::$code_status['set_function_content'] = false;
					self::set_prev_code('set_function_content', false);
					$is_found = true;
					// self::$code_status['function_content_set'] = true; // не нужно, оставил для логического представляния

					// Внесение захваченных параметров
					$class_name = self::$code_options['class_name'];
					self::$functions[$class_name] = [
						'name'=>self::$current_function['name'], 
						'args'=>self::$current_function['args'], 
						'content'=>self::$current_function['content'], 
					];
					
					// Обнуление значений
					self::$code_options['class_name'] = '';

					self::$current_function['name'] = '';
					self::$current_function['args'] = '';
					self::$current_function['content'] = '';

					// Обнуление логики
					self::$code_status['class_name_set'] = false;

					self::$code_status['function_modifier_set'] = false;
					self::$code_status['function_name_set'] = false;
					self::$code_status['function_args_set'] = false;
					//self::$code_status['function_content_set'] = false;
				}
			}

		if (self::is_code_status('next_line') && self::is_code_status('line_comment')){
			self::$code_status['line_comment'] = false;
			$is_found = true;
		}
		if (self::is_code_status('set_var_name') && ( 
			self::is_code_status('set_equal') ||
			self::is_code_status('set_semicolon')
			)
		){
			self::$code_status['set_var_name'] = false;
			self::$found_vars[] = self::$found_var;
			self::$found_var = [];
			$is_found = true;
		}
		if ($is_found){
			//Команды одной позиции:
			self::command_timer_off();
			self::$memory_array = [];
			//self::code_status_off('brace_opened');
			/*
			self::timer_off('brace_opened');
			self::timer_off('brace_closed');
			self::timer_off('bracket_opened');
			self::timer_off('bracket_closed');
			self::timer_off('square_bracket_opened');
			self::timer_off('square_bracket_closed');
			self::timer_off('next_line_r');
			self::timer_off('next_line_n');
			self::timer_off('next_line');
			*/
		}
	}
	static function is_not_comment_or_string() {
		if (!self::is_code_status('comment') && !self::is_code_status('quote_string')){
			return true;
		} else {
			return false;
		}
	}
	static function is_not_comment() {
		if (!self::is_code_status('comment')){
			return true;
		} else {
			return false;
		}
	}
	static function is_not_string() {
		if (!self::is_code_status('quote_string')){
			return true;
		} else {
			return false;
		}
	}
	static function is_in_brackets($bracket_type) {
		//self::$code_status[$bracket_type.'_level'] < self::$code_options['set_function_args_'.$bracket_type.'_level'] ||
		if (self::is_code_status($bracket_type.'_closed') && 
			self::$code_status[$bracket_type.'_level'] == self::$code_options['set_function_args_'.$bracket_type.'_level']){
			return true;
		} else {
			return false;
		}
	}
	static function set_char_timer_off($timer_off_id, $target_array, $steps) {
		self::$char_timer_off_array[$timer_off_id] = ['target_array'=>$target_array, 'steps'=>$steps];
	}
	static function set_command_timer_off($timer_off_id, $target_array, $steps) {
		self::$command_timer_off_array[$timer_off_id] = ['target_array'=>$target_array, 'steps'=>$steps];
	}
	static function command_timer_off() {
		//var_dump(self::$command_timer_off_array);
		if (is_array(self::$command_timer_off_array)){
			foreach (self::$command_timer_off_array as $timer_off_id=>$timer_off) {
				if (empty(self::$command_timer_off_array[$timer_off_id]['steps']) || self::$command_timer_off_array[$timer_off_id]['steps'] < 0){
					$target_array = self::$command_timer_off_array[$timer_off_id]['target_array'];
					if ($target_array == 'code_status'){
						// echo 'unset '.$timer_off_id."\n";
						self::$code_status[$timer_off_id] = false;
						//var_dump(self::$code_status[$timer_off_id]);
						unset(self::$command_timer_off_array[$timer_off_id]);
					}
				} else {
					self::$command_timer_off_array[$timer_off_id]['steps']--;
				}
			}
		} else {
			return false;
		}
	}
	static function char_timer_off() {
		//var_dump(self::$char_timer_off_array);
		if (is_array(self::$char_timer_off_array)){
			foreach (self::$char_timer_off_array as $timer_off_id=>$timer_off) {
				if (empty(self::$char_timer_off_array[$timer_off_id]['steps']) || self::$char_timer_off_array[$timer_off_id]['steps'] < 0){
					$target_array = self::$char_timer_off_array[$timer_off_id]['target_array'];
					if ($target_array == 'code_status'){
						// echo 'unset '.$timer_off_id."\n";
						self::$code_status[$timer_off_id] = false;
						//var_dump(self::$code_status[$timer_off_id]);
						unset(self::$char_timer_off_array[$timer_off_id]);
					}
				} else {
					self::$char_timer_off_array[$timer_off_id]['steps']--;
				}
			}
		} else {
			return false;
		}
	}
	static function set_code_status($code_status_id, $code_value) {
		self::$code_status[$code_status_id] = $code_value;
		self::set_prev_code($code_status_id, $code_value);
	}
}
