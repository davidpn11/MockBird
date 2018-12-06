import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import FormHandler from '~/components/FormHandler'
import ColorPicker from '~/components/UI/ColorPicker'

function HeaderForm({ text, textColor, textSize, onChange, id }) {
  const handleValidate = values => {
    let errors = {}
    if (!values.text) {
      errors.text = 'Text is Required'
    }

    if (!values.textColor) {
      errors.text = 'Text Color is Required'
    }

    return errors
  }

  const resetValues = (prevProps, newProps) =>
    prevProps.initialValues.id !== newProps.initialValues.id

  return (
    <FormHandler
      initialValues={{ text, textColor, textSize, id }}
      resetValues={resetValues}
      onValidate={handleValidate}
      autoSave={values => onChange(values)}
    >
      {({ values, errors, handleChange, directChange }) => (
        <div className="mt4 mh3 input-form flex-column">
          <FormGroup
            label="Header's text"
            labelFor="header-text"
            intent={errors.text ? Intent.DANGER : Intent.NONE}
          >
            <InputGroup
              id="header-text"
              placeholder="Name"
              name="text"
              intent={errors.text ? Intent.DANGER : Intent.NONE}
              value={values.text}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup label="Text Size" labelFor="textSize">
            <div className="bp3-select bp3-fill">
              <select
                name="textSize"
                onChange={handleChange}
                defaultValue={textSize}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </FormGroup>
          <FormGroup label="Text color">
            <ColorPicker
              name="textColor"
              color={values.textColor}
              onChange={newColor => directChange('textColor', newColor)}
            />
          </FormGroup>
        </div>
      )}
    </FormHandler>
  )
}

HeaderForm.propTypes = {
  text: PropTypes.string,
  textColor: PropTypes.string,
  textSize: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
}

export default HeaderForm
