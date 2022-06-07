import { writable } from 'svelte/store';

/**
 * Creates a persistent writeable store using localStorage.
 * @param {string} key Identifier for store item.
 * @param {*} startValue Value to initiate the store with.
 * @returns {Object} Store functions.
 */
const createWriteableStore = (key, startValue) => {
	const { subscribe, set } = writable(startValue);

	return {
		subscribe,
		set,
		useLocalStorage: () => {
			const json = localStorage.getItem(key);
			if (json) {
				set(JSON.parse(json));
			}

			subscribe((current) => {
				localStorage.setItem(key, JSON.stringify(current));
			});
		}
	};
};

export default createWriteableStore('user', {});
