import { WidgetModel } from '../../editor/widget-framework/widget-model';

export interface ColumnHolder {
    Children: Array<ComponentContainer>
    Attributes: { [key: string]: string },
    Style?: { [key: string]: string },
}

export interface ComponentContainer {
    model: WidgetModel<any>;
}
