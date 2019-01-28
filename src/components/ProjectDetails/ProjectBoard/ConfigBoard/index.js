import React from 'react'
import PropTypes from 'prop-types'
import Modal from '~/components/UI/Modal'
import FormHandler from '~/components/FormHandler'
import { FormGroup, InputGroup, Intent, Button } from '@blueprintjs/core'
import isEmpty from 'lodash/isEmpty'
import ColorPicker from '~/components/UI/ColorPicker'
import debounce from 'lodash/debounce'

function ConfigModal({ project, updateProject }) {
  const onValidate = values => {
    let errors = {}
    if (!values.name) {
      errors.name = 'Required'
    }
    return errors
  }

  const onSubmit = values => updateProject({ ...project, ...values })

  const {
    name,
    primaryColor,
    secundaryColor,
    accentColor,
    backgroundColor,
  } = project
  return (
    <FormHandler
      initialValues={{
        name,
        primaryColor,
        secundaryColor,
        accentColor,
        backgroundColor,
      }}
      onValidate={onValidate}
      autoSave={debounce(onSubmit, 500)}
    >
      {({ values, errors, handleChange, directChange }) => (
        <div className="flex flex-column mh3 mt2">
          <h1>Project Configuration</h1>
          <FormGroup label="Project name">
            <InputGroup
              name="name"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup label="Primary Color">
            <ColorPicker
              name="primaryColor"
              color={values.primaryColor}
              onChange={newColor => directChange('primaryColor', newColor)}
            />
          </FormGroup>
          <FormGroup label="Secundary Color">
            <ColorPicker
              name="secundaryColor"
              color={values.secundaryColor}
              onChange={newColor => directChange('secundaryColor', newColor)}
            />
          </FormGroup>
          <FormGroup label="Accent Color">
            <ColorPicker
              name="accentColor"
              color={values.accentColor}
              onChange={newColor => directChange('accentColor', newColor)}
            />
          </FormGroup>
          <FormGroup label="Background Color">
            <ColorPicker
              name="backgroundColor"
              color={values.backgroundColor}
              onChange={newColor => directChange('backgroundColor', newColor)}
            />
          </FormGroup>
        </div>
      )}
    </FormHandler>
  )
}

ConfigModal.propTypes = {
  updateProject: PropTypes.func,
  project: PropTypes.object,
}

export default ConfigModal
