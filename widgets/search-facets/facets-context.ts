import { createContext } from 'react';

export interface SelectedFacetsState {
    [key: string]: {
        facetName: string,
        facetValue: string,
        facetDefaultValue: string,
        facetLabel: string,
        isCustom: boolean
    }
}

export interface FacetsContextModel {
    facetValueChanged: (facetName: string, value: any, initialValue: any, facetLabel: string, isDeselected: boolean, isCustom: boolean) => void;
    deselectFacetGroup: (facetName: string) => void;
    selectedFacets: SelectedFacetsState;
}

export const FacetsContext = createContext<FacetsContextModel>({
    facetValueChanged: () => {},
    deselectFacetGroup: () => {},
    selectedFacets: {}
});
