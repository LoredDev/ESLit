
/**
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export default function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}
