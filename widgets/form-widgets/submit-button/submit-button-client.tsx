'use client';

import React, { useContext } from 'react';
import { FormContext } from '../../form/form-context';

export function SubmitButtonClient(props: {children: React.ReactNode}) {
    const { disabledSubmitButton } = useContext(FormContext);

    return (<button type="submit" className="btn btn-primary" disabled={disabledSubmitButton}>
      {props.children}
    </button>);
}
