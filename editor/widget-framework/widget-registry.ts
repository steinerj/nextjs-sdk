import { EntityMetadataGenerator } from '@progress/sitefinity-widget-designers-sdk';
import { WidgetMetadata } from './widget-metadata';

export interface WidgetRegistry {
    widgets: {
        [key: string]: WidgetMetadata
    }
}

export function initRegistry(widgetRegistry: WidgetRegistry) {
    const widgets = Object.keys(widgetRegistry.widgets);

    widgets.forEach(widgetKey => {
        const widgetRegistration = widgetRegistry.widgets[widgetKey];

        if (widgetRegistration.entity == null && widgetRegistration.designerMetadata == null) {
            throw new Error(`There should be either entity or designer metadata provided for ${widgetKey} widget`);
        }

        const metadata = EntityMetadataGenerator.extractMetadata(widgetRegistration.entity);
        if (widgetRegistration.entity) {
            if (metadata && widgetRegistration.editorMetadata) {
                if (widgetRegistration.editorMetadata.Name) {
                    metadata.Name = widgetRegistration.editorMetadata.Name;
                }

                if (widgetRegistration.editorMetadata.Title) {
                    metadata.Caption = widgetRegistration.editorMetadata.Title ?? widgetRegistration.editorMetadata.Name;
                }
            }

            widgetRegistration.designerMetadata = metadata;

            delete widgetRegistration.entity;
        }
    });

    return widgetRegistry;
}
