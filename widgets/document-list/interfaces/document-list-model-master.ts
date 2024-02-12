import { CollectionResponse } from '../../../rest-sdk/dto/collection-response';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';

export interface DocumentListModelMaster {
    OpenDetails: boolean;
    Items: CollectionResponse<SdkItem>;
}
