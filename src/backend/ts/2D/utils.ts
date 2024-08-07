// TODO cite this: http://floating-point-gui.de/errors/comparison/
export function nearlyEqual(a: number, b: number, epsilon: number = 1e-10): boolean {
    var absA: number = Math.abs(a);
	var absB: number = Math.abs(b);
	var diff: number = Math.abs(a - b);

    if (a == b) {
        return true;
    } else if (a == 0 || b == 0 || (absA + absB < Number.MIN_VALUE)) {
        return diff < (epsilon * Number.MIN_VALUE);
	} else {
        return diff / Math.min((absA + absB), Number.MAX_VALUE) < epsilon;
    }
}