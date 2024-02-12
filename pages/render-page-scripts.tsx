
'use client';

import { RootUrlService } from '../rest-sdk/root-url.service';
import { LayoutServiceResponse } from '../rest-sdk/dto/layout-service.response';
import { PageScriptLocation } from '../rest-sdk/dto/scripts';

export function RenderPageScripts({ layout }: { layout: LayoutServiceResponse }) {
    if (typeof window !== 'undefined') {
        layout.Scripts.forEach((script) => {
            const scriptElementName = script.IsNoScript ? 'noscript' : 'script';
            const scriptElement = document.createElement(scriptElementName);
            if (script.Source) {
                if (script.Source[0] === '/') {
                    script.Source = RootUrlService.getClientCmsUrl() + script.Source;
                }

                scriptElement.setAttribute('src', script.Source);
            }

            script.Attributes.forEach((attribute) => {
                scriptElement.setAttribute(attribute.Key, attribute.Value);
            });

            if (script.Value) {
                scriptElement.innerText = script.Value;
            }

            if (script.Location === PageScriptLocation.BodyBottom) {
                window.document.body.appendChild(scriptElement);
            } else if (script.Location === PageScriptLocation.BodyTop) {
                window.document.body.prepend(scriptElement);
            } else if (script.Location === PageScriptLocation.Head) {
                window.document.head.appendChild(scriptElement);
            }
        });
    }

    return <></>;
}


