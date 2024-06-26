import React from 'react';
import { ContentListEntity } from './content-list-entity';
import { ContentListDetail } from './detail/content-list-detail';
import { ContentListModelDetail } from '../content-lists-common/content-list-detail-model';
import { ContentListMaster } from './master/content-list-master';
import { ContentListModelMaster } from '../content-lists-common/content-list-master-model';
import { ContentListsCommonRestService } from '../content-lists-common/content-lists-rest.setvice';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { Pager } from '../pager/pager';
import { htmlAttributes, setHideEmptyVisual } from '../../editor/widget-framework/attributes';
import { DetailItem } from '../../editor/detail-item';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RequestContext } from '../../editor/request-context';
import { ContentViewDisplayMode } from '../content-lists-common/content-view-display-mode';
import { DetailPageSelectionMode } from '../content-lists-common/detail-page-selection-mode';
import { getPageNumber } from '../pager/pager-view-model';

interface ContentListViewModel {
    detailModel?: ContentListModelDetail | null;
    listModel?: ContentListModelMaster | null;
}

export async function ContentList(props: WidgetContext<ContentListEntity>) {
    const attributes = htmlAttributes(props);
    const properties = props.model.Properties;
    const context = props.requestContext;
    let viewModel: ContentListViewModel = {
        detailModel: null,
        listModel: null
    };

    if (properties.SelectedItems?.Content?.length && properties.SelectedItems?.Content[0].Variations) {
        setHideEmptyVisual(attributes, true);
    }

    const pageNumber = getPageNumber(properties.PagerMode, props.requestContext, properties.PagerQueryTemplate, properties.PagerTemplate);

    if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Automatic) {
        if (context.detailItem) {
            viewModel.detailModel = await handleDetailView(context.detailItem, props);
        } else {
            viewModel.listModel = await handleListView(props, context, pageNumber);
        }
    } else if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Detail) {
        if (properties.SelectedItems && properties.SelectedItems.Content && properties.SelectedItems.Content.length > 0) {
            const selectedContent = properties.SelectedItems.Content[0];
            const itemIdsOrdered = properties.SelectedItems.ItemIdsOrdered;
            const detailModel = await handleDetailView({
                Id: itemIdsOrdered ? itemIdsOrdered![0]: '',
                ItemType: selectedContent.Type,
                ProviderName: selectedContent.Variations![0].Source
            }, props);
            viewModel.detailModel = detailModel;
        }
    } else if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Master) {
        viewModel.listModel = await handleListView(props, context, pageNumber);
    }

    return (
      <div {...attributes}>
        {viewModel.detailModel && <ContentListDetail entity={properties} detailModel={viewModel.detailModel} context={context} />}
        {viewModel.listModel && <ContentListMaster  entity={properties} model={viewModel.listModel} />}
        { viewModel.listModel && properties.ListSettings?.DisplayMode === ListDisplayMode.Paging &&
        <div className="mt-2">
          <Pager
            currentPage={pageNumber}
            itemsTotalCount={viewModel.listModel.Items.TotalCount}
            pagerMode={properties.PagerMode}
            itemsPerPage={properties.ListSettings.ItemsPerPage}
            pagerQueryTemplate={properties.PagerQueryTemplate}
            pagerTemplate={properties.PagerTemplate}
            context={context}
            />
        </div>
        }
      </div>
    );
}

function getAttributesWithClasses(props: WidgetContext<ContentListEntity>, fieldName: string, additionalClasses: string | null): Array<{ Key: string, Value: string}> {
    const viewCss = props.model.Properties.CssClasses?.find(x => x.FieldName === fieldName);

    const contentListAttributes = props.model.Properties.Attributes?.ContentList || [];
    let classAttribute = contentListAttributes.find(x => x.Key === 'class');
    if (!classAttribute) {
        classAttribute = {
            Key: 'className',
            Value: ''
        };

        contentListAttributes.push(classAttribute);
    }

    if (viewCss) {
        classAttribute.Value += ` ${viewCss.CssClass}`;
    }

    if (additionalClasses) {
        classAttribute.Value += ` ${additionalClasses}`;
    }

    return contentListAttributes;
}

function handleDetailView(detailItem: DetailItem, props: WidgetContext<ContentListEntity>) {
    const contentListAttributes = getAttributesWithClasses(props, 'Details view', null);

    const detailModel = {
        Attributes: contentListAttributes,
        DetailItem: detailItem,
        ViewName: props.model.Properties.SfDetailViewName
    } as ContentListModelDetail;

    return detailModel;
}

async function handleListView(props: WidgetContext<ContentListEntity>, requestContext: RequestContext, currentPage: number) {
    const listFieldMapping: {[key: string]: string} = {};
    props.model.Properties.ListFieldMapping?.forEach((entry) => {
        listFieldMapping[entry.FriendlyName!] = entry.Name!;
    });

    const fieldCssClassMap: {[key: string]: string} = {};
    props.model.Properties.CssClasses?.forEach((entry) => {
        fieldCssClassMap[entry.FieldName] = entry.CssClass;
    });

    const items = await ContentListsCommonRestService.getItems(props.model.Properties, props.requestContext.detailItem, requestContext, currentPage);

    let contentListMasterModel: ContentListModelMaster = {
        OpenDetails: !(props.model.Properties.ContentViewDisplayMode === ContentViewDisplayMode.Master && props.model.Properties.DetailPageMode === DetailPageSelectionMode.SamePage),
        FieldCssClassMap: fieldCssClassMap,
        FieldMap: listFieldMapping,
        Items: items,
        ViewName: props.model.Properties.SfViewName as any,
        Attributes: getAttributesWithClasses(props, 'Content list', 'row row-cols-1 row-cols-md-3')
    };

    return contentListMasterModel;
}
