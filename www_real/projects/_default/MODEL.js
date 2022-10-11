let ELEMENTS = [];
ELEMENTS[1] = [];
ELEMENTS[1][0] = { // нулевой элемент. Нужен только как эталон. В частности для вывода нулевых свойств
	id: 0, 
	start_point: 1, 
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
	type:'', 
	next:[],
	previous:[],
	parents:[],
	childs:[],
	level:1,
	time:1,
};
ELEMENTS[1][1] = {
	id: 1, 
	start_point: 1, 
	description: {
		name:'Test',
		text:'Test',
		image:'',
	},
	content:{
		file:'file_path',
		text:'Big text',
	},
	type:'', 
	next:[2,3],
	previous:[],
	parents:[],
	childs:[],
	level:1,
	time:1,
};

ELEMENTS[1][2] = {
	id: 2, 
	start_point: 1, 
	description: {
		name:'Test2',
		text:'Test2',
		image:'',
	},
	content:{
		file:'file_path',
		text:'Big text',
	},
	type:'',
	next:[],
	previous:[1],
	parents:[],
	childs:[],
	level:1,
	time:1,
};

ELEMENTS[1][3] = {
	id: 3, 
	start_point: 1, 
	description: {
		name:'Test3',
		text:'Test3',
		image:'',
	},
	content:{
		file:'file_path',
		text:'Big text',
	},
	type:'',
	next:[],
	previous:[1],
	parents:[],
	childs:[],
	level:1,
	time:0,
};
