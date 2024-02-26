import { FormRuleActionExecutor } from './form-rule-action-extractor';
import { FormRuleConstants } from '../form-rule-constants';
import { ContextInterface } from '../../interfaces/context-interface';
import { ActionData } from '../../interfaces/action-data';

export class ShowMessageRuleActionExecutor implements FormRuleActionExecutor {
    public execute: boolean = false;

    public applyState(context: ContextInterface, actionData: ActionData) {
        let inputSelector = '[data-sf-role="form-rules-message"]';
        let inputElement = context.formContainer!.querySelector(inputSelector) as HTMLInputElement;
        if (inputElement) {
            if (this.execute) {
                inputElement.value = actionData.target;
            } else {
                let currentValue = inputElement.value;
                if (currentValue === actionData.target) {
                    inputElement.value = '';
                }
            }
        }
    };

    public updateState(context: ContextInterface, actionData: ActionData): boolean {
        this.execute = true;
        return true;
    };

    public undoUpdateState(context: ContextInterface, actionData: ActionData) {
        this.execute = false;
    };

    public isConflict(actionData: any, otherActionData: any): boolean {
        return otherActionData.name === FormRuleConstants.Actions.ShowMessage || otherActionData.name === FormRuleConstants.Actions.GoTo;
    }
}
