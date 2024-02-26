import { FormRuleActionExecutor } from '../rules/extractors/form-rule-action-extractor';
import { ActionData } from './action-data';

export interface Action {
    Visible?: boolean;
    data: ActionData;
    FieldControlId?: string;
    executor: FormRuleActionExecutor;
    applyRule?: boolean;
};
