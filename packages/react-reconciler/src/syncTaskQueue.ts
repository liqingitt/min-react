let syncQueue: ((...args: any) => void)[] | null = null;

let isFlushingSyncQueue = false;

export function scheduleSyncCallback(callback: (...args: any) => void) {
	if (syncQueue === null) {
		syncQueue = [callback];
	} else {
		syncQueue.push(callback);
	}
}

export function flushSyncCallbacks() {
	if (!isFlushingSyncQueue && syncQueue) {
		isFlushingSyncQueue = true;

		try {
			syncQueue.forEach((callback) => callback());
		} catch (error) {
			console.error('flushSyncCallbacks 报错', error);
		} finally {
			isFlushingSyncQueue = false;
		}
	}
}
