import { ActionData } from '../../interfaces/action-data';
import { ContextInterface } from '../../interfaces/context-interface';
import { FormRuleActionExecutor } from './form-rule-action-extractor';

export class SkipToPageFormRuleActionExecutor implements FormRuleActionExecutor {
    public applyState(context: ContextInterface, actionData: ActionData) {
        if (context.skipToPageCollection) {
            (context.formContainer as any).trigger('form-page-skip', [context.skipToPageCollection]);
        }
    };

    public updateState(context: ContextInterface, actionData: ActionData): boolean {
        if (!context.skipToPageCollection) {
            context.skipToPageCollection = [];
        }

        if (actionData.pageIndex < parseInt(actionData.target, 10)) {
            context.skipToPageCollection.push({ SkipFromPage: actionData.pageIndex, SkipToPage: parseInt(actionData.target, 10) });
            return true;
        }

        return false;
    };

    public undoUpdateState(context: ContextInterface, actionData: ActionData) {
        if (context.skipToPageCollection) {
            context.skipToPageCollection = context.skipToPageCollection.filter(function (p: any) {
                return p.SkipFromPage !== actionData.pageIndex || p.SkipToPage !== parseInt(actionData.target, 10);
            });
        }
    };

    public isConflict(actionData: any, otherActionData: any): boolean {
        return actionData.name === otherActionData.name && actionData.pageIndex === otherActionData.pageIndex; // same action, same current page
    }
}


