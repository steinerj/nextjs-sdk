import { Dictionary } from '../../../typings/dictionary';

export interface TextFieldViewModel {
    Label: string | null;
    InputType?: string;
    InstructionalText: string | null;
    PlaceholderText: string | null;
    FieldName: string | null;
    PredefinedValue: string | null;
    CssClass: string | null;
    ViolationRestrictionsJson: {
        maxLength: number | null,
        minLength: number | null
    };
    ViolationRestrictionsMessages: {
        invalidLength: string | null,
        required: string | null,
        invalid: string | null,
        regularExpression?: string | null
    },
    ValidationAttributes: Dictionary;
    HasDescription: boolean;
}
