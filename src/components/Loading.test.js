import 'cross-fetch/polyfill';

import { render } from '@testing-library/react';
import { TextLoading } from './Loading';

describe('Loading component', () => {
  const { getByText } = render(<TextLoading message='This is a test' />);

  test('Should have loading text', () => {
    expect(getByText('This is a test')).toBeTruthy();
  });
});
