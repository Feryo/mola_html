let DEFAULT_ELEMENT = { // нулевой элемент. Нужен только как эталон. В частности для вывода нулевых свойств
	tech: {
		id: 1, 
		start_point: 1, 
		isListElement: false,
		isInterface: false,
		isInterfaced: false,
		interfaceKind: 'copy', // copy (Интерфейс копирования), prop (Интерфейс по свойству), props (Интерфейс по набору свойств), relation(Интерфейс по расположению), algorithm(Интерфейс алгоритма)
		//isMainInterface: false,
		isVirtual: false, 
		previous:{},
		next:{},
		parents:{},
		childs:{},
		parallels:{},
		dependent:{}, // зависимые
		masters:{}, // управляющие 
		linked:{}, // связанные элементы
		mechanics:{}, // модели механик реализации элемента (применяемые действия)
		linked_eversion:{}, // связанные элементы из другой плоскости восприятия
		/*
		 * Механика фрагментов:
		 * - сначала устанавливаем меточные комментарии (сделать возможность отображения с помощью модели прояза, включив режим отображения меточный комментариев)
		 * - 
		 */
		fragments:{ // фрагменты (предположительно кода), разнесённые по разным частям основного документа. "Фрагменты" - должен стать интерфейсом с набором свойств, в рамках которого создаются новые элементы (фрагменты)
			mark:'Метка_фрагмента', // обозначение метки, которое выносится в комментарий при реализации (имплантации в код) фрагмента
			0:{
				name: 'Имя_фрагмента',
				type: 'include', // тип фрагмента, например:
					//include - фрагмент, отвечающий за подкючение элемента
					//class - код класса, описывающего работу элемента
					//object - реализация класса ввиде объекта
				position: { // параметры позиционирования фрагмента
					mode: 'default' | 'replace' | 'after_fragment' | 'before_fragment' | 'after_code' | 'before_code', // режим позиционирования
					value: '//my_mark_comment' // для mode: 'replace'
					//default: 'default', // использовать в качестве меточного комментария 'Метка_фрагмента':номер_фрагмента (// <Метка_фрагмента:0>) 
					//replace: '//my_mark_comment', // заменить меточный комментарий
					//after_fragment: 'Другая_метка_фрагмента:номер_метки', // после фрагмента
					//before_fragment: 'Другая_метка_фрагмента:номер_метки', // перед фрагментом
					//after_code: 'print("Hello world!");\n', // после конкретного кода, обычно комментария 
					//before_code: 'print("Hello world!");\n', // перед конкретным кодом, обычно комментарием
				}, 
				pre_comment:'Предваряющий комментарий к фрагменту (например, условия, для фрагмента)', 
				post_comment:'Пост комментарий к фрагменту (например, результат фрагмента)', 
				comment:'Общий комментарий к фрагменту (например, назначение фрагмента)', 
				content_txt:'Текстовое содержимое фрагмента', 
				content_template: {
					template: 'my_template', // имя шаблона фрагмента
					template_txt: 'Меня зовут $name $surname', // текст шаблона (если не задано имя шаблона). Если задано и имя и текст шаблона, то это создаёт новый шаблон
					template_value: { // переменные, используемые для шаблона
						name: 'Петр', 
						surname: 'Петров', 
					},
				}
			}, 
		}, 
		level:1,
		time:0,
		temp:undefined,
	},
	main: {
		names: {
			0:'',
		},
		description: {
			name:'',
			text:'',
			image:'',
		},
		content:{
			file:'',
			text:'',
			object:{},
		},
		types:{}, 
		types_available:{}, 
		type_interfaces:{}, 
		type_interfaces_available:{}, 
		extended:'', // список подключенных элементов, свойства которых наследовать
		interfaced:'', // список подключенных инерфейсов, свойства которых наследовать
		interfaced_path_array:'', // путь наследующего элемента интерфейса  
	}, 
	personal: {
		0: {
			prop_name:'Имя свойства',
			prop_value:'Значение свойства',
			prop_type:'Тип свойства',
			prop_type_value:'Характеристика типа свойства'
		},
	},
	extended: {
		0: {
			prop_name:'Имя свойства',
			prop_value:'Значение свойства',
			prop_type:'Тип свойства',
			prop_type_value:'Характеристика типа свойства',
			path_txt: 'Путь наследований ввиде текста',
			path_vector: 'Путь наследований ввиде вектора',
			real_path: 'Путь первоначального наследователя'
		},
	},
	interfaced: {
		0: {
			prop_name:'Имя свойства',
			prop_value:'Значение свойства',
			prop_type:'Тип свойства',
			prop_type_value:'Характеристика типа свойства',
			path: 'Путь наследований',
			relation: 'Реляционный путь инерфейса',
			real_path: 'Путь первоначального наследователя',
			real_relation: 'Реляционный путь первоначального инерфейса'
		},
	}
};

let CONNECTED_INTERFACES = {
	0: {
		interface_vector:[], 
		target_vector:[]
	}
};

let SIBLINGS = ['previous', 'next', 'parents', 'childs', 'parallels', 'masters', 'slaves', 'linked', 'notlinked'];

// Обнуляем модель
DEFAULT_ELEMENT['personal'] = {};
DEFAULT_ELEMENT['extended'] = {};
DEFAULT_ELEMENT['interfaced'] = {};

CONNECTED_INTERFACES = {};

let ELEMENTS = {};
let PAGE_NUMBER = 1;
let PAGE_NUMBERS = [null, 'Первая страница'];

let WINDOW_NUMBER = 1;
let WINDOWS = [];
WINDOWS[1] = {
	page_number: PAGE_NUMBER,
	element_id: 1
};
WINDOWS[2] = {
	page_number: PAGE_NUMBER,
	element_id: 1
};
let HISTORY = [];
let HISTORY_ID = [];
HISTORY_ID[WINDOW_NUMBER] = -1;

let WINDOW_ID = 'main_window';

// Список html id показанных элементов
let SHOWED_ELEMENTS_ID = [];
