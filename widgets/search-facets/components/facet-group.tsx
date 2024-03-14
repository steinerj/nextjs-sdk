'use client';

import React from 'react';
import { SearchFacetModel, SearchFacetModelExtensions } from '../search-facets-class';
import { FacetElement } from '../interfaces/facet-element';
import { SearchFacetsViewModel } from '../search-facets-viewmodel';
import { FacetsContext, FacetsContextModel } from '../facets-context';
import { FacetCustomRange } from './facet-custom-number-range';
import { RANGE_SEPARATOR, getCheckboxId } from './utils';

export function FacetGroup(props: { facet: SearchFacetModel, viewModel: SearchFacetsViewModel }) {
    const { facet, viewModel } = {...props};
    const context: FacetsContextModel = React.useContext(FacetsContext);
    const defaultFacetsCollapseCount = 10;
    let value = 0;

    const [moreLessLabel, setMoreLessLabel] = React.useState(viewModel.ShowMoreLabel);
    const selectedFacets = context.selectedFacets;
    
    const showMoreLessClick = () => {
        const newMoreLessLabel = moreLessLabel === viewModel.ShowMoreLabel
            ? viewModel.ShowLessLabel
            : viewModel.ShowMoreLabel;
        setMoreLessLabel(newMoreLessLabel);
    };

    const facetCheckboxChanged = (e: React.ChangeEvent<HTMLInputElement>, facetName: string, facetValue: string, facetLabel: string) => {
        const checked = e.target.checked;
        context.facetValueChanged(facetName, facetValue, facetValue, facetLabel, !checked, false);
    };

    const customRangeApplied = (facetFieldName: string, facetChipValue: string, facetInitialValue: string, facetChipLabel: string, checkboxId: string) => {
        let isCustomRange = true;

        if (selectedFacets[checkboxId]) {
            isCustomRange = false;
        }

        // uncheckCheckboxesFromGroup
        context.deselectFacetGroup(facetFieldName);

        context.facetValueChanged(facetFieldName, facetChipValue, facetInitialValue, facetChipLabel, false, isCustomRange);
    };

    return (<React.Fragment>
      {(facet.FacetElements.length || SearchFacetModelExtensions.ShowNumberCustomRange(facet) || SearchFacetModelExtensions.ShowDateCustomRanges(facet)) && <>
        <h4 className="h6 fw-normal mt-3" >{facet.FacetTitle}</h4>

        <ul
          className="list-unstyled mb-0" id={`facets-group-list-${facet.FacetFieldName}`}
          data-facet-type={facet.FacetFieldType}>
          {facet.FacetElements.map((facetElement: FacetElement, idx: number) => {
                    value++;
                    const hideElement: boolean = (value > defaultFacetsCollapseCount)
                        && viewModel.IsShowMoreLessButtonActive
                        && moreLessLabel === viewModel.ShowMoreLabel;
                    const encodedName = facet.FacetFieldName || '';
                    const encodedValue = facetElement.FacetValue || '';
                    const checkboxId = getCheckboxId(encodedName, encodedValue);
                    const selectedFacet = selectedFacets[checkboxId];

                    return (<li
                      key={idx}
                      hidden={hideElement}
                    >
                      <input type="checkbox"
                        onChange={(e) => facetCheckboxChanged(e, encodedName, encodedValue, facetElement.FacetLabel!)}
                        id={checkboxId}
                        data-facet-key={encodedName}
                        data-facet-value={encodedValue}
                        checked={!!selectedFacet} />
                      <label htmlFor={checkboxId}
                        id={`facet-${encodedName}-${encodedValue}`}>
                        {facetElement.FacetLabel}
                      </label>
                      {
                            viewModel.DisplayItemCount && <span className="small text-muted">({facetElement.FacetCount})</span>
                        }
                    </li>);
                })
                }
        </ul>
        </>}
      {
            (facet.FacetElements.length > defaultFacetsCollapseCount && viewModel.IsShowMoreLessButtonActive) &&
            <button onClick={showMoreLessClick} type="button" className="btn btn-link p-0 text-decoration-none"
              data-facet-type={facet.FacetFieldName} id={`show-more-less-${facet.FacetFieldName}`}>
                {moreLessLabel}
            </button>
        }
      {(SearchFacetModelExtensions.ShowNumberCustomRange(facet) || SearchFacetModelExtensions.ShowDateCustomRanges(facet)) && 
            (() => {
                const rangeFacet = facet.FacetElements.find(x => x.FacetValue?.includes(RANGE_SEPARATOR));
                const checkboxId = getCheckboxId(facet.FacetFieldName, rangeFacet?.FacetValue!);
                const selectedFacet = selectedFacets[checkboxId];
                return (
                  <FacetCustomRange
                    facet={facet}
                    facetElement={rangeFacet!}
                    fromValue={selectedFacet ? selectedFacet.facetValue.split(RANGE_SEPARATOR)[0] : ''}
                    toValue={selectedFacet ? selectedFacet.facetValue.split(RANGE_SEPARATOR)[1] : ''}
                    customRangeApplied={customRangeApplied} />
                );
            })()
                
        }
    </React.Fragment>);
}
