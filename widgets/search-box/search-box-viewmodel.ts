export interface SearchBoxViewModel {
    Attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null,
    SuggestionsTriggerCharCount: number,
    SearchButtonLabel: string | null,
    SearchBoxPlaceholder: string | null,
    SearchIndex: string | null;
    SuggestionFields: string | null;
    WebServicePath: string;
    SearchResultsPageUrl: string | null;
    ShowResultsForAllIndexedSites: number;
    ScoringProfile: {
        ScoringSetting: string,
        ScoringParameters: string
    },
    SiteId: string;
    Culture: string;
    ActiveClass: string;
    VisibilityClassHidden: string;
    SearchAutocompleteItemClass: string;
    IsEdit: boolean;
    Sort: string;
    SearchQuery: string;
}
