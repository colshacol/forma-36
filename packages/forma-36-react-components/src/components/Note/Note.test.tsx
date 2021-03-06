import React from 'react';
import { render } from '@testing-library/react';

import axe from '../../utils/axeHelper';
import Note from './Note';

it('renders the component', () => {
  const { container } = render(
    <Note>
      A piece of information that is relevant to the context the user is
      currently in.
    </Note>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

it('renders the component with title', () => {
  const { container } = render(
    <Note noteType="positive" title="Positive title">
      A piece of information that is relevant to the context the user is
      currently in.
    </Note>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

it('renders the component with an additional class name', () => {
  const { container } = render(
    <Note className="my-extra-class">
      A piece of information that is relevant to the context the user is
      currently in.
    </Note>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

it(`has no a11y issues`, async () => {
  const { container } = render(
    <Note>
      A piece of information that is relevant to the context the user is
      currently in.
    </Note>,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
