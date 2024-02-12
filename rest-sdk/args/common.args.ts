import { RequestArgs } from './request.args';

export interface CommonArgs extends RequestArgs {
    type: string;
    provider?: string;
    culture?: string;
}
