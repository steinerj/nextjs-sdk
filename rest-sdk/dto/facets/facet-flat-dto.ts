import { FacetResponseDto } from './facet-response-dto';

export interface FacetFlatResponseDto {
    FacetKey: string;
    FacetResponses: FacetResponseDto[];
}
