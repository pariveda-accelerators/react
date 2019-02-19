import { Fonts } from 'components/atoms';
import React from 'react';
import styled from 'styled-components';
import { IDefaultProps } from 'types/default-props';

interface IParagraphProps extends IDefaultProps {
  /**
   * See https://github.com/rexxars/commonmark-react-renderer#type-renderer-options
   * for more information on props
   */

  /**
   * [required] Any children being passed to paragraph
   */
  children: any;
}

const ParagraphFont = styled(Fonts.Body1)`
  margin: 4px 0px 16px 0px;
`;

export const Paragraph: React.SFC<IParagraphProps> = props => (
  <ParagraphFont className={props.className}>{props.children}</ParagraphFont>
);
