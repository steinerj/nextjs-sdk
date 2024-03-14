'use client';

import { useRef } from 'react';
import { SearchFacetModel, SearchFacetModelExtensions } from '../search-facets-class';
import { FacetElement } from '../interfaces/facet-element';
import { computeFacetRangeLabelForType, computeFacetRangeValueForType, getCheckboxId } from './utils';

export interface FacetCustomRangeProps {
    facet: SearchFacetModel;
    facetElement: FacetElement;
    fromValue: string;
    toValue: string;
    customRangeApplied: (facetFieldName: string, facetChipValue: string, facetInitialValue: string, facetChipLabel: string, checkboxId: string) => void;
}

export function FacetCustomRange(props: FacetCustomRangeProps) {
    const {facet, facetElement, fromValue, toValue, customRangeApplied} = {...props};
    const fromRef = useRef<HTMLInputElement>(null);
    const toRef = useRef<HTMLInputElement>(null);

    const customRangeSelectedEventHandler = () => {
        const facetFieldName = facet.FacetFieldName;
        const facetFieldType = facet.FacetFieldType;
        if (facetFieldName && facetFieldType) {
            
            let fromInput = fromRef.current;
            let toInput = toRef.current;

            if (fromInput && toInput) {
                let fromValue = fromInput.value;
                let toValue = toInput.value;

                if (fromValue !== null && fromValue !== undefined && fromValue !== '' && toValue !== null && toValue !== undefined && toValue !== '') {
                    let facetChipValue = computeFacetRangeValueForType(facetFieldType, fromValue, toValue);
                    let facetChipLabel = computeFacetRangeLabelForType(facetFieldType, fromValue, toValue);

                    // if the entered custom range exist in the generated facet - select them and don't create Custom range applied element
                    let inputId = getCheckboxId(facetFieldName, facetChipValue);
                    customRangeApplied(facetFieldName, facetChipValue, facetElement.FacetValue!, facetChipLabel, inputId);
                }
            }
        }
    };

    return (<>
      {SearchFacetModelExtensions.ShowNumberCustomRange(facet) &&<div className="mt-2 d-flex flex-row align-items-center">
        <div className="-sc-w-5rem">
          {(facet.FacetFieldType === 'NumberWhole')
                      ? <input type="number"
                          ref={fromRef}
                          id={`from-${facet.FacetFieldName}`}
                          className="form-control"
                          data-custom-range="true"
                          defaultValue={fromValue}
                          placeholder="Min"
                          onKeyDown={(event) => {
                              return event.charCode >= 48 && event.charCode <= 57;
                          }}
                      />
                      : <input type="number"
                          ref={fromRef}
                          id={`from-${facet.FacetFieldName}`}
                          className="form-control"
                          data-custom-range="true"
                          defaultValue={fromValue}
                          placeholder="Min" />
                  }
        </div>
        <span className="mx-2">&mdash;</span>

        <div className="-sc-w-5rem">
          {facet.FacetFieldType === 'NumberWhole'
                      ? <input type="number"
                          ref={toRef}
                          id={`to-${facet.FacetFieldName}`}
                          className="form-control"
                          data-custom-range="true"
                          defaultValue={toValue}
                          placeholder="Max"
                          onKeyDown={(event) => {
                              return event.charCode >= 48 && event.charCode <= 57;
                          }}
                      />
                      : <input type="number"
                          ref={toRef}
                          id={`to-${facet.FacetFieldName}`}
                          className="form-control"
                          data-custom-range="true"
                          defaultValue={toValue}
                          placeholder="Max" />
                  }
        </div>
        <button type="button"
          onClick={() => customRangeSelectedEventHandler()}
          id={`custom-range-btn-${facet.FacetFieldName}`}
          className="btn btn-outline-secondary ms-2 d-flex align-items-center"
          data-custom-range-name={facet.FacetFieldName}
          data-custom-range-type={facet.FacetFieldType}
          aria-label={`Custom range for ${facet.FacetFieldName}`}>
          <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="my-1" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>
    }
      {SearchFacetModelExtensions.ShowDateCustomRanges(facet) &&
      <div className="mt-2 d-flex flex-row align-items-center">
        <div className="-sc-w-10rem">
          <input type="date"
            ref={fromRef}
            id={`from-${facet.FacetFieldName}`}
            className="form-control"
            data-custom-range="true"
            defaultValue={fromValue}
            aria-label={`From ${facet.FacetFieldName}`} />
        </div>
        <span className="mx-2">&mdash;</span>
        <div className="-sc-w-10rem">
          <input type="date"
            ref={toRef}
            id={`to-${facet.FacetFieldName}`}
            className="form-control"
            data-custom-range="true"
            defaultValue={toValue}
            aria-label={`To ${facet.FacetFieldName}`} />
        </div>
        <button type="button"
          onClick={() => customRangeSelectedEventHandler()}
          id={`custom-range-btn-${facet.FacetFieldName}`}
          className="btn btn-outline-secondary ms-2 d-flex align-items-center"
          data-custom-range-name={facet.FacetFieldName}
          data-custom-range-type={facet.FacetFieldType}
          aria-label={`Custom range for ${facet.FacetFieldName}`}>
          <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="my-1" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>
      }
    </>
    );
}
