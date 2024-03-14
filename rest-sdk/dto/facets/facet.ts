import { CustomFacetRange } from './custom-facet-range';
import { SitefinityFacetType } from '../sitefinity-facet-type';

export interface Facet {
    FieldName?: string;
    CustomIntervals?: CustomFacetRange[];
    IntervalRange?: string | null;
    FacetFieldType?: string;
    SitefinityFacetType: SitefinityFacetType;
}
