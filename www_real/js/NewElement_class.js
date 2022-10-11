class NewElement extends ElementControl{
	/*
	 * mode_config = {
	 *	sibling_id: sibling_id, 
	 *	isVirtual: boolean, 
	 * }
	 */
	constructor(target_vector, mode, mode_config={}, target_id=undefined) {
		super(target_vector, 'target');

		this.id = this.new_el_id();
		this.vector = [this.project_name, this.page_number, this.id];
		if (target_id == undefined){
			ELEMENTS[this.project_name][this.page_number][this.id] = copyObject(DEFAULT_ELEMENT);
		} else {
			ELEMENTS[this.project_name][this.page_number][this.id] = copyObject(ELEMENTS[this.project_name][this.page_number][target_id]);
		}
		this.element = ELEMENTS[this.project_name][this.page_number][this.id];
		this.element['tech']['id'] = this.id;

		let sibling_id;
		let sibling_element;
		if (mode_config['sibling_id'] != undefined ){	
			sibling_id = mode_config['sibling_id'];
			sibling_element = ELEMENTS[this.project_name][this.page_number][sibling_id];
		}


		if (mode == 'previous'){
			if ( !is(sibling_element) ){	
				if (sizeof( this.target_previous() ) == 0){
					mode = 'previousParallel';
				} else if (sizeof( this.target_previous() ) == 1) {
					sibling_id = this.target_previous()[0];
					sibling_element = element_by_vector(this.project_name, this.page_number, sibling_id); 
				} else {
					this.show_modal(mode, this.target_previous());
				}
			} 
			if ( is(sibling_element) ){	
				this.elements_connect(sibling_element, this.target_element, this.id);
				this.previous(sibling_id);
				this.next(this.target_id);
			} 
		} else if (mode == 'next') {
			if ( !is(sibling_element) ){	
				if (sizeof( this.target_next() ) == 0){
					mode = 'nextParallel';
				} else if (sizeof( this.target_next() ) == 1) {
					sibling_id = this.target_next()[0];
					sibling_element = element_by_vector(this.project_name, this.page_number, sibling_id); 
				} else {
					this.show_modal(mode, this.target_next());
				}
			} 
			if ( is(sibling_element) ){	
				this.elements_connect(this.target_element, sibling_element, this.id);
				this.previous(this.target_id);
				this.next(sibling_id);
			}
		} else if (mode == 'parents'){
			if ( !is(sibling_element) ){	
				if (sizeof( this.target_parents() ) == 0){
					mode = 'parentsParallel';
				} else if (sizeof( this.target_parents() ) == 1) {
					sibling_id = this.target_parents()[0];
					sibling_element = element_by_vector(this.project_name, this.page_number, sibling_id); 
				} else {
					this.show_modal(mode, this.target_parents());
				}
			} 
			if ( is(sibling_element) ){	
				START_POINT = this.id;
				this.elements_connect_in(sibling_element, this.target_element, this.id);
				this.parents(sibling_id);
				this.childs(this.target_id);
			} 
		} else if (mode == 'childs') {
			if ( !is(sibling_element) ){	
				if (sizeof( this.target_childs() ) == 0){
					mode = 'childsParallel';
				} else if (sizeof( this.target_childs() ) == 1) {
					sibling_id = this.target_childs()[0];
					sibling_element = element_by_vector(this.project_name, this.page_number, sibling_id); 
				} else {
					this.show_modal(mode, this.target_childs());
				}
			} 
			if ( is(sibling_element) ){	
				START_POINT = this.id;
				this.elements_connect_in(this.target_element, sibling_element, this.id);
				this.parents(this.target_id);
				this.childs(sibling_id);
			} else {
				mode = 'childsParallel';
			}
		} else if (mode == 'parallels') {
			START_POINT = this.target_element['tech']['start_point'];
			//console.log( START_POINT );
			console.log(this.id);
			console.log( this.target_parallels(this.id) );
			console.log( this.id );
			console.log( this.parallels(this.target_id) );
			console.log( this.target_id );
		} 

		if (mode == 'previousParallel') {
			START_POINT = this.target_element['tech']['start_point'];
			this.target_previous(this.id);
			this.next(this.target_id);
		} else if (mode == 'nextParallel') {
			this.target_next(this.id);
			this.previous(this.target_id);
		} else if (mode == 'parentsParallel') {
			START_POINT = this.id;
			this.target_parents(this.id);
			this.childs(this.target_id);
		} else if (mode == 'childsParallel') {
			START_POINT = this.id;
			this.parents(this.target_id);
			this.target_childs(this.id);
		}

		this.element['tech']['start_point'] = START_POINT;

		if ( is(mode_config['isVirtual']) ){
			this.element['tech']['isVirtual'] = true;
		}
		if (mode_config != undefined){
			if (typeof mode_config == 'object'){
				for (let temp1 in mode_config){	
					if (typeof mode_config[temp1] == 'object'){
						console.log(4);
						for (let temp2 in mode_config[temp1]){	
							this.element[temp1][temp2] = mode_config[temp1][temp2];
						}
					} else {
						this.element[temp1] = mode_config[temp1];
					}
				}
			}
		}
		save_all();
		show_all();
		return this;
	}
	/*
	new_el_id() {
		let last_el_id_value = 0;
		if (last_el_id == 0){
			for (let el_id_a in ELEMENTS[this.project_name][this.page_number]) {
				if (el_id_a > last_el_id_value){
					last_el_id = parseInt(el_id_a);
					last_el_id_value = last_el_id;
				}
			}
		}
		last_el_id_value++;
		return last_el_id_value;
	}*/
	new_el_id() {
		let last_el_id = 0;
		for (let el_id_a in ELEMENTS[this.project_name][this.page_number]) {
			if (parseInt(el_id_a) > last_el_id){
				last_el_id = parseInt(el_id_a);
			}
		}
		last_el_id++;
		return last_el_id;
	}
	show_modal(mode, input_array) {
		let content = '';
		let sibling_id;
		let title = '';

		if (mode == 'previous') {
			title = 'Выберите предшественника';
		} else if (mode == 'next'){
			title = 'Выберите потомка';
		} else if (mode == 'parents') {
			title = 'Выберите родителя';
		} else if (mode == 'childs') {
			title = 'Выберите потомка';
		}

		for (let temp_id in input_array){	
			sibling_id = input_array[temp_id];
			if (mode == 'previous'){
				content += '<a href="#" onclick="new_between_element(\'' + sibling_id + '\', \''+ this.target_id + '\');return false;">' + sibling_id + '</a><br/>'
			} else if (mode == 'next'){
				content += '<a href="#" onclick="new_between_element(\'' + this.target_id + '\', \''+ sibling_id + '\');return false;">' + sibling_id + '</a><br/>'
			} else if (mode == 'parents'){
				content += '<a href="#" onclick="new_between_element_inside(\'' + sibling_id + '\', \''+ this.target_id + '\');return false;">' + sibling_id + '</a><br/>'
			} else if (mode == 'childs'){
				content += '<a href="#" onclick="new_between_element_inside(\'' + this.target_id + '\', \''+ sibling_id + '\');return false;">' + sibling_id + '</a><br/>'
			}
		}

		show_modal(title, content); // глобальная функция
	}
}
