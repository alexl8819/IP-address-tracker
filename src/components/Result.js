import styled from 'styled-components';
import PropTypes from 'prop-types';

import QueryBar from './QueryBar';
import Loading from './Loading';

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--white);
  text-align: center;
  margin-bottom: 10px;
`;

const ResultContainer = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  padding-top: 175px;
  padding-left: 25px;
  padding-right: 25px;
  position: relative;
  z-index: 1;

  @media screen and (width >= 1024px) {
    height: 200px;
    padding-top: 150px;
  }

  @media screen and (width >= 1280px) {
    height: 240px;
    padding-top: 125px;
  }
`;

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

export default function TrackerResult ({ ip, location, timezone, isp, error, updateQuery }) {
  return (
    <ResultContainer>
      <Title>IP Address Tracker</Title>
      <QueryBar updateQuery={updateQuery} error={error} result={ip} />
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
  error: PropTypes.bool.isRequired,
  updateQuery: PropTypes.func.isRequired
};
