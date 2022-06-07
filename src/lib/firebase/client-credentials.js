const apiKey = import.meta.env.VITE_API_KEY;
const vercelEnv = import.meta.env.VITE_VERCEL_ENV;

/**
 * Gets the firebase client config
 * @returns {Object} Firebase client config
 */
export default (dev) => {
	if (dev) {
		return {
			apiKey,
			authDomain: 'budget-tracker-fe1c0.firebaseapp.com',
			projectId: 'budget-tracker-fe1c0',
			storageBucket: 'budget-tracker-fe1c0.appspot.com',
			messagingSenderId: '982408364232',
			appId: '1:982408364232:web:578d6781d6d9aa88c3e5fd',
			measurementId: 'G-RG9ZJRNBSQ'
		};
	} else {
		if (vercelEnv === 'production') {
			return {
				apiKey,
				authDomain: 'alkansya-777c4.firebaseapp.com',
				projectId: 'alkansya-777c4',
				storageBucket: 'alkansya-777c4.appspot.com',
				messagingSenderId: '909195927951',
				appId: '1:909195927951:web:61096bb15740fb4b476bfa',
				measurementId: 'G-GB18Z1CQNR'
			};
		} else {
			return {
				apiKey,
				authDomain: 'budget-tracker-fe1c0.firebaseapp.com',
				projectId: 'budget-tracker-fe1c0',
				storageBucket: 'budget-tracker-fe1c0.appspot.com',
				messagingSenderId: '982408364232',
				appId: '1:982408364232:web:578d6781d6d9aa88c3e5fd',
				measurementId: 'G-RG9ZJRNBSQ'
			};
		}
	}
};
