import { Dictionary } from '../../typings/dictionary';
import { CommonArgs } from './common.args';

export interface UploadMediaArgs extends CommonArgs {
    title: string;
    urlName?: string;
    fileName: string;
    parentId: string;
    fields?: Dictionary
    binaryData: string;
    contentType: string;
}
