import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { Container } from './hostConfig';
import { ReactElementType } from 'shared/ReactTypes';
import { initEvent, validEventTypeList } from './SyntheticEvent';

export function createRoot(container: Container) {
	const root = createContainer(container);

	return {
		render(element: ReactElementType) {
			validEventTypeList.forEach((eventName) => {
				initEvent(container, eventName);
			});
			updateContainer(element, root);
		}
	};
}
