import React from 'react'
import {
  FormGroup,
  InputGroup,
  Intent,
  Switch,
  Button,
} from '@blueprintjs/core'
import PropTypes from 'prop-types'
import FormHandler from '~/components/FormHandler'
import isEmpty from 'lodash/isEmpty'
import { varNameRegex } from '~/services/utils/constants'

const RadioInputForm = ({
  isRequired,
  title,
  varName,
  options = [],
  defaultOption,
  onChange,
}) => {
  const handleValidate = values => {
    let errors = {}
    if (!values.title) {
      errors.title = 'Title is required'
    }
    if (!varNameRegex.test(values.varName)) {
      errors.varName =
        'Variable name must be from 4 to 20 characters in length, only allow letters and numbers, no special characters'
    }

    const optionErrors = values.options.reduce((optErrors, opt, index) => {
      let hasError = {}
      if (!opt.label) {
        hasError.label = 'The label is required'
      }
      if (!opt.value) {
        hasError.value = 'The value is required'
      }

      const filterValues = values.options.filter(
        (o, i) => o.value === opt.value && i !== index
      )
      if (filterValues.length > 0) {
        hasError.value = 'Duplicated Value'
      }

      if (!isEmpty(hasError)) {
        return { ...optErrors, [index]: hasError }
      } else {
        return optErrors
      }
    }, {})
    if (!isEmpty(optionErrors)) {
      errors.options = optionErrors
    }

    return errors
  }

  const resetValues = (prevProps, newProps) =>
    prevProps.initialValues.varName !== newProps.initialValues.varName

  const addNewOption = directChange => {
    const newOptions = [...options, { value: 'value', label: 'label' }]
    directChange('options', newOptions)
  }

  const changeOption = (index, opt, directChange) => {
    let newOptions = [...options]
    newOptions[index] = opt
    directChange('options', newOptions)
  }

  const safeErrorAccess = (errors, index) => {
    return errors.options && errors.options[index] ? errors.options[index] : {}
  }

  const getOptions = (valueOptions, errors, directChange) =>
    valueOptions.map((opt, index) => (
      <div key={index} className="flex flex-row">
        <FormGroup label="Label">
          <InputGroup
            placeholder="Label"
            value={opt.label}
            intent={
              safeErrorAccess(errors, index).label ? Intent.DANGER : Intent.NONE
            }
            onChange={event =>
              changeOption(
                index,
                {
                  label: event.target.value,
                  value: opt.value,
                },
                directChange
              )
            }
          />
        </FormGroup>

        <FormGroup label="Value" className="ml2">
          <InputGroup
            placeholder="Value"
            value={opt.value}
            intent={
              safeErrorAccess(errors, index).value ? Intent.DANGER : Intent.NONE
            }
            onChange={event =>
              changeOption(
                index,
                {
                  label: opt.label,
                  value: event.target.value,
                },
                directChange
              )
            }
          />
        </FormGroup>
      </div>
    ))

  return (
    <FormHandler
      initialValues={{
        isRequired,
        title,
        varName,
        options,
        defaultOption,
      }}
      resetValues={resetValues}
      onValidate={handleValidate}
      autoSave={values => onChange(values)}
    >
      {({ values, errors, handleChange, directChange }) => (
        <div className="mt4 mh3 input-form flex-column">
          <FormGroup
            label="Input's variable name"
            labelFor="input-name"
            labelInfo="(Name that will be displayed at the JSON)"
            intent={errors.varName ? Intent.DANGER : Intent.NONE}
            helperText={errors.varName || ''}
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
            label="Input's Title"
            labelFor="input-title"
            intent={errors.title ? Intent.DANGER : Intent.NONE}
            helperText={errors.title || ''}
          >
            <InputGroup
              id="input-title"
              intent={errors.title ? Intent.DANGER : Intent.NONE}
              name="title"
              value={values.title}
              placeholder="Title"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup label="Default options" labelFor="input-default-opt">
            <div className="bp3-select bp3-fill">
              <select
                name="defaultOption"
                onChange={handleChange}
                defaultValue={defaultOption}
              >
                <option value="">-</option>
                {options.map(o => (
                  <option value={o.value} key={o.value}>
                    {o.value}
                  </option>
                ))}
              </select>
            </div>
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
          {getOptions(values.options, errors, directChange)}
          <span className="flex">
            <Button
              icon="plus"
              intent={Intent.PRIMARY}
              onClick={() => addNewOption(directChange)}
            >
              Add Option
            </Button>
          </span>
        </div>
      )}
    </FormHandler>
  )
}

RadioInputForm.propTypes = {
  isRequired: PropTypes.bool,
  varName: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
  defaultOption: PropTypes.string,
  options: PropTypes.array,
}

export default RadioInputForm
