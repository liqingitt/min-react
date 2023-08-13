import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import { FiberNode } from './filter';
import internals from 'shared/internal';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// 当前的fiber节点
let currentlyRenderingFiber: FiberNode | null = null;
// 当前正在处理中的hook
let workInprogressHook: Hook | null = null;

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
		// update
	} else {
		// mount 时调用的hooks集合
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;
	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

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
