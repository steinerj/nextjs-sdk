export class RootUrlService {
    public static getClientCmsUrl() {
        let publicUrl = `${process.env['NEXT_PUBLIC_CMS_URL'] || ''}`;
        if (publicUrl.endsWith('/')) {
            publicUrl.substring(0, publicUrl.length - 1);
        }

        return publicUrl;
    }

    public static getClientServiceUrl() {
        return `${RootUrlService.getClientCmsUrl()}/${RootUrlService.getWebServicePath()}`;
    }

    public static getServerCmsUrl() {
        let rootUrl: string = '';
        if (process.env.NODE_ENV === 'development') {
            rootUrl = process.env['PROXY_URL'] as string;
        } else {
            rootUrl = process.env['SF_CMS_URL'] as string;
        }

        if (rootUrl.endsWith('/')) {
            rootUrl.substring(0, rootUrl.length - 1);
        }

        return rootUrl;
    }

    public static getServerCmsServiceUrl() {
        return `${RootUrlService.getServerCmsUrl()}/${RootUrlService.getWebServicePath()}`;
    }

    public static getWebServicePath() {
        return 'api/default';
    }
}
