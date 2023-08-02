import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode, createWorkInProgress } from "./filter";
import { HostRoot } from "./workTags";

let workInprogress:FiberNode | null;

function prepareFreshStack(root:FiberRootNode){
    workInprogress = createWorkInProgress(root.current,{})
}

    // 调度更新
export function scheduleUpdateOnFiber(fiber:FiberNode){
    const root = markUpdateFromFiberToRoot(fiber)
    renderRoot(root)
}   

// 从任意fiber节点向上查找到应用根fiber节点（fiberRootNode）
function markUpdateFromFiberToRoot(fiber:FiberNode){
    let node = fiber
    let parent = node.return

    while(parent !== null){
        node = parent
        parent = node.return
    }

    if(node.tag === HostRoot){
        return node.stateNode
    }

    return null;
}

function renderRoot(root:FiberRootNode){
    prepareFreshStack(root)

    do {
       try {
        workLoop()
        break;
       } catch (error) {
        if(__DEV__){
            console.warn("workLoop发生错误")

        }
        workInprogress = null
       }
    } while (true);
}

function workLoop(){
    while(workInprogress !== null){
        performUnitOfWork(workInprogress)
    }
}



function performUnitOfWork(fiber:FiberNode){
    const next  = beginWork(fiber);
    fiber.memoizedProps = fiber.pendingProps

    if(next === null){
        completeUnitOfWork(fiber)
    } else{
        workInprogress = next
    }
}

function completeUnitOfWork(fiber:FiberNode){
    let node:FiberNode |null = fiber
    do {
        completeWork(node)
        const sibling = node.sibling
        if(sibling !== null){
            workInprogress = sibling
            return
        }
        node = node.return
    } while (node !== null);
}