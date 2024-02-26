'use client';

import React from 'react';
import { PageViewModel } from '../interfaces/page-view-model';

export function AccordionLink(props:  { node: PageViewModel}) {
    const { node } = props;
    const handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
        (event.target as HTMLAnchorElement).parentElement!.removeAttribute('data-bs-toggle');
    };
    return ( <a onMouseDown={handleMouseDown} title={node.Title} className="nav-link sc-accordion-link p-0 text-truncate"
      href={node.Url} target={node.LinkTarget}>
      {node.Title}
    </a>
    );
}
