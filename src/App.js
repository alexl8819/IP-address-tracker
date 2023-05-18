import React from 'react';
import styled from 'styled-components';

import IPAddressTracker from './components/Tracker';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 320px;
  background-image: var(--bg-mobile-pattern);
  background-repeat: no-repeat;
  background-size: contain;

  @media screen and (min-width: 1024px) {
    background-image: var(--bg-desktop-pattern);
  }
`;

export default function App () {
  return (
    <AppContainer>
      <IPAddressTracker />
    </AppContainer>
  );
}
