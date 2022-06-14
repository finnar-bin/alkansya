import { MONTHS, INCOME_TYPES, EXPENSE_TYPES } from '$lib/config/constants';

/**
 * Returns a non-200 HTTP response.
 * @param {status} int HTTP status. Default 500.
 * @param {string} errorMessage Error message to return.
 * @param {Object} headers Response headers.
 * @returns {Object} HTTP response object.
 */
export const returnHttpError = (status = 500, errorMessage, headers = {}) => {
	return {
		status,
		headers: {
			...headers,
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			errorMessage: errorMessage
		})
	};
};

/**
 * Checks if a value is of proper year format (e.g. 2022).
 * @param {string|number} year Value to be tested.
 * @returns {boolean} True if format is correct, otherwise false.
 */
export const isYear = (year) => {
	if (typeof year !== 'string' && typeof year !== 'number') {
		return false;
	}

	return /^([0-9]{4,4})$/.test(year);
};

/**
 * Checks if a value is of proper month format (1-12).
 * @param {string|number} year Value to be tested.
 * @returns {boolean} True if format is correct, otherwise false.
 */
export const isMonth = (month) => {
	if (typeof month !== 'string' && typeof month !== 'number') {
		return false;
	}

	return /^(([1][0-2])|([1-9]))$/.test(month);
};

export const getMonthString = (number) => {
	const _number = typeof number !== 'number' ? parseInt(number, 10) : number;

	const result = MONTHS.find((month) => {
		if (month.value === _number) {
			return month.name;
		}
	});

	return result.name;
};

/**
 * Formats a raw number into Php currency format
 * @param {number} number Raw number
 * @returns {string} Number in PHP currency format
 */
export const currencyFormat = (number) => {
	if (typeof number !== 'number') {
		return '';
	}

	return new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumIntegerDigits: 2
	}).format(number);
};

/**
 * Formats a date into a human readable string
 * @param {Date} date Raw date
 * @returns {string} Formatted date string
 */
export const dateFormat = (date, style) => {
	let _date = date;
	let config = {};

	if (!style) {
		return '';
	}

	if (typeof date !== 'object') {
		_date = new Date(date);
	}

	if (style === 'date') {
		config = {
			dateStyle: 'long'
		};
	} else if (style === 'datetime') {
		config = {
			dateStyle: 'long',
			timeStyle: 'short'
		};
	}

	return new Intl.DateTimeFormat('en-PH', config).format(_date);
};

/**
 * Gets the string of the category code
 * @param {string} code Transaction category code
 * @param {string} type Type of transaction
 * @returns {string} Category string
 */
export const getCategoryType = (code, type) => {
	let array = [];

	if (type === 'income') {
		array = INCOME_TYPES;
	}

	if (type === 'expense') {
		array = EXPENSE_TYPES;
	}

	const match = array.find((type) => type.value === code);

	return match.name || '-';
};
