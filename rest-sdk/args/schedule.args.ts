import { CommonArgs } from './common.args';

export interface ScheduleArgs extends CommonArgs {
    id: string;
    publicationDate: Date;
    expirationDate?: Date;
}
