import { styled } from '@compiled/react';
import PropTypes from 'prop-types';

import { Loading } from './Loading';

const ResultView = styled.ol` 
  display: flex;
  flex-direction: column;
  list-style-type: none;
  width: 100%;
  padding: 25px 5px;
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%);

  @media screen and (width >= 1024px) {
    width: 52rem;
    flex-direction: row;
    justify-content: space-evenly;
  }

  @media screen and (width >= 1280px) {
    width: 64rem;
  }
`;

const Result = styled.li`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  margin-bottom: 15px;

  @media screen and (width >= 1024px) {
    text-align: left;
    padding: 8px 5px;
    margin-bottom: 0;

    &:last-child div {
      border-right: none;
    }
  }
`;

const InnerResult = styled.div`  
  @media screen and (width >= 1024px) {
    min-width: 180px;
    height: 100px;
    padding: 0 15px;
    border-right: 1px solid var(--light-grey);
  }

  @media screen and (width >= 1280px) {
    height: 75px;
  }
`;

const ResultTitle = styled.p`
  font-size: 0.675rem;
  color: var(--dark-grey);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  margin-top: -5px;
  margin-bottom: 8px;

  @media screen and (width >= 1024px) {
    font-size: 0.8rem;
  }
`;

const ResultValue = styled.p`
  font-size: 1rem;
  color: var(--very-dark-grey);
  font-weight: 500;

  @media screen and (width >= 1024px) {
    font-size: 1.25rem;
  }
`;

export default function TrackerResults ({ ip, location, timezone, isp }) {
  return (
    <ResultView>
      <Result>
        <InnerResult>
          <ResultTitle>ip address</ResultTitle>
          <ResultValue>{ip || <Loading />}</ResultValue>
        </InnerResult>
      </Result>
      <Result>
        <InnerResult>
          <ResultTitle>location</ResultTitle>
          <ResultValue>{location || <Loading />}</ResultValue>
        </InnerResult>
      </Result>
      <Result>
        <InnerResult>
          <ResultTitle>timezone</ResultTitle>
          <ResultValue>{timezone ? `UTC ${timezone}` : <Loading />}</ResultValue>
        </InnerResult>
      </Result>
      <Result>
        <InnerResult>
          <ResultTitle>isp</ResultTitle>
          <ResultValue>{isp || <Loading />}</ResultValue>
        </InnerResult>
      </Result>
    </ResultView>
  );
}

TrackerResults.propTypes = {
  ip: PropTypes.string,
  location: PropTypes.string,
  timezone: PropTypes.string,
  isp: PropTypes.string
};
