'use client';

import React from 'react';
import { PageViewModel } from '../interfaces/page-view-model';

export function AccordionGroupLink(props: { node: PageViewModel}) {
    const { node } = props;

    const handleClick = (event: React.MouseEvent<HTMLSpanElement>)=> {
        event.preventDefault();
    };

    return ( <span onClick={handleClick} title={node.Title}
      className="nav-link sc-accordion-link sf-group p-0 text-truncate">
      {node.Title}
    </span>
    );
}
