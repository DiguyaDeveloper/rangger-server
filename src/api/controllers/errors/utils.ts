export function fixStack(target: Error, fn: Function = target.constructor) {
	const captureStackTrace: Function = (Error as any).captureStackTrace
	captureStackTrace && captureStackTrace(target, fn)
}