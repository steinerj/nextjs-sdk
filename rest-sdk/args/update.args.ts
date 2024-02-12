import { CreateArgs } from './create.args';

export interface UpdateArgs extends CreateArgs {
    id: string;
}
