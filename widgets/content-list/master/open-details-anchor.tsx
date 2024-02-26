'use client';

import React from 'react';
import { ContentListEntity } from '../content-list-entity';
import { DetailItem } from '../../../editor/detail-item';
import { PageItem } from '../../../rest-sdk/dto/page-item';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { RestClient, RestSdkTypes } from '../../../rest-sdk/rest-client';

export function OpenDetailsAnchor(props: {
    item: any;
    entity?: ContentListEntity;
    className?: string;
    text?: string;
 }) {
    const item = props.item;
    const entity = props.entity;

    const onDetailsOpen = ((sdkItem: any) => {
        const selectedContent = entity!.SelectedItems!.Content[0];
        const detailItem: DetailItem = {
            Id: sdkItem.Id,
            ProviderName: sdkItem.Provider,
            ItemType: selectedContent.Type
        };

        if (entity && entity.DetailPageMode === 'SamePage') {

            const newUrl = window.location.origin + window.location.pathname + sdkItem.ItemDefaultUrl + window.location.search;
            window.location.href = newUrl;
        } else if (entity && entity.DetailPage) {
            RestClient.getItem({
                type: RestSdkTypes.Pages,
                id: entity.DetailPage.ItemIdsOrdered![0],
                provider: entity.DetailPage.Content[0].Variations![0].Source
            }).then((page: SdkItem) => {
                const newUrl = (page as PageItem).ViewUrl + sdkItem.ItemDefaultUrl;
                window.location.href = newUrl;
            });
        }
    });

    function onDetailItemOpenHandler(event: React.MouseEvent<HTMLAnchorElement>, item: SdkItem) {
        event.preventDefault();
        event.stopPropagation();

        onDetailsOpen(item);
    }

    return item.Original?.ItemDefaultUrl ?
            (<a href="#"
              className={props.className}
              onClick={(e) => onDetailItemOpenHandler(e, item.Original)}
              >{props.text || item.Title.Value}</a>)
            :
            (<>{props.text || item.Title.Value}</>);
}
