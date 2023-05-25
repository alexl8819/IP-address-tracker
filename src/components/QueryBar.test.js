import { fireEvent, render, screen, within } from '@testing-library/react';
import QueryBar from './QueryBar';

describe('QueryBar component', () => {
  const mocked = jest.fn();

  render(<QueryBar error={false} result='8.8.8.8' updateQuery={mocked} />);
  
  const el = screen.getByRole('form', { name: 'Search' });
  const input = within(el).getByDisplayValue('8.8.8.8');

  test('Should not call updateQuery if invalid query input (ipv4, ipv6 or domains)', () => {
    fireEvent.change(input, {target: { value: 'thisisnotvalid'}}); 
    fireEvent.click(within(el).getByRole('button'));
    
    expect(mocked).not.toHaveBeenCalled();
  });

  test('Should render input bar with the value 8.8.8.8', () => {
    expect(input).toBeTruthy();
  });
});
