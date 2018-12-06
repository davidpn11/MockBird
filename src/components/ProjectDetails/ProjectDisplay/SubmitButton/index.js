import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from '@blueprintjs/core'
import { grayLight } from '~/services/utils/colors'

const ButtonWrapper = styled.span`
  padding: 20px 100px 18px 100px;
  display: flex;
  justify-content: center;
  color: white;
  font-family: arial;
  font-size: 18px;
  letter-spacing: 1px;
  text-align: center;
  background: ${props => (props.color ? props.color : 'whitesmoke')};
  border-radius: 2px;
  opacity: 1;
  transition: all 0.1s ease-in-out;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }

  & input {
    color: white;
    background: transparent;
    border: 1px solid ${grayLight};
    text-transform: uppercase;
  }
`

class SubmitButton extends Component {
  static propTypes = {
    color: PropTypes.string,
    submitText: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.submitEditing = this.submitEditing.bind(this)
    this.cancelEditing = this.cancelEditing.bind(this)
    this.startEditing = this.startEditing.bind(this)
    this.state = {
      isEditing: false,
      editedValue: '',
    }
  }

  submitEditing() {
    this.props.onChange(this.state.editedValue)
    this.setState(prev => ({ isEditing: false, editedValue: '' }))
  }

  cancelEditing() {
    this.setState(prevState => ({
      isEditing: false,
      editedValue: '',
    }))
  }

  startEditing() {
    const { submitText } = this.props
    this.setState(prevState => ({
      isEditing: true,
      editedValue: submitText,
    }))
  }

  render() {
    const { color, submitText } = this.props
    const { isEditing, editedValue } = this.state
    return (
      <ButtonWrapper color={color}>
        {isEditing ? (
          <div className="flex flex-row items-center">
            <input
              type="text"
              value={editedValue}
              onChange={event =>
                this.setState({ editedValue: event.target.value.toUpperCase() })
              }
            />
            <Icon
              className="ml2"
              iconSize="20"
              icon="tick"
              color="whitesmoke"
              onClick={this.submitEditing}
            />
            <Icon
              className="ml2"
              iconSize="20"
              icon="cross"
              color="whitesmoke"
              onClick={this.cancelEditing}
            />
          </div>
        ) : (
          <span onClick={this.startEditing}>{submitText}</span>
        )}
      </ButtonWrapper>
    )
  }
}

export default SubmitButton
