import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DeletePopover from '../DeletePopover'

const SelectableInput = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  /* & > * {
    width: 100%;
  } */
  .overlay {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: 0.2;
    background-color: ${props => (props.isSelected ? 'gray' : 'transparent')};
  }

  .delete-icon {
    z-index: 3;
    position: absolute;
    top: 5px;
    right: 5px;
    opacity: 0;
    transition: opacity 0.3s linear;
  }

  &:hover {
    .delete-icon {
      opacity: 1;
    }
  }
`

export class ScreenInput extends Component {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    children: PropTypes.any,
    onSelected: PropTypes.func.isRequired,
    deleteInput: PropTypes.func,
  }

  render() {
    const { isSelected, onSelected, children, deleteInput } = this.props
    return (
      <SelectableInput isSelected={isSelected}>
        {children}
        <div className="overlay" onClick={event => onSelected(event)} />
        <span className="delete-icon">
          <DeletePopover onConfirm={deleteInput} header="Delete input?" />
        </span>
      </SelectableInput>
    )
  }
}

export default ScreenInput
