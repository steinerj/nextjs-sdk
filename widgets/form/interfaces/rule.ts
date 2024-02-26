import { ConditionEvaluator } from '../rules/condition-evaluator';
import { Action } from './action';

export interface Rule {
    operator: string;
    conditions: {data:{id: string, value: string}, evaluator: ConditionEvaluator}[];
    actions: Action[];
}
