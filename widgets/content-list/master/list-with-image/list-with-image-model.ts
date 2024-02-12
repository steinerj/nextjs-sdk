import { SdkItem } from '../../../../rest-sdk/dto/sdk-item';
import { ContentListModelbase } from '../content-list-model-base';

export interface ListWithImageModel extends ContentListModelbase {
    Items: Array<ListWithImageItemModel>
}

export interface ListWithImageItemModel {
    Image: {
        Css: string;
        Title: string;
        AlternativeText: string;
        Url: string
    },
    Title: {
        Value: string,
        Css: string,
        Link: string
    },
    Text: {
        Value: string,
        Css: string
    },

    Original: SdkItem
}
