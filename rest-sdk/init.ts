import { ServiceMetadata } from './service-metadata';

export async function initRestSdk() {
    await ServiceMetadata.fetch();
}
