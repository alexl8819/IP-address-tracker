import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it("renders app heading", () => {
    render(<App />);
    expect(screen.getByText('IP Address Tracker')).toBeTruthy();
  });
});
