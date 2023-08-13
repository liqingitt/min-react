import { Dispatch } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';

// Update 数据结构
export interface Update<State> {
	action: Action<State>;
}

// UpdateQueue数据结构
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
	dispatch: Dispatch<State> | null;
}

// 创建一个Update
export const createUpdate = <State>(action: Action<State>) => {
	return {
		action
	};
};

// 创建一个UpdateQueue
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	return {
		shared: {
			pending: null
		},
		dispatch: null
	};
};

// 将一个Update 添加到 UpdateQueue当中
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

// 消费Update ； 根据baseState 和 pendingUpdate 计算出新的State
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result = { memoizedState: baseState };
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
		} else {
			result.memoizedState = action;
		}
	}

	return result;
};
