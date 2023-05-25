import { useState, useEffect } from 'react';
import { styled } from '@compiled/react';
import PropTypes from 'prop-types';

import { isValidIP, isValidDomain } from '../utilities/net';

import ArrowIcon from '../images/icon-arrow.svg';

const QueryContainer = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 25px;

  @media screen and (width >= 1024px) {
    width: 32rem;
  }
`;

const QueryLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const QueryInput = styled.input`
  border: ${(props) => props.hasError ? '1px solid red' : 'none'};
  font-size: 18px;
  padding: 15px 29px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  width: 85%;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%);

  &:active, &:focus {
    outline: none;
  }

  @media screen and (width >= 1024px) {
    width: 89%;
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

  &:disabled {
    cursor: not-allowed;
    background-color: var(--very-dark-grey);
  }

  @media screen and (width >= 1024px) {
    width: 11%;
  }
`;

export default function QueryBar ({ result, error, updateQuery }) {
  const [disabled, setDisabled] = useState(false);
  
  const handleQuery = (e) => {
    e.preventDefault();

    const query = new FormData(e.target).get('query').trim();

    if (!query || !query.length || (!isValidDomain(query) && !isValidIP(query))) {
      throw new Error('Invalid Query');
    }

    updateQuery(query);
  };

  useEffect(() => {
    setDisabled(result.length === 0);
  }, [result]);

  return (
    <QueryContainer onSubmit={handleQuery} noValidate>
      <QueryLabel htmlFor="query">Search</QueryLabel>
      <QueryInput type="text" id="query" name="query" placeholder="Search for any IP address or domain" defaultValue={result} hasError={error} disabled={disabled} />
      <QuerySubmitBtn type="submit" disabled={disabled}>
        <img src={ArrowIcon} alt="arrow icon" />
      </QuerySubmitBtn>
    </QueryContainer>
  );
}

QueryBar.propTypes = {
  result: PropTypes.string,
  updateQuery: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired
};
