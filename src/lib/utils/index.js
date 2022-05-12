/**
 * Returns a HTTP response object with 500 status.
 * @param {string} errorMessage Error message to return.
 * @returns {Object} HTTP response object.
 */
export function return500(errorMessage) {
	return {
		status: 500,
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			errorMessage: errorMessage
		})
	};
}
