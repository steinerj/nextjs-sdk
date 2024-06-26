import React, { Fragment } from 'react';
import { ListWithSummaryModel } from './list-with-summary-model';
import { OpenDetailsAnchor } from '../open-details-anchor';
import { ContentListEntity } from '../../content-list-entity';

export function ListWithSummary(props: { model: ListWithSummaryModel, entity?: ContentListEntity }) {
    const model = props.model;
    return (
      <Fragment>
        {model.Items.map((item, index: number) => {
                return (
                  <Fragment key={item.Original.Id}>
                    {index !== 0 && <hr />}
                    <div>
                      {item.Title &&
                        <h5 className={item.Title.Css}>
                          {model.OpenDetails ?
                            <OpenDetailsAnchor
                              detailPageMode={props.entity?.DetailPageMode!}
                              detailPage={props.entity?.DetailPage!}
                              item={item} /> :
                                        (item.Title.Value)
                                    }
                        </h5>}
                      {item.PublicationDate &&
                        <p className={item.PublicationDate.Css}>
                          <small>{item.PublicationDate.Value}</small>
                        </p>
                            }
                      {item.Text && <p className={item.Text.Css}>{item.Text.Value}</p>}
                    </div>
                  </Fragment>
                );
            })}
      </Fragment>
    );
}

