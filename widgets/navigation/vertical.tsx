import { PageViewModel } from './interfaces/page-view-model';
import { getClass } from './utils';
import { NavigationItem } from '../../rest-sdk/dto/navigation-item';
import { classNames } from '../../editor/utils/classNames';

export function Vertical(props: {
    items: NavigationItem[];
    className?: string;
 }) {
    const {items, ...customAttrs } = props;
    const renderSubLevelsRecursive: any = (node: PageViewModel) => {

        return (<li key={node.Key} className="nav-item">
          <a className={classNames('nav-link',  getClass(node))} href={node.Url} target={node.LinkTarget}>{node.Title}</a>

          { node.ChildNodes.length > 0 &&
          <ul className="nav flex-column ms-3">
            {node.ChildNodes.map((node:PageViewModel, idx: number)=> {
                            return renderSubLevelsRecursive(node);
                            })
                        }
          </ul>}
        </li>);
    };
    return (
      <nav
        {...customAttrs}
        >

        <ul className="nav flex-column">
          {
                items.map((node:PageViewModel, idx: number)=> {
                    return renderSubLevelsRecursive(node);
                })
            }
        </ul>
      </nav>
    );
}
