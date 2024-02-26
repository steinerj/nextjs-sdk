import { ActionData } from '../../interfaces/action-data';
import { ContextInterface } from '../../interfaces/context-interface';
import { FormRuleActionExecutor } from './form-rule-action-extractor';

export class SendNotificationRuleActionExecutor implements FormRuleActionExecutor {
    public execute: boolean = false;

    public applyState(context: ContextInterface, actionData: ActionData) {
        let inputSelector = '[data-sf-role="form-rules-notification-emails"]';
        let inputElement = context.formContainer!.querySelector(inputSelector) as HTMLInputElement;
        if (inputElement) {
            if (context.notificationEmails) {
                inputElement.value = context.notificationEmails.join(',');
            } else {
                inputElement.value = '';
            }
        }
    };

    public updateState(context: ContextInterface, actionData: ActionData): boolean {
        if (!context.notificationEmails) {
            context.notificationEmails = [];
        }

        if (context.notificationEmails.indexOf(actionData.target) === -1) {
            context.notificationEmails.push(actionData.target);
        }

        return true;
    };

    public undoUpdateState(context: ContextInterface, actionData: ActionData) {
        if (context.notificationEmails) {
            let index = context.notificationEmails.indexOf(actionData.target);
            if (index !== -1) {
                context.notificationEmails.splice(index, 0);
            }
        }
    };

    public isConflict(actionData: any, otherActionData: any): boolean {
        return actionData.name === otherActionData.name && actionData.target === otherActionData.target;
    }
}

