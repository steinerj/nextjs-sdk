import { FacetElement } from './interfaces/facet-element';
import { FacetField } from './interfaces/facet-field';
import { SearchIndexAdditionalFieldType } from './interfaces/search-index-additional-field-type';

export class SearchFacetModel {
    private facetField?: FacetField;
    public FacetElements: FacetElement[] = [];
    public FacetTitle: string;
    public FacetFieldType: string;
    public FacetFieldName: string;

    constructor(facetField: FacetField, facetElements:  FacetElement[]) {
        this.facetField = facetField;
        this.FacetElements = facetElements;

        this.FacetTitle = facetField.FacetableFieldLabels;
        this.FacetFieldName = facetField.FacetableFieldNames[0];
        this.FacetFieldType = facetField.FacetFieldSettings!.FacetType!;
    }

  get ShowNumberCustomRange(): boolean | undefined {
    return this.facetField!.FacetFieldSettings!.DisplayCustomRange &&
        (this.FacetFieldType === SearchIndexAdditionalFieldType.NumberWhole ||
        this.FacetFieldType === SearchIndexAdditionalFieldType.NumberDecimal);
  }

  get ShowDateCustomRanges(): boolean | undefined {
    return this.facetField!.FacetFieldSettings!.RangeType === 1 &&
        this.facetField!.FacetFieldSettings!.DisplayCustomRange &&
        this.FacetFieldType === SearchIndexAdditionalFieldType.DateAndTime;
  }
}
