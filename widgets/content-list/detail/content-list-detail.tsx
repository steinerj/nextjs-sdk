import { ContentListModelDetail, DetailViewModel } from '../../content-lists-common/content-list-detail-model';
import { ContentListEntity } from '../content-list-entity';
import { BlogPostDetail } from './content-list-detail.blog-post';
import { DynamicDetail } from './content-list-detail.dynamic';
import { EventDetail } from './content-list-detail.event';
import { ListItemDetail } from './content-list-detail.list-item';
import { NewsItemDetail } from './content-list-detail.news';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { RestClient } from '../../../rest-sdk/rest-client';
import { RequestContext } from '../../../editor/request-context';

export async function ContentListDetail(props: { detailModel: ContentListModelDetail, entity?: ContentListEntity, context: RequestContext }) {
    const model = props.detailModel;

    let queryParams: { [key: string]: string } = props.context.searchParams || {};
    let dataItem: SdkItem;
    if (queryParams.hasOwnProperty('sf-content-action')) {
        dataItem = await RestClient.getItemWithStatus({
            type: model.DetailItem.ItemType,
            id: model.DetailItem.Id,
            provider: model.DetailItem.ProviderName,
            additionalQueryParams: queryParams
        });
    } else {
        dataItem = await RestClient.getItem({
            type: model.DetailItem.ItemType,
            id: model.DetailItem.Id,
            provider: model.DetailItem.ProviderName
        });
    }
    let detailViewModel: DetailViewModel;
    let attributes: { [key: string]: string } = {};
    if (model.Attributes) {
        model.Attributes.forEach((pair) => {
            attributes[pair.Key] = pair.Value;
        });
    }

    detailViewModel = {
        Attributes: attributes,
        ViewName: model.ViewName,
        DetailItem: dataItem
    };

    return (
      <div {...detailViewModel?.Attributes as any}>
        {detailViewModel?.ViewName === 'Details.BlogPosts.Default' && BlogPostDetail(detailViewModel)}
        {detailViewModel?.ViewName === 'Details.Dynamic.Default' && DynamicDetail(detailViewModel)}
        {detailViewModel?.ViewName === 'Details.Events.Default' && EventDetail(detailViewModel)}
        {detailViewModel?.ViewName === 'Details.ListItems.Default' && ListItemDetail(detailViewModel)}
        {detailViewModel?.ViewName === 'Details.News.Default' && NewsItemDetail(detailViewModel)}
      </div>
    );
}
