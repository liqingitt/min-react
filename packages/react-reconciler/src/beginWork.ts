import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './filter';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
	Fragment,
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { mountChildFibers, reconcilerChildFibers } from './childFiber';
import { renderWithHooks } from './fiberHooks';

export const beginWork = (wip: FiberNode) => {
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		case FunctionComponent: {
			return updateFunctionComponent(wip);
		}
		case Fragment:
			return updateFragment(wip);
		default:
			if (__DEV__) {
				console.warn('beginWork为实现的类型');
			}
			return null;
	}
};

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip);

	reconcilerChildren(wip, nextChildren);
	return wip.child;
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;

	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	// hostRootFiber 的 memoizedState 一般为	 App根组件
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;
	const nextChildren = wip.memoizedState;

	// 生成子fiber节点
	reconcilerChildren(wip, nextChildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcilerChildren(wip, nextChildren);
	return wip.child;
}

function reconcilerChildren(wip: FiberNode, children?: ReactElementType) {
	// wip 对应的currentFiber，用于判断处于children处于mount还是update，与取出children 对应的旧fiber与新的children ReactElement对比，生成新的fiber节点
	const current = wip.alternate;
	if (current !== null) {
		wip.child = reconcilerChildFibers(wip, current.child, children);
	} else {
		wip.child = mountChildFibers(wip, null, children);
	}
}

function updateFragment(wip: FiberNode) {
	const nextChildren = wip.pendingProps;

	reconcilerChildren(wip, nextChildren);
	return wip.child;
}
