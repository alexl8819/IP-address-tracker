import styled from 'styled-components';
import PropTypes from 'prop-types';

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--white);
  text-align: center;
`;

const HeaderContainer = styled.header`
  background-image: var(--bg-mobile-pattern);
  background-repeat: no-repeat;
  background-size: contain;
  height: 300px;
  padding-top: 15px;
  position: relative;
  z-index: 1;

  @media screen and (min-width: 1024px) {
    background-image: var(--bg-desktop-pattern);
  }
`;

const QueryBar = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const QueryInput = styled.input`
  font-size: 18px;
  padding: 10px;
  border-radius-top-left: 12px;
  border-radius-bottom-left: 12px;
`;

const QuerySubmitBtn = styled.button`
  background-color: var(--very-dark-grey);
  padding: 19px;
  border: none;
  height: auto;
  cursor: pointer;
`;

const ResultPanel = styled.ul`
  list-style-type: none;
  margin: 0 30px;
  padding: 15px 0;
  background-color: var(--white);
  border-radius: 12px;
`;

const Result = styled.li`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 15px;
`;

const ResultTitle = styled.p`
  font-size: 0.675rem;
  color: var(--dark-grey);
  font-weight: 500;
  text-transform: uppercase;
`;

const ResultValue = styled.p`
  color: var(--very-dark-grey);
  font-weight: 500;
  font-size: 1rem;
`;

export default function Header ({ ip, location, timezone, isp, runQuery }) {
  const ArrowIcon = new URL('../images/icon-arrow.svg', import.meta.url);
  const handleQuery = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    runQuery(fd.get('query'));
  };
  return (
    <HeaderContainer>
      <Title>IP Address Tracker</Title>
      <QueryBar onSubmit={handleQuery}>
        <QueryInput type="text" name="query" pattern="" defaultValue={ip} required />
        <QuerySubmitBtn type="submit">
          <img src={ArrowIcon} alt="arrow icon" />
        </QuerySubmitBtn>
      </QueryBar>
      { 
        ip && location && timezone && isp ? 
          <ResultPanel>
            <Result>
              <ResultTitle>ip address</ResultTitle>
              <ResultValue>{ip}</ResultValue>
            </Result>
            <Result>
              <ResultTitle>location</ResultTitle>
              <ResultValue>{location}</ResultValue>
            </Result>
            <Result>
              <ResultTitle>timezone</ResultTitle>
              <ResultValue>UTC {timezone}</ResultValue>
            </Result>
            <Result>
              <ResultTitle>isp</ResultTitle>
              <ResultValue>{isp}</ResultValue>
            </Result>
        </ResultPanel>
        : null
      }
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
