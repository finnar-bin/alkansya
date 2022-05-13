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
