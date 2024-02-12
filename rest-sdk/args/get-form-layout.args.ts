import { Dictionary } from '../../typings/dictionary';
import { RequestArgs } from './request.args';

export interface GetFormLayoutArgs extends RequestArgs {
    id: string;
    queryParams?: Dictionary
}
