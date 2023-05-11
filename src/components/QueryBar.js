import { useState, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { isValidIP, isValidDomain } from '../utilities/net';

const QueryContainer = styled.form`
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

export default function QueryBar ({ result, runQuery }) {
  const inputRef = useRef();
  const [disabled, setDisabled] = useState(false);
  
  const ArrowIcon = new URL('../images/icon-arrow.svg', import.meta.url);
  
  const handleQuery = async (e) => {
    e.preventDefault();

    const query = inputRef.current.trim();

    setDisabled(true);

    if (!query || !query.length || (!isValidDomain(query) && !isValidIP(query))) {
      setDisabled(false);
      return;
    }

    await runQuery(query);
    setDisabled(false);
  };

  return (
    <QueryContainer onSubmit={handleQuery} noValidate>
      <QueryInput type="text" name="query" placeholder="Search for any IP address or domain" onChange={(e) => { inputRef.current = e.target.value }} ref={inputRef} defaultValue={result} disabled={disabled} />
      <QuerySubmitBtn type="submit" disabled={disabled}>
        <img src={ArrowIcon} alt="arrow icon" />
      </QuerySubmitBtn>
    </QueryContainer>
  );
}

QueryBar.propTypes = {
  runQuery: PropTypes.func,
  result: PropTypes.string
};
