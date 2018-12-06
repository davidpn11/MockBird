import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Popover,
  Button,
  PopoverInteractionKind,
  Position,
  Intent,
  Icon,
  H5,
} from '@blueprintjs/core'
import styled from 'styled-components'

const DeleteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
  padding: 10px;

  & > span {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
`

export default class DeletePopover extends Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
    text: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
  }

  state = {
    isOpen: false,
  }

  preventDefault = event => event.preventDefault()

  handleDelete = async event => {
    event.preventDefault()
    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.onConfirm()
      } catch (error) {
        console.error(error)
      } finally {
        this.setState({ isLoading: false, isOpen: false })
      }
    })
  }

  toggleOpen = event => {
    event.preventDefault()
    this.setState(prev => ({ isOpen: !prev.isOpen }))
  }

  render() {
    const { header, text } = this.props
    const { isOpen, isLoading } = this.state
    return (
      <Popover
        interactionKind={PopoverInteractionKind.CLICK_TARGET_ONLY}
        popoverClassName="pt-popover-content-sizing"
        position={Position.RIGHT}
        isOpen={isOpen}
      >
        <Button intent={Intent.DANGER} minimal onClick={this.toggleOpen}>
          <Icon icon="trash" iconSize={15} />
        </Button>
        <DeleteWrapper onClick={this.preventDefault}>
          <H5 className="tc">{header}</H5>
          {text ? <p>{text}</p> : null}
          <span>
            <Button className="mr3" onClick={this.toggleOpen}>
              Cancel
            </Button>
            <Button
              intent={Intent.DANGER}
              onClick={this.handleDelete}
              loading={isLoading}
            >
              Delete
            </Button>
          </span>
        </DeleteWrapper>
      </Popover>
    )
  }
}
