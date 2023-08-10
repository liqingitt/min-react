import { appendInitialChild, createInstance } from 'hostConfig';
import { FiberNode } from './filter';
import { HostComponent, HostRoot, HostText } from './workTags';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// mount
				// 1.构建dom
				// 2/将dom插入dom树
				const instance = createInstance(wip.type, newProps);
				appendAllChildren(instance, wip);
			}
			return null;
		case HostText:
			return null;
		case HostRoot:
			return null;
		default:
			if (__DEV__) {
				console.warn('未处理的completeWork情况', wip);
			}
			break;
	}
};

function appendAllChildren(parent: FiberNode, wip: FiberNode) {
	let node = wip.child;
	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild();
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node.return;
		}

		node.sibling.return = node.return;
		node = node.sibling;
	}
}
