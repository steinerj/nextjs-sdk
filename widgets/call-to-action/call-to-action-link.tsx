'use client';

import React from 'react';

export function CallToActionLink(props: React.HTMLAttributes<HTMLAnchorElement>) {
    const { children, ...others } = props;
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if ((window as any).DataIntelligenceSubmitScript) {
            event.preventDefault();
            (window as any).DataIntelligenceSubmitScript._client.sentenceClient.writeSentence({
                predicate: 'Call to action',
                object: event.currentTarget.innerText.trim()
            });

            let href = event.currentTarget.getAttribute('href')!;
            let target = event.currentTarget.getAttribute('target') || '_self';
            setTimeout(function () {
                window.open(href, target);
            }, 500);
        }
    };
    return ( <a onClick={handleClick} {...others}>
      {children}
    </a>
    );
}
