import { storiesOf } from '@storybook/react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import docs from './docs.mkd';
import { renderers } from 'components/atoms/fonts/markdown';

storiesOf('_DOCS', module).add('Code Conventions', () => (
  <ReactMarkdown renderers={renderers} source={docs} />
));
