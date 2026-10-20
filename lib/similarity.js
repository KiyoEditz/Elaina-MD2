/**
 * Calculate string similarity based on Levenshtein distance
 * @param {string} a 
 * @param {string} b 
 * @param {object} [options]
 * @returns {number} Value between 0 (completely different) and 1 (exact match)
 */
export default function similarity(a = '', b = '', options = {}) {
	const left = options.sensitive ? String(a) : String(a).toLowerCase();
	const right = options.sensitive ? String(b) : String(b).toLowerCase();
	const longest = Math.max(left.length, right.length);
	if (longest === 0) return 1;

	const matrix = [];
	for (let i = 0; i <= right.length; i++) matrix[i] = [i];
	for (let j = 0; j <= left.length; j++) matrix[0][j] = j;

	for (let i = 1; i <= right.length; i++) {
		for (let j = 1; j <= left.length; j++) {
			if (right.charAt(i - 1) === left.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1, // substitution
					matrix[i][j - 1] + 1,     // insertion
					matrix[i - 1][j] + 1      // deletion
				);
			}
		}
	}
	return (longest - matrix[right.length][left.length]) / longest;
}
