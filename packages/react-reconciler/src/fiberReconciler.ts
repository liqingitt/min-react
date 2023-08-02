import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './filter';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// ReactDOM.createRoot 内部，调用此方法
export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);

	const root = new FiberRootNode(container, hostRootFiber);

	hostRootFiber.updateQueue = createUpdateQueue();

	return root;
}

//  ReactDOM.createRoot 返回值调用 render 方法时，调用此方法;
// 传入 根组件对应的jsx 和 整个应用的根fiber节点
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	// 将根组件的jsx作为update
	const update = createUpdate<ReactElementType | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);

	// 连接更新流程
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
