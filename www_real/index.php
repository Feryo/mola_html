<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
<script src="/assets/libs/jquery-3.2.1.js"></script>
<script src="/assets/libs/basis/basis.js"></script>
<script src="js/default.js"></script>
<script src="js/uni.js"></script>
<script src="js/ElementControl_class.js"></script>
<script src="js/NewElement_class.js"></script>
<script src="js/ElementsCollector_class.js"></script>
<script src="js/panel.js"></script>
<script src="js/save_load.js"></script>
<script src="js/extra.js"></script>
<script src="js/mola.js"></script>
<link rel="stylesheet" href="/assets/libs/basis/basis_clear.css">
<link rel="stylesheet" href="/assets/libs/basis/basis.css">
<link rel="stylesheet" href="css/mola.css">
</head>
<body>
	<div id="modal_main" class="modal">
		<div class="modal_main_header_box">
			<div id="modal_main_header"></div>
			<button onclick="close_it(this)" class="modal_close">Х</button>
		</div>
		<div id="modal_main_content"></div>
	</div>
	<div class="global">
		<div class="left" id="left">
			<div class="header">
				<div>
					<button onclick="show_projects(); return false;" title="Show projects(Список всех проектов)">Projects</button>
					<button onclick="toggle_active_as_list_element(); return false;" title="Toggle active element as list (Пометить текущий объект как список)">ToggleList</button>
					<button onclick="show_interfaces(); return false;">Interfaces</button>
					<!--button onclick="toggle_active_as_main_interface(); return false;" title="Toggle active element as main interface">ToggleMainInterface</button!-->
					<button onclick="toggle_active_as_interface(); return false;" title="Toggle active element as interface">ToggleInterface</button>
					<button onclick="test(); return false;">Test</button>
					<button onclick="show_all(1); return false;" title="Показать верхний слой">Top</button>
					<button onclick="save_all(); return false;">Save</button>
					<button onclick="save_formatted(); return false;" title="Save formatted (to ELEMENTS_json.txt)">ToJSON</button>
					<button onclick="load_formatted(); return false;" title="Load formatted (from ELEMENTS_json.txt)">FromJSON</button>
					<button onclick="to_linear_obj(); return false;" title="Выгрузить активный элемент ввиде линейного объекта">ToLinearObj</button>
					<button onclick="load_all(); return false;" title="Загрузить">Load</button>
					<button onclick="clean_all(); return false;" title="Очистить память">Clean</button>
					<button onclick="clean_files(); return false;" title="Удалить файлы хранения данных">CleanFiles</button>
					<input id="is_select_inner" type="checkbox" name="" title="Выделять вложенные элементы"><span>Sel In</span>
					<button onclick="re_set_props_for_selected(); return false;">Re Set</button>
					<button onclick="horizontal_vertical_toggle(); return false;" title="Горизонтальная/вертикальная ориентация">Horiz/Vert</button>
					<button onclick="remove_active_element(); return false;" title="Remove Active Element">RmActEl</button>
					<button onclick="remove_selected_elements(); return false;" title="Remove Selected Elements">RmSelEls</button>
					<button onclick="copy_selected_elements(); return false;" title="Copy Selected Elements">CopySelEls</button>
					<input id="is_paste_recursive" type="checkbox" name=""><span>Is Paste Recursive</span>
					<button onclick="second_window(); return false;" title="Второе окно">SecondWindow</button>
					<button onclick="right_panel(); return false;" title="Второе окно">RightPannel</button>
				</div>
				<div><span id="model_name"></span></div>
			</div>
			<div class="body">
				<div id="left_main_left_panel">
					<div id="left_main_left_panel_header"></div>
					<div id="left_main_left_panel_content"></div>
				</div>
				<div class="windows">
					<div class="window_box" id="window_box1">
						<div class="window_control_elements">
							<button id="select_window1" onclick="select_window(1); return false;" class="active" title="Select this window">ThisWindow</button>
							<button onclick="show_lists(['default', 1, 1]); return false;">Lists</button>
							<button onclick="new_lists_element(['default', 1, 1]); return false;" title="Create new list element">NewListEl</button>
							<button onclick="go_backward(1); return false;" title="Go step backward">&larr;</button>
							<button onclick="go_forward(1); return false;" title="Go step forward">	&rarr;</button>
						</div>
						<div class="window_horizontal">
							<div id="main_window1" class="window" onmousedown="on_main_window_move(event, 'main_window1')">
							</div>
							<div class="page_numbers" id="page_numbers1">
								<button title="Первая страница" onclick="set_page(1, 1);">1</button>
								<button title="Создать страницу" onclick="set_new_page();">+</button>
							</div>
						</div>
					</div>
					<div class="window_box" id="window_box2">
						<div class="window_control_elements">
							<button id="select_window2" onclick="select_window(2); return false;" title="Select this window">ThisWindow</button>
							<button onclick="show_lists(['default', 2, 1]); return false;">Lists</button>
							<button onclick="new_lists_element(['default', 2, 1]); return false;" title="Create new list element">NewListEl</button>
							<button onclick="go_backward(2); return false;" title="Go step backward">&larr;</button>
							<button onclick="go_forward(2); return false;" title="Go step forward">	&rarr;</button>
						</div>
						<div class="window_horizontal">
							<div id="main_window2" class="window" onmousedown="on_main_window_move(event, 'main_window2')">
							</div>
							<div class="page_numbers" id="page_numbers2">
								<button title="Первая страница" onclick="set_page(1, 2);">1</button>
								<button title="Создать страницу" onclick="set_new_page();">+</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="right" id="right">
			<div class="console_box">
				<div id="console"></div>
			</div>
			<div id="right_info">
				<button onclick="show_element_info(0, 0, 0); return false;">Default</button>
				<button onclick="set_time(); return false;">Set Time</button>
			</div>
			<div class="right_main_box">
				<div id="right_main"></div>
				<!--div class="right_panel">
					<p>Параметры нового блока</p>
					<select id="new_element_type" name="">
						<option value="object">Объект</option>
						<option value="stuct">Структура</option>
						<option value="group">Группа</option>
					</select>
					<input id="new_element_description_name" type="text" name="" placeholder="Имя">
					<textarea id="new_element_description_text" type="text" name="" placeholder="Описание"></textarea>
					<input id="new_element_description_image" type="text" name="" placeholder="Картинка">
					<textarea id="new_element_content_file1" type="text" name="" placeholder="Файл">/home/tornado2/www/modeler_simple/test.js</textarea>
					<textarea id="new_element_content_text1" type="text" name="" placeholder="Контент"></textarea>
				</div-->
			</div>
		</div>
	</div>
</body>
</html>
