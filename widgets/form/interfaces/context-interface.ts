import { Action } from './action';
import { ActionData } from './action-data';
import { Field } from './field';

export interface ContextInterface {
    fields: Field[],
    executedActions: Action[]
    activeActions: Action[]
    formContainer:  HTMLElement | null;
    formContainerSelector: string | null;
    iterationsCounter: number;
    notificationEmails?: string [];
    hiddenFields: string [];
    skipToPageCollection: any[],
    helper: {
        showField: (a: ContextInterface, b: string)=>void;
        hideField: (a: ContextInterface, b: string)=>void;
        getFieldElement: (fieldControlId: string) => Element | null;
        getFieldStartSelector: (fieldControlId: string) => string;
        getFieldEndSelector: (fieldControlId: string) => string;
        fieldIndexOf: (a: Field[], b:string)=>number;
        arrayIndexOf: (array: string[], value: string) => number;
        actionItemIndexOf: (actions: Action[], actionData: ActionData)=>number;
    }
}
