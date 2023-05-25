import { render, screen } from '@testing-library/react';
import TrackerResults from './Result';

describe('Result component', () => {
  render(<TrackerResults ip='8.8.8.8' location='Mountain View, California 94035' timezone='-07:00' isp='Google LLC' />);

  test('Should render results passed down as props', () => {
    expect(screen.getByText('8.8.8.8')).toBeTruthy();
    expect(screen.getByText('Mountain View, California 94035')).toBeTruthy();
    expect(screen.getByText('UTC -07:00')).toBeTruthy();
    expect(screen.getByText('Google LLC')).toBeTruthy();
  });
});
