import Skeleton from 'react-loading-skeleton';
import { styled } from '@compiled/react';
import PropTypes from 'prop-types';

const FullContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export function Loading () {
  return (
    <Skeleton />
  );
}

export function TextLoading ({ message }) {
  return (
    <FullContainer>
      <p>{ message || 'Loading...'}</p>
    </FullContainer>
  );
}

TextLoading.propTypes = {
  message: PropTypes.string
};
