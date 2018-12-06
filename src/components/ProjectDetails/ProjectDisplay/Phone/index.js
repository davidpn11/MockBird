import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
const PhoneWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 400px;
  width: 100%;
  min-width: 200px;
  background: #505f75;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 0 1px hsla(0, 0%, 6%, 0.05), 0 5px 10px hsla(0, 0%, 6%, 0.1),
    0 15px 40px hsla(0, 0%, 6%, 0.2);
  .circle-top {
    width: 10px;
    height: 10px;
    background: #6d809c;
    border-radius: 100%;
  }
  .circle-bottom {
    width: 55px;
    height: 55px;
    border-radius: 100%;
    background: #6d809c;
  }
  .content {
    height: 90%;
    width: 95%;
    margin: 10px 0;
    border-radius: 3px;
    background: white;
  }
`

function Phone(props) {
  return (
    <PhoneWrapper>
      <span className="circle-top" />
      <div className="content">{props.children}</div>
      <span className="circle-bottom" />
    </PhoneWrapper>
  )
}

Phone.propTypes = {
  children: PropTypes.object,
}

export default Phone
