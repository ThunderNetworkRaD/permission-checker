export function fill(array: string[], length: number): string[] {
    while (array.length < length) {
        array.push('');
    }
    return array;
}