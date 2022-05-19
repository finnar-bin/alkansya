/**
 * Returns a non-200 HTTP response.
 * @param {status} int HTTP status. Default 500.
 * @param {string} errorMessage Error message to return.
 * @param {Object} headers Response headers.
 * @returns {Object} HTTP response object.
 */
export function returnHttpError(status = 500, errorMessage, headers = {}) {
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
}

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
