import { CollectionResponse } from '../../rest-sdk/dto/collection-response';
import { SdkItem } from '../../rest-sdk/dto/sdk-item';

export interface ContentListModelMaster {
    OpenDetails: boolean;
    Items: CollectionResponse<SdkItem>,
    FieldCssClassMap: { [key: string]: string };
    FieldMap: { [key: string]: string };
    ViewName: 'CardsList' | 'ListWithImage' | 'ListWithSummary';
    Attributes: Array<{ Key: string, Value: string }>;
}
