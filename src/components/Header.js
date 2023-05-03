import styled from 'styled-components';
import PropTypes from 'prop-types';

import ArrowIcon from '../images/icon-arrow.svg';

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--dark-grey);
`;

const HeaderContainer = styled.header`
  background-image: no-repeat url('./images/pattern-bg-mobile.png');
  background-size: contain;
  height: 300px;

  @media screen and (min-width: 1024px) {
    background-image: no-repeat url('./images/pattern-bg-desktop.png');
  }
`;

const QueryBar = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const QueryInput = styled.input`
  font-size: 18px;
  padding: 10px;
`;

const QuerySubmitBtn = styled.button`
  background-color: var(--very-dark-grey);
  padding: 8px;
`;

const ResultPanel = styled.ul`
  list-style-type: none;
`;

const Result = styled.li`
  display: flex;
  flex-direction: column;
`;

export default function Header ({ ip, location, timezone, isp, queryFn }) {
  const handleQuery = (e) => {
    e.preventDefault();
    // queryFn(e.target.value);
  };
  return (
    <HeaderContainer>
      <Title>IP Address Tracker</Title>
      <QueryBar onSubmit={handleQuery}>
        <QueryInput type="text" pattern="" value={ip} required />
        <QuerySubmitBtn type="submit">
          <ArrowIcon />
        </QuerySubmitBtn>
      </QueryBar>
      { 
        ip && location && timezone && isp ? 
          <ResultPanel>
            <Result>
              <ResultTitle>ip address</ResultTitle>
              <ResultValue>{ip}</ResultValue>
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
  queryFn: PropTypes.func
};
