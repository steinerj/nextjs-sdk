import { ChoiceOption } from '../common/choice-option';

export interface DynamicListViewModel {
    Label: string | null;
    InstructionalText: string | null;
    Choices: ChoiceOption[] | null;
    Required: boolean;
    ViolationRestrictionsMessages: {
        required: string
    } | null;
    FieldName: string;
    CssClass: string | undefined;
    ColumnsNumber: number;
}
