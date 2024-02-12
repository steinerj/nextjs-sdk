import { Category, ContentSection, ContentSectionTitles, DefaultValue, DisplayName, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('SitefinitySubmitButton', 'Submit Button')
export class SubmitButtonEntity {
    @DefaultValue('Submit')
    @ContentSection(ContentSectionTitles.LabelsAndContent)
    Label?: string;

    @Category('Advanced')
    @DisplayName('CSS class')
    CssClass?: string;
}
