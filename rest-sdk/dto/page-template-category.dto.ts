export interface PageTemplateCategoryDto {
    Title: string;
    Subtitle: string;
    Visible: boolean;
    Type: PageTemplateCategoryType,
    Templates: [{
        Id: string;
        Title: string;
        Name: string;
        ThumbnailUrl: string;
        UsedByNumberOfPages: number;
        Framework : number
    }]
}

enum PageTemplateCategoryType {
    None = 0,
    CurrentlyUsed = 1
}

