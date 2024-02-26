'use client';

import React from 'react';
import { SearchResultsSorting } from './interfaces/search-results-sorting';
import { getWhiteListSearchParams } from '../document-list/common/utils';
import { RequestContext } from '../../editor/request-context';
import { SearchParams } from './interfaces/search-params';

export function OrderByDropDown(props: {
    sortingSelectId: string;
    searchParams: SearchParams,
    sorting: string;
    context: RequestContext
}) {
    const { sortingSelectId, searchParams, sorting, context } = props;
    const whitelistedQueryParams = ['sf_site', 'sfaction', 'sf_provider'];
    const queryList = new URLSearchParams(getWhiteListSearchParams(context.searchParams || {}, whitelistedQueryParams));
    const query = searchParams['searchQuery'];
    const index = searchParams['indexCatalogue'];
    const wordsMode = searchParams['wordsMode'];
    const language = searchParams['sf_culture'];
    const scoringInfo = searchParams['scoringInfo'];
    const resultsForAllSites = searchParams['resultsForAllSites'];
    const orderBy = sorting;
    const filter = searchParams['filter'];

    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const orderValue = event.target.value || orderBy;
        let newQuery = queryList + '&searchQuery=' + query +
            '&indexCatalogue=' + index +
            '&wordsMode=' + wordsMode +
            '&sf_culture=' + language +
            '&orderBy=' + orderValue;

        if (scoringInfo) {
            newQuery = newQuery + '&scoringInfo=' + scoringInfo;
        }

        if (filter) {
            newQuery = newQuery + '&filter=' + filter;
        }

        if (resultsForAllSites === 'True') {
            newQuery += '&resultsForAllSites=True';
        } else if (resultsForAllSites === 'False') {
            newQuery += '&resultsForAllSites=False';
        }

        window.location.search = newQuery;
    };

    return (
      <select onChange={handleSelectionChange} className="userSortDropdown form-select" value={orderBy}
        title="SortDropdown" id={sortingSelectId}>
        <option value={SearchResultsSorting.MostRelevantOnTop}>Relevance</option>
        <option value={SearchResultsSorting.NewestFirst}>Newest first</option>
        <option value={SearchResultsSorting.OldestFirst}>Oldest first</option>
      </select>
    );
}

