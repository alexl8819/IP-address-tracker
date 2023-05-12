import styled from 'styled-components';
import PropTypes from 'prop-types';

import QueryBar from './QueryBar';
import Loading from './Loading';

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--white);
  text-align: center;
`;

const ResultContainer = styled.header`
  height: 280px;
  padding-top: 15px;
  padding-left: 25px;
  padding-right: 25px;
  position: relative;
  z-index: 1;
`;

const ResultView = styled.ol` 
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 15px 0;
  background-color: var(--white);
  border-radius: 12px;

  @media screen and (min-width: 1024px) {
    flex-direction: row;
  }
`;

const Result = styled.li`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 15px;

  @media screen and (min-width: 1024px) {
    text-align: left;
    padding: 8px 5px;
    margin-bottom: 0;

    &:last-child div {
      border-right: none;
    }
  }
`;

const InnerResult = styled.div`  
  @media screen and (min-width: 1024px) {
    width: 250px;
    min-height: 95px;
    padding: 0 15px;
    border-right: 1px solid var(--light-grey);
  }
`;

const ResultTitle = styled.p`
  font-size: 0.675rem;
  color: var(--dark-grey);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  margin-bottom: 8px;

  @media screen and (min-width: 1024px) {
    font-size: 0.8rem;
  }
`;

const ResultValue = styled.p`
  font-size: 1rem;
  color: var(--very-dark-grey);
  font-weight: 500;

  @media screen and (min-width: 1024px) {
    font-size: 1.25rem;
  }
`;

export default function TrackerResult ({ ip, location, timezone, isp, updateQuery }) {
  return (
    <ResultContainer>
      <Title>IP Address Tracker</Title>
      <QueryBar updateQuery={updateQuery} result={ip} />
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
    </ResultContainer>
  );
}

TrackerResult.propTypes = {
  ip: PropTypes.string,
  location: PropTypes.string,
  timezone: PropTypes.string,
  isp: PropTypes.string,
  runQuery: PropTypes.func
};
