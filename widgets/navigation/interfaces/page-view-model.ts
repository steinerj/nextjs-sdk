import { PageSiteMapNode } from './page-sitemap-node';

export interface PageViewModel {
    Key: string;
    Title:string;
    Url: string;
    LinkTarget: string;
    IsCurrentlyOpened: boolean;
    HasChildOpen: boolean;
    PageSiteMapNode: PageSiteMapNode;
    ChildNodes: PageViewModel[];
  }
