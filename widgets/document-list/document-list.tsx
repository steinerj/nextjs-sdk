import React from 'react';
import { DocumentListEntity } from './document-list-entity';
import { StyleGenerator } from '../styling/style-generator.service';
import { DocumentListModelMaster } from './interfaces/document-list-model-master';
import { DocumentListModelDetail } from './interfaces/document-list-detail-model';
import { ContentViewDisplayMode } from '../content-lists-common/content-view-display-mode';
import { DetailPageSelectionMode } from '../content-lists-common/detail-page-selection-mode';
import { DocumentListList } from './document-list-list';
import { DocumentListGrid } from './document-list-grid';
import { getPageQueryString, getWhiteListSearchParams } from './common/utils';
import { DocumentDetailItem } from './document-list-detail-item';
import { DocumentListViewModel } from './interfaces/document-list-view-model';
import { ContentListsCommonRestService } from '../content-lists-common/content-lists-rest.setvice';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { Pager } from '../pager/pager';
import { DetailItem } from '../../editor/detail-item';
import { RequestContext } from '../../editor/request-context';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes, setHideEmptyVisual } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { getPageNumber } from '../pager/pager-view-model';

export async function DocumentList(props: WidgetContext<DocumentListEntity>) {
    const entity = props.model.Properties;

    const context = props.requestContext;
    const dataAttributes = htmlAttributes(props);
    const documentListCustomAttributes = getCustomAttributes(entity.Attributes, 'Document list');
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    let defaultClass =  '';
    const isGrid = entity.SfViewName === 'DocumentTable';
    const viewModel: DocumentListViewModel = {
        detailModel: null,
        listModel: null
    };
    viewModel.RenderLinks = !(entity.ContentViewDisplayMode === ContentViewDisplayMode.Master &&
         entity.DetailPageMode === DetailPageSelectionMode.SamePage);
    viewModel.DownloadLinkLabel = entity.DownloadLinkLabel;
    viewModel.SizeColumnLabel = entity.SizeColumnLabel;
    viewModel.TitleColumnLabel = entity.TitleColumnLabel;
    viewModel.TypeColumnLabel = entity.TypeColumnLabel;

    if (entity.SelectedItems?.Content?.length && entity.SelectedItems?.Content[0].Variations) {
        setHideEmptyVisual(dataAttributes, true);
    }

    const pageNumber = getPageNumber(entity.PagerMode, props.requestContext, entity.PagerQueryTemplate, entity.PagerTemplate);

     if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Automatic) {
         if (context.detailItem) {
            const viewCss = entity.CssClasses?.find(x => x.FieldName === 'Details view');
            defaultClass = viewCss ? viewCss.CssClass : '';
            viewModel.detailModel = await handleDetailView(context.detailItem, entity, context);
         } else {
            const fieldName = isGrid ? 'Document table' : 'Document list';
            const viewCss = entity.CssClasses?.find(x => x.FieldName === fieldName);
            defaultClass = viewCss ? viewCss.CssClass : '';
             viewModel.listModel = await handleListView(entity, context, pageNumber);
         }
     } else if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Detail) {
        if (entity.SelectedItems && entity.SelectedItems.Content && entity.SelectedItems.Content.length > 0) {
            const selectedContent = entity.SelectedItems.Content[0];
            const itemIdsOrdered = entity.SelectedItems.ItemIdsOrdered;
            const detailModel = await handleDetailView({
                Id: itemIdsOrdered ? itemIdsOrdered![0]: '',
                ItemType: selectedContent.Type,
                ProviderName: selectedContent.Variations![0].Source
            }, entity, context);
            viewModel.detailModel = detailModel;
            const viewCss = entity.CssClasses?.find(x => x.FieldName === 'Details view');
            defaultClass = viewCss ? viewCss.CssClass : '';
        }
    } else if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Master) {
        viewModel.listModel = await handleListView(entity, context, pageNumber);
    }

   let url: string = '';
   const whitelistedQueryParams = ['sf_site','sfaction','sf_provider','sf_culture'];
   const queryList = new URLSearchParams(getWhiteListSearchParams(context.searchParams || {}, whitelistedQueryParams));
   let queryString = '?' + queryList.toString();

   if (entity && entity.DetailPageMode === DetailPageSelectionMode.SamePage) {
        url = context.layout.Fields ? context.layout.Fields.ViewUrl : context.layout.MetaInfo.CanonicalUrl;
    } else if (entity && entity.DetailPage) {
       const page = await RestClient.getItem({
           type: RestSdkTypes.Pages,
           id: entity.DetailPage.ItemIdsOrdered![0],
           provider: entity.DetailPage.Content[0].Variations![0].Source
       });

        url = page.RelativeUrlPath;
        queryString = getPageQueryString(page as PageItem);
    }

    dataAttributes['className'] = classNames(
        defaultClass,
        marginClass,
        documentListCustomAttributes.class
    );

    return (
      <div
        {...documentListCustomAttributes}
        {...dataAttributes}
      >
        { viewModel.detailModel && <DocumentDetailItem entity={entity} viewModel={viewModel} /> }
        { viewModel.listModel && (isGrid
            ?  <DocumentListGrid url={url} queryString={queryString}  viewModel={viewModel} />
            :  <DocumentListList url={url} queryString={queryString} viewModel={viewModel} />)
        }

        { viewModel.listModel && entity.ListSettings?.DisplayMode === ListDisplayMode.Paging &&
        <div>
          <Pager
            currentPage={pageNumber}
            itemsTotalCount={viewModel.listModel.Items.TotalCount}
            itemsPerPage={entity.ListSettings?.ItemsPerPage}
            pagerMode={entity.PagerMode}
            pagerQueryTemplate={entity.PagerQueryTemplate}
            pagerTemplate={entity.PagerTemplate}
            context={context}
            />
        </div>
        }
      </div>
    );
}


 const handleDetailView = async (
    detailItem: DetailItem,
    entity: DocumentListEntity,
    context: RequestContext
 ) => {
    let item;
    if (context.detailItem) {
        item = await RestClient.getItem({
            type: detailItem.ItemType,
            id: detailItem.Id,
            provider: detailItem.ProviderName
        });
    } else {
        const items = await ContentListsCommonRestService.getItems(entity, detailItem);
        item = items.Items[0];
    }

    const detailModel = {
        DetailItem: detailItem,
        item: item,
        ViewName: entity.SfDetailViewName
    } as DocumentListModelDetail;

    return detailModel;
};

 const handleListView = async (entity: DocumentListEntity, context: RequestContext, currentPage: number) => {
    const items = await ContentListsCommonRestService.getItems(entity, context.detailItem, context, currentPage);
    const DocumentListMasterModel: DocumentListModelMaster = {
        OpenDetails: !(entity.ContentViewDisplayMode === ContentViewDisplayMode.Master && entity.DetailPageMode === 'SamePage'),
        Items: items
    };

     return DocumentListMasterModel;
 };
