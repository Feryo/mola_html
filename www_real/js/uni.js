class Uni {
	constructor() {
		return this;
	}
	get_element_by_vector(input_vector) {
		let current_key = input_vector[0];
		let current_level_value = ELEMENTS[current_key];
		for (let vector_id in input_vector){	
			current_key = input_vector[vector_id];
			if (vector_id == 0){
				continue;
			}
			current_level_value = current_level_value[current_key];
		}
		return current_level_value;
	}
	set_element_by_vector(input_vector, new_value) {
		let current_key = input_vector[0];
		let result_code = 'ELEMENTS[\'' + current_key + '\']';
		for (let vector_id in input_vector){	
			current_key = input_vector[vector_id];
			if (vector_id == 0){
				continue;
			}
			result_code += '[\'' + current_key + '\']';
		}
		if (Array.isArray(new_value) && new_value.length == 0){
			new_value = '[]';
		} else if (typeof new_value == 'object'){
			new_value = '{}';
		} else {
			new_value = '\'' + new_value + '\'';
		}
		result_code += ' = ' + new_value + ';';
		eval(result_code);
	}
	set_elements_by_vector(input_vectors_array, new_value) {
		let input_vector;
		let current_key = [];
		let result_code = '';
		for (let iva_id in input_vectors_array) {
			input_vector = input_vectors_array[iva_id];
			current_key = input_vector[0];
			result_code = 'ELEMENTS[\'' + current_key + '\']';
			for (let vector_id in input_vector){	
				if (vector_id == 0){
					continue;
				}
				current_key = input_vector[vector_id];
				result_code += '[\'' + current_key + '\']';
			}
			result_code += ' = ' + new_value + ';';
			eval(result_code);
		}
	}
	elements_connect(previous_id_m, next_id_m, first_element_id, last_element_id) {
		let previous_elem = new ElementControl(previous_id_m);
		let next_elem = new ElementControl(next_id_m);

		let previous_elem__this_next_id_vector_array_for_previous = previous_elem.this_next_id_vector_array_for_previous(next_elem.id);
		let next_elem__this_previous_id_vector_array_for_next = next_elem.this_previous_id_vector_array_for_next(previous_elem.id);

		if (previous_elem__this_next_id_vector_array_for_previous.length != 0){
			this.set_elements_by_vector(previous_elem__this_next_id_vector_array_for_previous, first_element_id);
		} else {
			previous_elem.next(first_element_id);
		}

		if (next_elem__this_previous_id_vector_array_for_next.length != 0){
			this.set_elements_by_vector(next_elem__this_previous_id_vector_array_for_next, last_element_id);
		} else {
			next_elem.previous(last_element_id);
		}
	}
	elements_connect_inside(parents_id_m, childs_id_m, first_element_id, last_element_id) {
		let parents_elem = new ElementControl(parents_id_m);
		let childs_elem = new ElementControl(childs_id_m);

		let parents_elem__this_childs_id_vector_array_for_parents = parents_elem.this_childs_id_vector_array_for_parents(childs_elem.id);
		let childs_elem__this_parents_id_vector_array_for_childs = childs_elem.this_parents_id_vector_array_for_childs(parents_elem.id);

		if (parents_elem__this_childs_id_vector_array_for_parents.length != 0){
			this.set_elements_by_vector(parents_elem__this_childs_id_vector_array_for_parents, first_element_id);
		} else {
			parents_elem.childs(first_element_id);
		}

		if (childs_elem__this_parents_id_vector_array_for_childs.length != 0){
			this.set_elements_by_vector(childs_elem__this_parents_id_vector_array_for_childs, last_element_id);
		} else {
			childs_elem.parents(last_element_id);
		}
	}
}
