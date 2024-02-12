import { SearchFacetModel } from './search-facets-class';

export interface SearchFacetsViewModel {
    IndexCatalogue: string | null;
    Attributes: { [key: string]: Array<{ Key: string, Value: string}> } | null;
    AppliedFiltersLabel: string | null;
    ClearAllLabel: string | null;
    FilterResultsLabel: string | null;
    ShowMoreLabel: string | null;
    ShowLessLabel: string | null;
    IsShowMoreLessButtonActive: boolean;
    DisplayItemCount: boolean;
    HasAnyFacetElements: boolean;
    SearchFacets: SearchFacetModel[];
}
