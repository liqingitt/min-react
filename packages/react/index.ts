import currentDispatcher, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatcher';
import { jsxDEV } from './src/jsx';

export const useState: Dispatcher['useState'] = (initialState: any) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};

// 内部数据共享层
export const shared_data = {
	currentDispatcher
};

export const version = '0.0.0';

export const createElement = jsxDEV;

export default {
	version: '0.0.0',
	createElement: jsxDEV
};
