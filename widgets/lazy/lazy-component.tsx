import { WidgetContext } from '../../editor/widget-framework/widget-context';

export async function LazyComponent(props: WidgetContext<any>) {
    return (
      <div id={props.model.Id} />
    );
}

