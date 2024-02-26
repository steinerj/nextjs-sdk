
import { SearchResultDocumentDto } from '../../../rest-sdk/dto/search-results-document-dto';

export interface SearchResultsViewModel {
    SearchResults: SearchResultDocumentDto[];
    ResultsHeader: string | null;
    LanguagesLabel: string | null;
    ResultsNumberLabel: string | null;
    Attributes: { [key: string]: Array<{ Key: string, Value: string}> } | null;
    CssClass: string | undefined;
    Languages: {Name: string, Title: string}[];
    AllowUsersToSortResults: boolean;
    Sorting: string | null;
    SortByLabel: string | null;
    TotalCount: number;
}
