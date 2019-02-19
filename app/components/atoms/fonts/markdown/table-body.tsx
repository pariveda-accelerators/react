import React from 'react';
import { IDefaultProps } from 'types/default-props';

interface ITableBodyProps extends IDefaultProps {
  /**
   * See https://github.com/rexxars/commonmark-react-renderer#type-renderer-options
   * for more information on props
   */

  /**
   * [required] Any children being passed to TableBody
   */
  children: any;
}

export const TableBody: React.SFC<ITableBodyProps> = props => (
  <tbody className={props.className}>{props.children}</tbody>
);
