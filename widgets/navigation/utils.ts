import { PageViewModel } from './interfaces/page-view-model';

export const getClass = (node: PageViewModel): string | undefined => {
    if (node.IsCurrentlyOpened) {
        return 'active';
    }

    return;
};
