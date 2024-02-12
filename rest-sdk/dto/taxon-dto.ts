import { SdkItem } from './sdk-item';

export interface TaxonDto extends SdkItem {
    AppliedTo: string;
    UrlName: string;
    SubTaxa: TaxonDto[];
}
