import { OrderBy } from '../filters/orderby';
import { GetCommonArgs } from './get-common.args';

export interface GetAllArgs extends GetCommonArgs {
    count?: boolean;
    orderBy?: OrderBy[],
    skip?: number;
    take?: number;
    filter?: any;
}
