import { SdkItem } from '../../../rest-sdk/dto/sdk-item';

export interface DocumentListModelDetail {
    ViewName: string;
    DetailItem: {
        Id: string;
        ProviderName: string;
        ItemType: string;
    };
    item: SdkItem
}
