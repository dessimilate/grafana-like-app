export const waitForPageReady = (minDuration = 1000) => {
	const timer = new Promise(resolve => setTimeout(resolve, minDuration))

	const pageLoaded = new Promise(resolve => {
		if (document.readyState === 'complete') {
			resolve(null)
		} else {
			const handler = () => {
				window.removeEventListener('load', handler)
				resolve(null)
			}

			window.addEventListener('load', handler)
		}
	})

	return Promise.all([timer, pageLoaded])
}
