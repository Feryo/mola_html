<?php
class FGenerator_php {
	static $generated_code;
	static $inserted_classes;
	static $inserted_functions;
	static function make($functions_array) {
		self::$generated_code = '';
		self::$inserted_classes = [];
		self::$inserted_functions = [];
		$total_code = '';
		$found_classes = [];
		foreach ($functions_array as $function_id=>$function_vector) {
			$class_name = $function_vector['class'];
			$found_classes[] = $class_name;
		}
		foreach ($found_classes as $class_name) {
			self::$generated_code .= 'class '.$class_name.' {'."\n";
			foreach ($functions_array as $function_id=>$function_vector) {
				if ($class_name == $function_vector['class'] && empty(self::inserted_functions[$function_vector['function_name']])){

					self::$generated_code .= self::generate_function($function_vector);

					self::$inserted_functions[$function_vector['function_name']] = true;
				}
			}
			self::generated_code .= "\n".'}'."\n";
		}
		return $total_code;
	}

	/*
	$options = [
		'class'=>$class, 
		'code_txt'=>$code_txt,
		'transformation_object'=>$transformation_object,
		'input_object'=>$input_object, 
		'output_object'=>$output_object
		'function_name'=>$function_name
		'function_modifier'=>$function_modifier
	];
	$transformation_object = [
		'var_equality'=[
			'$template_var'=>'$value_of_template_var', 
		], 
	];
	*/
	static function generate_function($options) {
		$class = $options['class'];
		$code_txt = $options['code_txt'];
		$transformation_object = $options['transformation_object'];
		$input_object = $options['input_object'];
		$output_object = $options['output_object'];
		$function_name = $options['function_name'];
		$function_modifier = $options['function_modifier'];
		$result = '';

		foreach ($transformation_object['var_equality'] as $template_var=>$value_of_template_var){	
			$code_txt = str_replace($template_var, $value_of_template_var, $code_txt);
		}

		$result .= $function_modifier.' function '.$function_name.'($options) {'."\n";
		$result .= $code_txt;
		$result .= "\n}";

		return $result; 
	}
}
