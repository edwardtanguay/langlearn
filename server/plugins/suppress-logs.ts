export default defineNitroPlugin((nitroApp) => {
	if (typeof console !== 'undefined' && console.error) {
		const originalConsoleError = console.error;
		console.error = (...args: any[]) => {
			if (
				args.length > 0 &&
				typeof args[0] === 'string' &&
				args[0].includes('Error checking if authenticated: No authentication credential found')
			) {
				return;
			}
			originalConsoleError(...args);
		};
	}
});
