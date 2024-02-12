import { MixedContentContext } from '../editor/widget-framework/mixed-content-context';
import { CommonArgs } from '../rest-sdk/args/common.args';
import { GetAllArgs } from '../rest-sdk/args/get-all.args';
import { CollectionResponse } from '../rest-sdk/dto/collection-response';
import { SdkItem } from '../rest-sdk/dto/sdk-item';
import { FilterConverterService } from '../rest-sdk/filters/filter-converter';
import { RestClient } from '../rest-sdk/rest-client';

export class RestClientForContext {
    public static async getItem<T extends SdkItem>(contentContext: MixedContentContext, externalArgs?: CommonArgs): Promise<T> {
        return this.getItems<T>(contentContext, { type: externalArgs?.type as string }).then(x => x.Items[0]);
    }

    public static async getItems<T extends SdkItem>(contentContext: MixedContentContext, externalArgs?: GetAllArgs): Promise<CollectionResponse<T>> {
        if (!contentContext ||
            !contentContext.Content ||
            contentContext.Content.length === 0) {
            return {
                TotalCount: 0,
                Items: []
            };
        }

        const firstContent = contentContext.Content[0];
        if (!firstContent || !firstContent.Variations || !firstContent.Variations[0]) {
            return {
                TotalCount: 0,
                Items: []
            };
        }

        const firstVariation = firstContent.Variations[0];

        let args: GetAllArgs = {
            type: firstContent.Type || externalArgs?.type as string,
            provider: firstVariation.Source,
            filter: FilterConverterService.getMainFilter(firstVariation)
        };

        let itemsForContext = await RestClient.getItems<T>(args);

        if (contentContext.ItemIdsOrdered &&
            contentContext.ItemIdsOrdered.length > 1 &&
            contentContext.ItemIdsOrdered.length === itemsForContext.Items.length) {
            const orderedCollection: T[] = [];
            contentContext.ItemIdsOrdered.forEach((id: string)=> {
                const orderedItem = itemsForContext.Items.find((x: any) => x.Id === id);

                if (orderedItem) {
                    orderedCollection.push(orderedItem);
                }
            });

            if (orderedCollection.length === itemsForContext.Items.length){
                itemsForContext.Items = orderedCollection;
            }
        }

        return itemsForContext;
    };
}
