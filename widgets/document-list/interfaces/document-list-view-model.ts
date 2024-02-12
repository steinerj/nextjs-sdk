import { PagerViewModel } from '../../pager/pager-view-model';
import { DocumentListModelDetail } from './document-list-detail-model';
import { DocumentListModelMaster } from './document-list-model-master';

export interface DocumentListViewModel {
    listModel: DocumentListModelMaster | null;
    detailModel: DocumentListModelDetail | null;
    RenderLinks?: boolean;
    DownloadLinkLabel?: string;
    SizeColumnLabel?: string;
    TitleColumnLabel?: string;
    TypeColumnLabel?: string;
    Pager?: PagerViewModel;
}
