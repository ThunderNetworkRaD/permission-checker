/**
 * Pads an array with empty strings until it reaches the specified length.
 * If the array is already longer than the specified length, it is returned unchanged.
 * 
 * @param array - The array to pad with empty strings
 * @param length - The desired length of the array
 * @returns A new array with length at least `length`, padded with empty strings if necessary
 * 
 * @example
 * // Returns ['a', 'b', '']
 * fill(['a', 'b'], 3);
 * 
 * // Returns ['a', 'b']
 * fill(['a', 'b'], 1);
 */
export default function fill(array: string[], length: number): string[] {
    while (array.length < length) {
        array.push('');
    }
    return array;
}