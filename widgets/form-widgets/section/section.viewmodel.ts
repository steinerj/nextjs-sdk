import { WidgetModel } from '../../../editor/widget-framework/widget-model';

export interface FormSectionViewModel {
    Columns: FormSectionColumnHolder[],
}

export interface FormSectionColumnHolder {
    Children: Array<FormSectionComponentContainer>
    Attributes: { [key: string]: string },
}

export interface FormSectionComponentContainer {
    model: WidgetModel<any>;
}
