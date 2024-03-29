import { H1, H2, H3 } from 'components';
import React, { SFC } from 'react';
import styled from 'styled-components';
import { IDefaultProps } from 'types/default-props';

interface IHeadingProps extends IDefaultProps {
  /**
   * See https://github.com/rexxars/commonmark-react-renderer#type-renderer-options
   * for more information on props
   */

  /**
   * [required] Heading level to be rendered (ranges from 1 to 6)
   */
  level: number;

  /**
   * [required] Any children being passed to heading
   */
  children: any;
}

const StyledH1 = styled(H1)`
  padding: 16px 0px 4px 0px;
  border-bottom: 2px solid ${props => props.theme.colors.black};
`;

const StyledH2 = styled(H2)`
  padding: 12px 0px 4px 0px;
`;

const StyledH3 = styled(H3)`
  padding: 8px 0px 4px 0px;
`;

/** Heading */
export const Heading: SFC<IHeadingProps> = props => {
  const renderHeading = () => {
    switch (props.level) {
      case 1:
        return <StyledH1 className={props.className}>{props.children}</StyledH1>;
      case 2:
        return <StyledH2 className={props.className}>{props.children}</StyledH2>;
      case 3:
      default:
        return <StyledH3 className={props.className}>{props.children}</StyledH3>;
    }
  };
  return renderHeading();
};
Heading.displayName = 'Heading';
