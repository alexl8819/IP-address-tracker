import { render, screen } from '@testing-library/react';
import { TextLoading } from './Loading';

describe('Loading component', () => {
  render(<TextLoading message='This is a test' />);

  test('Should have loading text', () => {
    expect(screen.getByText('This is a test')).toBeTruthy();
  });
});
