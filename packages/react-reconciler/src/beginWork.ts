import { FiberNode } from "./filter";
import { UpdateQueue, processUpdateQueue } from "./updateQueue";
import { HostComponent, HostRoot, HostText } from "./workTags";

export const beginWork  = (wip:FiberNode) => {
  switch (wip.tag) {
    case HostRoot:
        return updateHostRoot(wip)
        case HostComponent:
        
        break;
        case HostText:
        
        break;
    default:
        if(__DEV__){
            console.warn("beginWork为实现的类型")
        }
        break;
  }
}

function updateHostRoot(wip:FiberNode){
    const baseState = wip.memoizedState

    const updateQueue = wip.updateQueue as UpdateQueue<Element>
    const pending = updateQueue.shared.pending
    updateQueue.shared.pending = null;

    processUpdateQueue(baseState,pending)
}