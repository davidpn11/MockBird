import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Text = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 80px 0;
  color: #a8bfc4;
  font-size: ${props => (props.size ? props.size + 'rem' : '1.25rem')};
  font-weight: 500;
  line-height: 33px;
  margin: 10px 20px;
  text-align: center;
`
function HelperText({ text, size }) {
  return <Text size={size}>{text}</Text>
}

HelperText.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.string,
}

export default HelperText
