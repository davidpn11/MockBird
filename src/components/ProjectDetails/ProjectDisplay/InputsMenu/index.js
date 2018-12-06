import React from 'react'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import {
  Button,
  Menu,
  MenuItem,
  Popover,
  Position,
  Intent,
  Icon,
} from '@blueprintjs/core'
const InputsMenu = ({ inputOptions, addNewInput, isAdding, disabled }) => {
  const getInputName = name => {
    switch (name) {
      case 'radioButton':
        return 'Radio Button'
      case 'textInput':
        return 'Text Input'
      case 'header':
        return 'Header'
      case 'subheader':
        return 'Sub Header'
      default:
        return ''
    }
  }
  return (
    <Popover
      position={Position.BOTTOM}
      content={
        <Menu>
          {map(inputOptions, input => (
            <MenuItem
              key={input.metadata.type}
              icon={input.metadata.icon}
              text={getInputName(input.metadata.type)}
              onClick={() => addNewInput(input)}
            />
          ))}
        </Menu>
      }
    >
      <Button
        intent={Intent.PRIMARY}
        className="br-100 ma2"
        loading={isAdding}
        large
        disabled={disabled}
      >
        {' '}
        <Icon icon="plus" iconSize={25} />
      </Button>
    </Popover>
  )
}

InputsMenu.propTypes = {
  disabled: PropTypes.bool.isRequired,
  inputOptions: PropTypes.object,
  addNewInput: PropTypes.func,
  isAdding: PropTypes.bool,
}

export default InputsMenu
