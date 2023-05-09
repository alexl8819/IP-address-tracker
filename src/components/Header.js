import styled from 'styled-components';
// import isValidHostname from 'is-valid-hostname';
// import { isIPv4, isIPv6 } from 'is-ip';
import PropTypes from 'prop-types';

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--white);
  text-align: center;
`;

const HeaderContainer = styled.header`
  height: 280px;
  padding-top: 15px;
  padding-left: 25px;
  padding-right: 25px;
  position: relative;
  z-index: 1;
`;

const QueryBar = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 25px;
`;

const QueryInput = styled.input`
  border: none;
  font-size: 18px;
  padding: 15px 29px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  width: 85%;

  &:active, &:focus {
    outline: none;
  }
`;

const QuerySubmitBtn = styled.button`
  display: flex;
  justify-content: center;
  background-color: var(--very-dark-grey);
  padding: 22px 15px;
  border: none;
  height: 58px;
  cursor: pointer;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  width: 15%;

  &:hover {
    background-color: var(--dark-grey);
  }
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
    padding: 8px 25px;
    margin-bottom: 0;
  }
`;

const InnerResult = styled.div`
  @media screen and (min-width: 1024px) {
    margin-right: 10px;
    border-right: 1px solid var(--light-grey);
  }

  &:last-child {
    border-right: none;
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

export default function Header ({ ip, location, timezone, isp, runQuery }) {
  const ArrowIcon = new URL('../images/icon-arrow.svg', import.meta.url);
  const handleQuery = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const query = fd.get('query');
    if (!query /*|| !isIPv4(query) || !isIPv6(query)*/) {
      console.error('invalid query');
      return;
    }
    await runQuery(query);
  };
  return (
    <HeaderContainer>
      <Title>IP Address Tracker</Title>
      <QueryBar onSubmit={handleQuery} noValidate>
        <QueryInput type="text" name="query" placeholder="Search for any IP address or domain" defaultValue={ip} required />
        <QuerySubmitBtn type="submit">
          <img src={ArrowIcon} alt="arrow icon" />
        </QuerySubmitBtn>
      </QueryBar>
      <ResultView>
        { 
          ip ? 
          <Result>
            <InnerResult>
              <ResultTitle>ip address</ResultTitle>
              <ResultValue>{ip}</ResultValue>
            </InnerResult>
          </Result> : null
        }
        {
          location ?
          <Result>
            <InnerResult>
              <ResultTitle>location</ResultTitle>
              <ResultValue>{location}</ResultValue>
            </InnerResult>
          </Result> : null
        }
        {
          timezone ?
          <Result>
            <InnerResult>
              <ResultTitle>timezone</ResultTitle>
              <ResultValue>UTC {timezone}</ResultValue>
            </InnerResult>
          </Result> : null
        }
        {
          isp ?
          <Result>
            <InnerResult>
              <ResultTitle>isp</ResultTitle>
              <ResultValue>{isp}</ResultValue>
            </InnerResult>
          </Result> : null
        }
      </ResultView>
    </HeaderContainer>
  );
}

Header.propTypes = {
  ip: PropTypes.string,
  location: PropTypes.string,
  timezone: PropTypes.string,
  isp: PropTypes.string,
  runQuery: PropTypes.func
};
