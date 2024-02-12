import { RequestArgs } from './request.args';

export interface GetLazyWidgetsArgs extends RequestArgs {
    referrer: string;
    correlationId: string;
    cookie: string;
    url: string;
}
