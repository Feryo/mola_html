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
		this.id_and_mode_collection = [];
		this.mode_array_collection = [];
		this.target_array_collection = [];
		this.id_array_collection_i = 0;
		this.id_array_collection_new_i = 0;

		this.add_line([this.el_id], null, null);

		let real_el_id;
		let linear_element; 
		let target_array = [1];

		while(this.id_array_collection[this.id_array_collection_i] != undefined) {
			this.collect_previous_next_modes();
			this.id_array_collection_i++;
		}

		if (isAll){
			for (let real_el_id in ELEMENTS[this.project_name, this.page_number]){	
				collect_this(real_el_id);
			}
		}
		return this.get_result();
	}
	collect_previous_next_modes() {
		let current_mode_array = this.id_array_collection[this.id_array_collection_i];
		let current_mode_id;
		let current_element_vector;
		let current_element;
		let current_element_id;
		let modes = ['previous', 'next', 'parallels'];
		let real_modes;
		let found_modes = [];
		let real_mode_id;
		for (let temp_mode_id in current_mode_array){	
			current_mode_id = current_mode_array[temp_mode_id];
			current_element_vector = [this.project_name, this.page_number, current_mode_id];
			current_element = element_by_vector(current_element_vector);
			current_element_id = current_element['tech']['id'];
			for (let mode_of of modes){
				if ( sizeof(current_element['tech'][mode_of]) == 0 ){
					continue;
				}
				real_modes = current_element['tech'][mode_of];
				for (let temp_real_mode_id in real_modes){	
					real_mode_id = real_modes[temp_real_mode_id];
					if (!this.is_in_collection(current_element_id + mode_of + real_mode_id)){
						found_modes.push(real_mode_id);
						this.id_and_mode_collection.push(current_element_id + mode_of + real_mode_id);
						this.id_and_mode_collection.push(real_mode_id + mode_antagonist(mode_of) + current_element_id);
					} 
				}
				this.add_line(found_modes, mode_of, current_mode_id);
				found_modes = [];
			}
		}
	}
	collect_this(el_id) {
		if (!this.id_array_collection.includes[el_id]){
			this.add_line([el_id], null, null);
		} 
	}
	add_line(id_array, mode, target_id) {
		if (id_array.length > 0){
			this.id_array_collection[this.id_array_collection_new_i] = id_array;
			this.mode_array_collection[this.id_array_collection_new_i] = mode;
			this.target_array_collection[this.id_array_collection_new_i] = target_id;
			this.id_array_collection_new_i++;
		}
	}
	is_in_collection(id_and_mode) {
		let id_and_mode_current;
		for (let temp_mode_id in this.id_and_mode_collection){
			id_and_mode_current = this.id_and_mode_collection[temp_mode_id];
			if ( id_and_mode == id_and_mode_current ){
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
