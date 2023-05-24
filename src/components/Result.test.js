import { render } from '@testing-library/react';
import TrackerResults from './Result';

describe('Result component', () => {
  const { getByText } = render(<TrackerResults ip='8.8.8.8' location='Mountain View, California 94035' timezone='-07:00' isp='Google LLC' />);

  test('Should render results passed down as props', () => {
    expect(getByText('8.8.8.8')).toBeTruthy();
    expect(getByText('Mountain View, California 94035')).toBeTruthy();
    expect(getByText('UTC -07:00')).toBeTruthy();
    expect(getByText('Google LLC')).toBeTruthy();
  });
});
