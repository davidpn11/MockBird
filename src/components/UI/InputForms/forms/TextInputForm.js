import React from 'react'
import { FormGroup, InputGroup, Intent, Switch } from '@blueprintjs/core'
import PropTypes from 'prop-types'
import FormHandler from '~/components/FormHandler'
import { varNameRegex } from '~/services/utils/constants'

const TextInputForm = ({
  isRequired,
  varName,
  placeholder,
  onChange,
  id,
  errorMessage = '',
  mask = '',
}) => {
  const handleValidate = values => {
    let errors = {}

    if (!varNameRegex.test(values.varName)) {
      errors.varName =
        'Variable name must be from 4 to 20 characters in length, only allow letters and numbers, no special characters'
    }

    if (!values.placeholder) {
      errors.placeholder = 'Is required'
    }
    return errors
  }

  const resetValues = (prevProps, newProps) =>
    prevProps.initialValues.id !== newProps.initialValues.id

  return (
    <FormHandler
      initialValues={{ isRequired, varName, placeholder, id, errorMessage }}
      resetValues={resetValues}
      onValidate={handleValidate}
      autoSave={values => onChange(values)}
    >
      {({ values, errors, handleChange }) => (
        <div className="mt4 mh3 input-form flex-column">
          <FormGroup
            label="Input's variable name"
            labelFor="input-name"
            labelInfo="(Name that will be displayed at the JSON)"
            intent={errors.varName ? Intent.DANGER : Intent.NONE}
          >
            <InputGroup
              id="input-var-name"
              placeholder="Name"
              name="varName"
              intent={errors.varName ? Intent.DANGER : Intent.NONE}
              value={values.varName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup
            label="Input's placeholder"
            labelFor="input-placeholder"
            intent={errors.placeholder ? Intent.DANGER : Intent.NONE}
            helperText={errors.placeholder || ''}
          >
            <InputGroup
              id="input-placeholder"
              value={values.placeholder}
              name="placeholder"
              placeholder="Placeholder"
              intent={errors.placeholder ? Intent.DANGER : Intent.NONE}
              onChange={handleChange}
            />
          </FormGroup>
          <span className="mv3">
            <Switch
              large={true}
              id="input-is-required"
              name="isRequired"
              label="Is Required"
              checked={values.isRequired}
              onChange={handleChange}
            />
          </span>
          <FormGroup
            label="Error Message"
            labelFor="input-error-mesage"
            labelInfo=" (Add a message in case input error)"
            intent={errors.placeholder ? Intent.DANGER : Intent.NONE}
            helperText={errors.placeholder || ''}
          >
            <InputGroup
              id="input-error-mesage"
              value={values.errorMessage}
              name="errorMessage"
              placeholder="Error message"
              intent={errors.errorMessage ? Intent.DANGER : Intent.NONE}
              onChange={handleChange}
            />
          </FormGroup>
        </div>
      )}
    </FormHandler>
  )
}
TextInputForm.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  varName: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  mask: PropTypes.string,
}

export default TextInputForm
