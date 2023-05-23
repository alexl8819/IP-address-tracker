import { render } from '@testing-library/react';
import QueryBar from './QueryBar';

describe('QueryBar component', () => {
  const { getByDisplayValue } = render(<QueryBar error={true} result='8.8.8.8' updateQuery={() => {}} />);

  const el = getByDisplayValue('8.8.8.8');

  test('Should render input bar with the value 8.8.8.8', () => {
    expect(el).toBeTruthy();
  });

  /*test('Should render input bar with red border indicating an error when error is passed', () => {
    expect(el).toHaveCompiledCss('border', '1px solid red');
  });*/
});
