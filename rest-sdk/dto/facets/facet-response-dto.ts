import { SitefinityFacetType } from '../sitefinity-facet-type';

export interface FacetResponseDto {
    FacetValue: string;
    Count: number;
    From: string;
    To: string;
    FacetType: SitefinityFacetType;
}
