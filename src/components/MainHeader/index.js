import React, { Component } from 'react'
import styled from 'styled-components'
import { primaryColor } from '~/services/utils/colors'
import {
  Popover,
  Button,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core'
import withPermissionHOC from '~/services/auth/withPermissionHOC'

const Wrapper = styled.div`
  background-color: ${primaryColor};
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0)
  );
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 5px 15px;
  width: 100%;
  height: 100px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px;
  & img {
    width: 60px;
    height: 60px;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(16, 22, 26, 0.2),
      inset 0 -1px 0 rgba(16, 22, 26, 0.1);
    &:hover {
      transform: scale(1.05);
    }
  }
`

class MainHeader extends Component {
  state = {}
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState) {
      return { ...nextProps }
    } else {
      return null
    }
  }

  render() {
    const { displayName, photoURL } = this.state.getUser
    const { userLogout } = this.state
    return (
      <Wrapper>
        <Popover
          interactionKind={PopoverInteractionKind.CLICK_TARGET_ONLY}
          popoverClassName="pt-popover-content-sizing"
          position={Position.RIGHT}
        >
          <img intent={Intent.PRIMARY} src={photoURL} alt="Profile" />
          <div>
            <h5>{displayName}</h5>
            <Button onClick={() => userLogout()} className="pt-intent-danger">
              Logout
            </Button>
          </div>
        </Popover>
      </Wrapper>
    )
  }
}

export default withPermissionHOC(MainHeader)
