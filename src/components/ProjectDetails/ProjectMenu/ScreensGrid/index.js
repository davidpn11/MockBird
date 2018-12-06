import React from 'react'
import { gray800 } from '~/services/utils/colors'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Icon } from '@blueprintjs/core'
import DeletePopover from '~/components/UI/DeletePopover'

const Grid = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 100px;
  border-collapse: collapse;
  grid-gap: 1px;
  padding: 1px;
  background: ${gray800};
  & .grid-item {
    position: relative;
    cursor: pointer;
    background: whitesmoke;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      background-color: #137cbd;
      color: white;
    }
    > .delete-icon {
      z-index: 2;
      position: absolute;
      top: 1px;
      right: 1px;
      opacity: 0;
      transition: opacity 0.1s linear;
    }

    &:hover {
      .delete-icon {
        opacity: 1;
      }
    }
  }
`

const ScreensGrid = ({
  screens,
  currScreen = {},
  changeCurrScreen,
  addScreen,
  deleteScreen,
}) => (
  <Grid>
    {screens.map(s => (
      <span
        onClick={() => changeCurrScreen(s.id)}
        className={s.id === currScreen.id ? 'grid-item active' : 'grid-item '}
        key={s.id}
      >
        <span className="delete-icon" onClick={event => event.preventDefault()}>
          <DeletePopover
            onConfirm={() => deleteScreen(s.id)}
            header="Delete screen?"
          />
        </span>
        {s.name}
      </span>
    ))}
    <span key="add" className="grid-item " onClick={() => addScreen()}>
      <Icon icon="plus" iconSize={25} color="#137cbd" />
    </span>
  </Grid>
)

ScreensGrid.propTypes = {
  screens: PropTypes.array.isRequired,
  currScreen: PropTypes.object,
  changeCurrScreen: PropTypes.func,
  addScreen: PropTypes.func,
  deleteScreen: PropTypes.func,
}

export default ScreensGrid
