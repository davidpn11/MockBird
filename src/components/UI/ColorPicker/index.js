import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CompactPicker } from 'react-color'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import styled from 'styled-components'
import { gray400 } from '~/services/utils/colors'

const ColorPickerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  button {
    cursor: pointer;
    opacity: 1;
    margin: 10px;
    width: 50px;
    height: 50px;
    border: ${props =>
      props.color &&
      (props.color.toLowerCase() === 'white' ||
        props.color.toLowerCase() === '#fff' ||
        props.color.toLowerCase() === '#ffffff')
        ? `1px solid ${gray400}`
        : 'none'};
    border-radius: 50%;
    background-color: ${props => (props.color ? props.color : 'white')};
    &:hover {
      opacity: 0.8;
    }
  }
  .compact-picker {
    .flexbox-fix {
     input {
      padding-top: 5px !important;
    }
  }
`
export default class ColorPicker extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
  }

  state = {
    isOpen: false,
  }

  toggleState = () => {
    this.setState(prev => ({ isOpen: !prev.isOpen }))
  }

  render() {
    const { color, onChange } = this.props
    return (
      <ColorPickerWrapper color={color}>
        <Popover
          interactionKind={PopoverInteractionKind.CLICK}
          popoverClassName="pt-popover-content-sizing"
          position={Position.RIGHT}
        >
          <button onClick={this.toggleState} />
          <div>
            <CompactPicker
              name="secundaryColor"
              color={color}
              onChangeComplete={change => onChange(change.hex)}
            />
          </div>
        </Popover>
      </ColorPickerWrapper>
    )
  }
}
