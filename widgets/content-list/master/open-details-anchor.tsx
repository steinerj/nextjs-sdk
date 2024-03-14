'use client';

import React from 'react';
import { PageItem } from '../../../rest-sdk/dto/page-item';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { RestClient, RestSdkTypes } from '../../../rest-sdk/rest-client';
import { MixedContentContext } from '../../../editor/widget-framework/mixed-content-context';
import { DetailPageSelectionMode } from '../../content-lists-common/detail-page-selection-mode';

export function OpenDetailsAnchor(props: {
    item: { Original: SdkItem, Title?: {Value?: string} };
    detailPageMode: DetailPageSelectionMode;
    detailPage?: MixedContentContext;
    className?: string;
    text?: string;
 }) {
    const item = props.item;

    const onDetailsOpen = ((sdkItem: SdkItem) => {
        if (props.detailPageMode === 'SamePage') {

            const newUrl = window.location.origin + window.location.pathname + sdkItem.ItemDefaultUrl + window.location.search;
            window.location.href = newUrl;
        } else if (props.detailPage) {
            RestClient.getItem({
                type: RestSdkTypes.Pages,
                id: props.detailPage.ItemIdsOrdered![0],
                provider: props.detailPage.Content[0].Variations![0].Source
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

    function getItemTitle(item: { Original: SdkItem, Title?: {Value?: string} }) {
        return item.Title?.Value || item.Original['Title'];
    }

    return item.Original?.ItemDefaultUrl ?
            (<a href="#"
              className={props.className}
              onClick={(e) => onDetailItemOpenHandler(e, item.Original)}
              >{props.text || getItemTitle(item)}</a>)
            :
            (<>{props.text || getItemTitle(item)}</>);
}
