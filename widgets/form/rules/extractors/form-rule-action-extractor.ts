import { ActionData } from '../../interfaces/action-data';
import { ContextInterface } from '../../interfaces/context-interface';

export interface FormRuleActionExecutor {

    applyState: (context: ContextInterface, actionData: ActionData) => void;
    updateState: (context: ContextInterface, actionData: ActionData) => boolean;
    undoUpdateState: (context: ContextInterface, actionData: ActionData) => void;
    isConflict: (actionData: any, otherActionData: any) => boolean;
    getActionFieldIds?: (actionData: any) => any[];
}

