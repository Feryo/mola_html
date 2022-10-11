class ElementControl {
	constructor(element_vector, mode='self') {
		if (mode == 'self'){
			this.vector = vector_by_vector(element_vector);

			this.project_name = this.vector[0];
			this.page_number = this.vector[1];
			this.id = this.vector[2];

			this.element = ELEMENTS[this.project_name][this.page_number][this.id];

			this.target_id = null;
		} else if (mode == 'target'){
			this.target_vector = vector_by_vector(element_vector);

			this.project_name = this.target_vector[0];
			this.page_number = this.target_vector[1];
			this.target_id = this.target_vector[2];
			this.target_element = ELEMENTS[this.project_name][this.page_number][this.target_id];

			this.element = null;
			this.id = null;
			this.vector = null;
		}
		this.project = ELEMENTS[this.project_name];
		this.page = ELEMENTS[this.project_name][this.page_number];
		return this;
	}
	elements_connect(previous_element, next_element, connection_id) {
		let previous_element_next_id;
		let next_element_previous_id;
		for (let prev_el_temp_id in previous_element['tech']['next']){	
			previous_element_next_id = previous_element['tech']['next'][prev_el_temp_id];
			if (previous_element_next_id == next_element['tech']['id']){
				previous_element['tech']['next'][prev_el_temp_id] = connection_id;
			}
		}
		for (let next_el_temp_id in next_element['tech']['previous']){	
			next_element_previous_id = next_element['tech']['previous'][next_el_temp_id];
			if (next_element_previous_id == previous_element['tech']['id']){
				next_element['tech']['previous'][next_el_temp_id] = connection_id;
			}
		}
	}
	elements_connect_in(parents_element, childs_element, connection_id) {
		let parents_element_childs_id;
		let childs_element_parents_id;
		for (let parents_el_temp_id in parents_element['tech']['childs']){	
			parents_element_childs_id = parents_element['tech']['childs'][parents_el_temp_id];
			if (parents_element_childs_id == childs_element['tech']['id']){
				parents_element['tech']['childs'][parents_el_temp_id] = connection_id;
			}
		}
		for (let childs_el_temp_id in childs_element['tech']['parents']){	
			childs_element_parents_id = childs_element['tech']['parents'][childs_el_temp_id];
			if (childs_element_parents_id == parents_element['tech']['id']){
				childs_element['tech']['parents'][childs_el_temp_id] = connection_id;
			}
		}
	}

	previous(new_value=undefined) {
		if (new_value != undefined){
			Object.push(this.element['tech']['previous'], new_value);
		}
		return this.element['tech']['previous'];
	}
	next(new_value) {
		if (new_value != undefined){
			Object.push(this.element['tech']['next'], new_value);
		}
		return this.element['tech']['next'];
	}
	parents(new_value=undefined) {
		if (new_value != undefined){
			Object.push(this.element['tech']['parents'], new_value);
		}
		return this.element['tech']['parents'];
	}
	childs(new_value) {
		if (new_value != undefined){
			Object.push(this.element['tech']['childs'], new_value);
		}
		return this.element['tech']['childs'];
	}
	parallels(new_value) {
		if (new_value != undefined){
			Object.push(this.element['tech']['parallels'], new_value);
		}
		return this.element['tech']['parallels'];
	}

	target_previous(new_value=undefined) {
		if (new_value != undefined){
			Object.push(this.target_element['tech']['previous'], new_value);
		}
		return this.target_element['tech']['previous'];
	}
	target_next(new_value) {
		if (new_value != undefined){
			Object.push(this.target_element['tech']['next'], new_value);
		}
		return this.target_element['tech']['next'];
	}
	target_parents(new_value=undefined) {
		if (new_value != undefined){
			Object.push(this.target_element['tech']['parents'], new_value);
		}
		return this.target_element['tech']['parents'];
	}
	target_childs(new_value) {
		if (new_value != undefined){
			Object.push(this.target_element['tech']['childs'], new_value);
		}
		return this.target_element['tech']['childs'];
	}
	target_parallels(new_value) {
		if (new_value != undefined){
			Object.push(this.target_element['tech']['parallels'], new_value);
		}
		return this.target_element['tech']['parallels'];
	}
	set_element_props(el_props_in=undefined) {
		let el_props = {};
		if (el_props_in != undefined){
			el_props = el_props_in;
		} else {
			if (jsid('set__description__name') != undefined && jsid('set__description__text') != undefined && jsid('set__description__text') != undefined){
				el_props = {
					description: {
						name: jsid('set__description__name').value,
						text: jsid('set__description__text').value,
						image: jsid('set__description__image').value,
					},
					content:  {
						file: jsid('set__content__file').value,
						text: jsid('set__content__text').value,
					}, 
					//type: jsid('set__type').value,
				};
			}
		}

		for (let prop_id_1 in el_props) {
			for (let prop_id_2 in el_props[prop_id_1]) {
				this.element['main'][prop_id_1][prop_id_2] = el_props[prop_id_1][prop_id_2];
			}
		}
	}
	show_modal(mode, input_array) {
		let content = '';
		let sibling_id;
		for (let temp_id in input_array){	
			sibling_id = input_array[temp_id];
			if (mode == 'previous'){
				content += '<a href="#" onclick="new_between_element(\'' + sibling_id + '\', \''+ this.id + '\');return false;">' + sibling_id + '</a><br/>'
			} else if (mode == 'next'){
				content += '<a href="#" onclick="new_between_element(\'' + this.id + '\', \''+ sibling_id + '\');return false;">' + sibling_id + '</a><br/>'
			} else if (mode == 'parents'){
				content += '<a href="#" onclick="new_between_element_inside(\'' + sibling_id + '\', \''+ this.id + '\');return false;">' + sibling_id + '</a><br/>'
			} else if (mode == 'childs'){
				content += '<a href="#" onclick="new_between_element_inside(\'' + this.id + '\', \''+ sibling_id + '\');return false;">' + sibling_id + '</a><br/>'
			}
		}
		if (mode == 'previous') {
			title = 'Выберите предшественника';
		} else if (mode == 'next'){
			title = 'Выберите потомка';
		} else if (mode == 'parents') {
			title = 'Выберите родителя';
		} else if (mode == 'childs') {
			title = 'Выберите потомка';
		}
		show_modal(title, content); // глобальная функция
	}
}
