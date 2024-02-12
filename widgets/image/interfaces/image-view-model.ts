import { ImageItem } from '../../../rest-sdk/dto/image-item';
import { ThumbnailItem } from '../../../rest-sdk/dto/thumbnail-item';
import { ImageClickAction } from './image-click-action';
import { ImageDisplayMode } from './image-display-mode';

export interface ImageViewModel {
    Item: ImageItem;
    ClickAction: ImageClickAction;
    SelectedImageUrl: string;
    Title: string;
    AlternativeText: string;
    ActionLink: string;
    ImageSize: ImageDisplayMode;
    FitToContainer: boolean;
    Thumbnails: ThumbnailItem[];
    Width?: number;
    Height?: number;
    Attributes: { [key: string]: Array<{ Key: string; Value: string }> };
}
