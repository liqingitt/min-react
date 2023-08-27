import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import { FiberNode } from './filter';
import internals from 'shared/internal';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	processUpdateQueue
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// 当前的fiber节点
let currentlyRenderingFiber: FiberNode | null = null;
// 当前正在处理中的hook
let workInprogressHook: Hook | null = null;
// 上一个工作的hook
let prevHook: Hook | null = null;

const { currentDispatcher } = internals;

interface Hook {
	hookMemoizedState: any;
	hookUpdateQueue: unknown;
	next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip;
	// 重置
	wip.memoizedState = null;

	const current = wip.alternate;

	if (current !== null) {
		// update 时调用的hooks集合
		currentDispatcher.current = HooksDispatcherOnUpdate;
	} else {
		// mount 时调用的hooks集合
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;
	workInprogressHook = null;
	prevHook = null;
	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

const HooksDispatcherOnUpdate: Dispatcher = {
	useState: updateState
};

function updateState<State>(): [State, Dispatch<State>] {
	// 取出当前对应的hook数据
	const hook = updateWorkInProgressHook();

	// 计算新的state的逻辑

	const queue = hook.hookUpdateQueue as UpdateQueue<State>;

	const pending = queue.shared.pending;

	if (pending !== null) {
		const { memoizedState } = processUpdateQueue(
			hook.hookMemoizedState,
			pending
		);
		hook.hookMemoizedState = memoizedState;
	}

	return [hook.hookMemoizedState, queue.dispatch as Dispatch<State>];
}

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	const hook = mountWorkInProgressHook();

	// 初始state
	let memoizedState;
	if (initialState instanceof Function) {
		memoizedState = initialState();
	} else {
		memoizedState = initialState;
	}

	const queue = createUpdateQueue<State>();
	hook.hookUpdateQueue = queue;

	// dispatch 绑定 hook 对应的fiber节点 与 hook 中的 updateQueue
	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber!, queue);
	queue.dispatch = dispatch;

	return [memoizedState, dispatch];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	// 将setState(xxx)时的xxx，包装成一个update 添加进 hook的updateQueue 当中
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);

	// 调度更新
	scheduleUpdateOnFiber(fiber);
}

// 获取 mount 时 当前fiber对应的hook数据
function mountWorkInProgressHook(): Hook {
	// 创建一个新的hook结构
	const hook: Hook = {
		hookMemoizedState: null,
		hookUpdateQueue: null,
		next: null
	};

	if (currentlyRenderingFiber === null) {
		throw new Error('请在函数组件内调用hook');
	}

	if (workInprogressHook === null) {
		// 当前为第一个hook
		workInprogressHook = hook;
		currentlyRenderingFiber.memoizedState = workInprogressHook;
	} else {
		// mount 时 后续hook

		// 将前一个hook的next指向新的hook
		workInprogressHook.next = hook;

		// 将workInprogressHook指向当前hook
		workInprogressHook = hook;
	}

	return workInprogressHook;
}

function updateWorkInProgressHook(): Hook {
	// 当前旧hook
	let nextCurrentHook: Hook | null;

	if (prevHook === null) {
		// 当前函数组件更新时第一次调用hook
		const currentFiber = currentlyRenderingFiber?.alternate;
		if (currentFiber !== null) {
			nextCurrentHook = currentFiber?.memoizedState;
		} else {
			//currentFiber 为 null 表示为 mount，mount不应该进入这个函数
			nextCurrentHook = null;
		}
	} else {
		// 从上一次的工作的hook的next中取出当前对应的旧hook
		nextCurrentHook = prevHook.next;
	}

	if (nextCurrentHook === null) {
		// mount 和 update 时hook数量不相等
		// if (__DEV__) {
		// }
	}

	// 将prevHook 指向 nextCurrentHook
	prevHook = nextCurrentHook as Hook;

	// 根据当前的旧hook 生成当前新的hook
	const newHook: Hook = {
		hookMemoizedState: nextCurrentHook!.hookMemoizedState,
		hookUpdateQueue: nextCurrentHook!.hookUpdateQueue,
		next: null
	};

	if (currentlyRenderingFiber === null) {
		throw new Error('请在函数组件内调用hook');
	}

	if (workInprogressHook === null) {
		// 当前为第一个hook
		workInprogressHook = newHook;
		currentlyRenderingFiber.memoizedState = workInprogressHook;
	} else {
		// 将前一个hook的next指向新的hook
		workInprogressHook.next = newHook;

		// 将workInprogressHook指向当前hook
		workInprogressHook = newHook;
	}

	return workInprogressHook;
}
