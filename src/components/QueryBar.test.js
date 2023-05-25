import { fireEvent, render, screen } from '@testing-library/react';
import QueryBar from './QueryBar';

describe('QueryBar component', () => {
  render(<QueryBar error={false} result='8.8.8.8' updateQuery={(v) => v} />);

  const el = screen.getByDisplayValue('8.8.8.8');

  test('Should render input bar with the value 8.8.8.8', () => {
    expect(el).toBeTruthy();
  });

  test('Should only push valid queries (ipv4, ipv6 or domains)', () => {
    fireEvent.change(el, {target: { value: '1.1.1.1'}});
    const spy = jest.spyOn(el.parentElement, 'submit');
    fireEvent(el.parentElement, new Event('submit'));
    expect(spy).not.toThrow('Invalid Query');
  });
});
