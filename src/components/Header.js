import styled from 'styled-components';
import PropTypes from 'prop-types';

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--white);
  text-align: center;
`;

const HeaderContainer = styled.header`
  background-image: var(--bg-mobile-pattern);
  background-repeat: no-repeat;
  background-size: contain;
  height: 300px;
  padding-top: 15px;
  padding-left: 25px;
  padding-right: 25px;
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
`;
//margin: 0 25px;
const ResultPanel = styled.ul` 
  list-style-type: none;
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
  margin-bottom: 5px;
`;

const ResultValue = styled.p`
  color: var(--very-dark-grey);
  font-weight: 500;
  font-size: 1rem;
`;


export default function Header ({ ip, location, timezone, isp, runQuery }) {
  const ArrowIcon = new URL('../images/icon-arrow.svg', import.meta.url);
  const handleQuery = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await runQuery(fd.get('query'));
  };
  return (
    <HeaderContainer>
      <Title>IP Address Tracker</Title>
      <QueryBar onSubmit={handleQuery}>
        <QueryInput type="text" name="query" pattern="((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))" defaultValue={ip} required />
        <QuerySubmitBtn type="submit">
          <img src={ArrowIcon} alt="arrow icon" />
        </QuerySubmitBtn>
      </QueryBar>
      <ResultPanel>
        { 
          ip ? 
          <Result>
            <ResultTitle>ip address</ResultTitle>
            <ResultValue>{ip}</ResultValue>
          </Result> : null
        }
        {
          location ?
          <Result>
            <ResultTitle>location</ResultTitle>
            <ResultValue>{location}</ResultValue>
          </Result> : null
        }
        {
          timezone ?
          <Result>
            <ResultTitle>timezone</ResultTitle>
            <ResultValue>UTC {timezone}</ResultValue>
          </Result> : null
        }
        {
          isp ?
          <Result>
            <ResultTitle>isp</ResultTitle>
            <ResultValue>{isp}</ResultValue>
          </Result> : null
        }
      </ResultPanel>
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
