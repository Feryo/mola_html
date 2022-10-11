class ElementsCollector {
	/*
	 * collection = [el_id, sync_id, target, mode]
	 */
	constructor(target_vector, isAll=false) {
		let element_vector = vector_by_vector(target_vector);
		this.project_name = element_vector[0];
		this.page_number = element_vector[1];
		this.el_id = element_vector[2];

		this.id_array_collection = [];
		this.mode_array_collection = [];
		this.target_array_collection = [];
		this.id_array_collection_i = 0;
		this.id_array_collection_new_i = 0;

		this.add_line([this.el_id], null, null);

		let real_el_id;
		let linear_element; 
		let target_array = [1];

		while(this.id_array_collection[this.id_array_collection_i] != undefined) {
			this.collect_previous_next_siblings();
			this.id_array_collection_i++;
		}

		if (isAll){
			for (let real_el_id in ELEMENTS[this.project_name, this.page_number]){	
				collect_this(real_el_id);
			}
		}
		return this.get_result();
	}
	collect_previous_next_siblings() {
		let current_sibling_array = this.id_array_collection[this.id_array_collection_i];
		let current_sibling_id;
		let current_element_vector;
		let current_element;
		let siblings = ['previous', 'next', 'parallels'];
		let sibling;
		let real_siblings;
		let found_siblings = [];
		let real_sibling;
		for (let temp_sibling_id in current_sibling_array){	
			current_sibling_id = current_sibling_array[temp_sibling_id];
			current_element_vector = [this.project_name, this.page_number, current_sibling_id];
			current_element = element_by_vector(current_element_vector);
			for (let sibling of siblings){
				if ( sizeof(current_element['tech'][sibling]) == 0 ){
					continue;
				}
				real_siblings = current_element['tech'][sibling];
				for (let real_sibling_id in real_siblings){	
					real_sibling = real_siblings[real_sibling_id];
					if (!this.is_in_collection(real_sibling)){
						found_siblings.push(real_sibling);
					} 
				}
				this.add_line(found_siblings, sibling, current_sibling_id);
				found_siblings = [];
			}
		}
	}
	collect_this(el_id) {
		if (!this.id_array_collection.includes[el_id]){
			this.add_line([el_id], null, null);
		} 
	}
	add_line(id_array, mode, target_id) {
		this.id_array_collection[this.id_array_collection_new_i] = id_array;
		this.mode_array_collection[this.id_array_collection_new_i] = mode;
		this.target_array_collection[this.id_array_collection_new_i] = target_id;
		this.id_array_collection_new_i++;
	}
	is_in_collection(input_id) {
		let collection_line;
		for (let temp_el_id in this.id_array_collection){
			collection_line = this.id_array_collection[temp_el_id];
			if ( includes(collection_line, input_id) ){
				return true;
			}
		}
		return false;
	}
	get_result() {
		let i = 0;
		let result_object = {};
		result_object['collection'] = {};
		result_object['project_name'] = this.project_name;
		result_object['page_number'] = this.page_number;
		while(this.id_array_collection[i] != undefined) {
			result_object['collection'][i] = {
				id_array: this.id_array_collection[i],
				target_el_id: this.target_array_collection[i],
				mode: this.mode_array_collection[i]
			};
			i++;
		}
		return result_object;
	}
}
