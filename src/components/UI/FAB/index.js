import React from 'react'
import styled from 'styled-components'
import { accentColor } from '~/services/utils/colors'
import { Button } from '@blueprintjs/core'
import PropTypes from 'prop-types'

const FloatButton = styled(Button)`
  position: fixed;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 30px;
  height: ${props => (props.size ? props.size + 'px' : '70px')};
  width: ${props => (props.size ? props.size + 'px' : '70px')};
  border-radius: 50% !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0)
  ) !important;
  background-color: ${props =>
    props.color ? props.color : accentColor}!important;
  outline: none;
`

const FAB = ({ onClick, icon, color, size }) => (
  <FloatButton
    icon={icon}
    onClick={() => onClick()}
    color={color}
    size={size}
  />
)

FAB.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
}

export default FAB
