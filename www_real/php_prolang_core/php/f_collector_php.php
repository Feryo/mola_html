<?php
class FCollector_php {
	static $code;
	static $file_content;
	static function make($source_file, $cache_file) {
		self::$file_content = file_get_contents($source_file);	
		// Получить имя класса:
		preg_replace_callback("class ([^ {]*)\s*\{//Umsi", 'self::class_analizer', self::$file_content);
	}
	static class_analizer() {
		
	}
}
