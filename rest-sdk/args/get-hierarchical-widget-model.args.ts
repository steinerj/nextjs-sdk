import { ItemArgs } from './item.args';

export interface GetHierarchicalWidgetModelArgs extends ItemArgs {
    widgetId: string;
    widgetSegmentId?: string;
    segmentId?: string;
}
