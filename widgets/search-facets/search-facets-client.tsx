'use client';

import React, { useMemo } from 'react';
import { SearchFacetModel } from './search-facets-class';
import { SearchFacetsViewModel } from './search-facets-viewmodel';
import { FacetGroup } from './components/facet-group';
import { FacetsContext, SelectedFacetsState } from './facets-context';
import { RANGE_SEPARATOR, computeFacetRangeLabelForType, getCheckboxId, getFacetKeyFromCheckboxId } from './components/utils';

const FILTER_QUERY_PARAM = 'filter';

interface GroupedCheckedFacets {
    [key: string]: {
        filterValue: string;
        isCustom: boolean;
    }[]
}

interface AppliedFilterObject {
    appliedFilters: {
        fieldName: string;
        filterValues: { filterValue: string; isCustom: boolean; }[]
    }[];
    lastSelectedFilterGroupName: string;
    isDeselected: boolean;
}

export function SearchFacetsClient(props: { viewModel: SearchFacetsViewModel, searchParams: { [key: string]: string } }) {
    const { viewModel, searchParams } = props;
    const filterQuery = searchParams[FILTER_QUERY_PARAM];
    const [showClearButton, setShowClearButton] = React.useState(!!filterQuery);

    const markSelectedInputs = React.useCallback(() => {
        if (filterQuery) {
            const decodedFilterParam = atob(filterQuery);
            const jsonFilters: AppliedFilterObject = JSON.parse(decodedFilterParam);
            const newCheckedInputs: SelectedFacetsState = {};

            jsonFilters.appliedFilters.forEach(function (filter: { filterValues: any[], fieldName: string }) {
                filter.filterValues.forEach(function (fvObj: {filterValue: string, isCustom: boolean}) {
                    const fieldName = decodeURIComponent(filter.fieldName);
                    const filterValue = decodeURIComponent(fvObj.filterValue);
                    let facetElement = viewModel.SearchFacets
                        .find(x => x.FacetFieldName === fieldName)?.FacetElements
                            .find(x => x.FacetValue === filterValue);
                    let label: string = facetElement?.FacetLabel || '';
                    let mainValue: string = '';

                    if (!facetElement && fvObj.isCustom && filterValue.includes(RANGE_SEPARATOR)) {
                        facetElement = viewModel.SearchFacets
                        .find(x => x.FacetFieldName === fieldName)?.FacetElements
                            .find(x => x.FacetValue?.includes(RANGE_SEPARATOR));

                        const [from, to] = filterValue.split(RANGE_SEPARATOR);
                        label = computeFacetRangeLabelForType(fieldName, from, to);
                        mainValue = facetElement?.FacetValue!;
                    }

                    if (facetElement || viewModel.SearchFacets.find(x => x.FacetFieldName === fieldName && x.facetField?.FacetFieldSettings?.DisplayCustomRange)) {
                        let inputId = getCheckboxId(fieldName, mainValue || filterValue);
                        newCheckedInputs[inputId] = {
                            facetLabel: label,
                            facetName: fieldName,
                            facetValue: filterValue,
                            facetDefaultValue: mainValue || filterValue,
                            isCustom: !!fvObj.isCustom
                        };
                    }


                });
            });

            return newCheckedInputs;
        }

        return {};
    }, [filterQuery, viewModel.SearchFacets]);

    const initialSelectedInputs = useMemo(() => {
        return markSelectedInputs();
    }, [markSelectedInputs]);

    const [selectedFacets, setSelectedFacets] = React.useState<SelectedFacetsState>(initialSelectedInputs);

    const clearButtonClick = () => {
        setSelectedFacets({});
        searchWithFilter(null, {});
    };

    const groupAllCheckedFacetInputs = React.useCallback((currentSelectedFacets: SelectedFacetsState): GroupedCheckedFacets => {
        let groupedFilters: GroupedCheckedFacets = {};

        Object.keys(currentSelectedFacets).forEach((facetId: string) => {
            const selectedFacet = currentSelectedFacets[facetId];
            const facetKey = selectedFacet.facetName;
            const filterValueObj = {
                filterValue: selectedFacet.facetValue,
                isCustom: selectedFacet.isCustom
            };

            if (groupedFilters.hasOwnProperty(facetKey)) {
                groupedFilters[facetKey].push(filterValueObj);
            } else {
                groupedFilters[facetKey] = [filterValueObj];
            }

        });

        return groupedFilters;
    }, []);

    const buildFilterObjectBasedOnPopulatedInputs = React.useCallback((id: string | null, newSelectedFacets: SelectedFacetsState) => {
        let groupedFilters = groupAllCheckedFacetInputs(newSelectedFacets);
        let lastSelectedElementKey;
        let isDeselected = false;

        if (id) {
            const eventTargetElement = selectedFacets[id];
            lastSelectedElementKey = getFacetKeyFromCheckboxId(id);
            isDeselected = !eventTargetElement;
        }

        let filterObject = constructFilterObject(groupedFilters, lastSelectedElementKey!, isDeselected);

        return filterObject;
    }, [groupAllCheckedFacetInputs, selectedFacets]);

    const searchWithFilter = React.useCallback((inputId: string | null, newSelectedFacets: SelectedFacetsState) => {
        const currentFilterObject = buildFilterObjectBasedOnPopulatedInputs(inputId, newSelectedFacets);
        let filterString = JSON.stringify(currentFilterObject);
        const newSearchParam = { ...searchParams };
        delete newSearchParam['slug'];
        if (currentFilterObject && currentFilterObject.appliedFilters && currentFilterObject.appliedFilters.length > 0) {
            let encodedFilterString = btoa(filterString);
            newSearchParam[FILTER_QUERY_PARAM] = encodedFilterString;
            setShowClearButton(true);

        } else {
            delete newSearchParam[FILTER_QUERY_PARAM];
            setShowClearButton(false);
        }

        let url = buildUrl(newSearchParam);

        // window.history.pushState({ path: url }, '', url);
        window.location.href = url;
    }, [searchParams, buildFilterObjectBasedOnPopulatedInputs]);

    React.useEffect(() => {
        const newCheckedInputs = markSelectedInputs();
        setSelectedFacets(newCheckedInputs);
    }, [markSelectedInputs]);

    function handleChipDeleteClick(facetKey: string, facetValue: string) {
        const newSelectedFacets = {...selectedFacets};
        delete newSelectedFacets[getCheckboxId(facetKey, facetValue)];
        setSelectedFacets(newSelectedFacets);

        searchWithFilter(getCheckboxId(facetKey, facetValue), newSelectedFacets);
    }

    function buildUrl(queryStringParams: { [key: string]: string; }) {
        let currentLocation = window.location.href.split('?')[0];

        // return the pager to 0
        delete queryStringParams.page;
        const queryString = new URLSearchParams(queryStringParams);
        let url = currentLocation + '?' + queryString;

        return url;
    }

    function constructFilterObject(groupedFilters: GroupedCheckedFacets, lastSelectedElementKey: string, isDeselected: boolean): AppliedFilterObject {
        const currentFilterObject: AppliedFilterObject = {
            appliedFilters: Object.keys(groupedFilters).map((el) => {
                return {
                    fieldName: el,
                    filterValues: groupedFilters[el]
                } as { fieldName: string; filterValues: { filterValue: string; isCustom: boolean; }[]; };
            }),
            lastSelectedFilterGroupName: lastSelectedElementKey,
            isDeselected: isDeselected
        };

        return currentFilterObject;
    }

    const facetValueChanged = (facetName: string, facetValue: string, facetDefaultValue: string, facetLabel: string, isDeselected: boolean, isCustom: boolean ) => {
        const checkboxId = getCheckboxId(facetName, facetValue);

        if (isDeselected) {
            delete selectedFacets[checkboxId];
        } else {
            selectedFacets[checkboxId] = {
                facetName,
                facetLabel,
                facetValue,
                facetDefaultValue,
                isCustom
            };
        }

        setSelectedFacets(selectedFacets);
        searchWithFilter(checkboxId, selectedFacets);
    };

    const deselectFacetGroup = (facetName: string) => {
        const newFacets: SelectedFacetsState = {};

        Object.keys(selectedFacets).forEach(key => {
            const value = selectedFacets[key];
            if (facetName !== value.facetName) {
                newFacets[key] = value;
            }
        });

        setSelectedFacets(newFacets);
    };

    return (
      <>
        {(viewModel.HasAnyFacetElements || (!!viewModel.IndexCatalogue && viewModel.IsEdit)) &&
        (<>
          <h3 className="h6 mb-3 fw-normal">{viewModel.FilterResultsLabel}</h3>
          {viewModel.HasAnyFacetElements &&
          <>
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label">{viewModel.AppliedFiltersLabel}</label>
              {showClearButton && <button onClick={clearButtonClick} id="sf-facet-clear-all-btn" className="btn btn-link px-0 py-0 mb-2 text-decoration-none">
                {viewModel.ClearAllLabel}
              </button>}
            </div>
            <ul id="applied-filters" className="list-unstyled list-inline"
                // data-sf-applied-filter-html-tag="li"
                // data-sf-filter-label-css-className="list-inline-item bg-secondary bg-opacity-10 rounded-pill
                // ps-2 pe-4 pb-1 me-1 mb-1 mw-100 position-relative overflow-hidden text-truncate text-nowrap" data-sf-remove-filter-css-className="px-2 position-absolute end-0"
                >
              {Object.entries(selectedFacets).map(([_, value], idx: number) => {
                const {facetName, facetLabel, facetValue, facetDefaultValue} = value;
                return value && <li
                  key={idx}
                  className={'list-inline-item bg-secondary bg-opacity-10 rounded-pill ps-2 pe-4 pb-1 me-1 mb-1 mw-100 position-relative overflow-hidden text-truncate text-nowrap'}
                >{facetLabel}
                  <span onClick={() => handleChipDeleteClick(facetName, facetDefaultValue)} id={`remove-facet-filter-${facetName}-${facetValue}`} role="button"
                    tabIndex={0} title="Remove" className="px-2 position-absolute end-0">✕</span>
                </li>;
                    })
                }
            </ul>
          </>
            }
        </>)}
        {viewModel.SearchFacets && <div id="facetContent" className="mb-3">
          <FacetsContext.Provider value={{ facetValueChanged, deselectFacetGroup, selectedFacets }}>
            {viewModel.SearchFacets.map((facet: SearchFacetModel, sfIdx: number) => {
                return <FacetGroup key={sfIdx} viewModel={viewModel} facet={facet}/>;
            })
        }
          </FacetsContext.Provider>
        </div>
            }
      </>
    );
}
