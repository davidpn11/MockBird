import React from 'react'
import PropTypes from 'prop-types'
import Modal from '~/components/UI/Modal'
import FormHandler from '~/components/FormHandler'
import { FormGroup, InputGroup, Intent, Button } from '@blueprintjs/core'
import isEmpty from 'lodash/isEmpty'
import ColorPicker from '~/components/UI/ColorPicker'

function ConfigModal({
  closeModal,
  isOpen,
  isUpdating,
  project,
  updateProject,
}) {
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
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title="Project Configuration"
    >
      <FormHandler
        initialValues={{
          name,
          primaryColor,
          secundaryColor,
          accentColor,
          backgroundColor,
        }}
        onValidate={onValidate}
      >
        {({ values, errors, handleChange, directChange }) => (
          <div className="flex flex-column mh3 mt2">
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
            <FormGroup>
              <div className="w-100 flex flex-row items-center justify-between">
                <Button
                  disabled={!isEmpty(errors)}
                  loading={isUpdating}
                  intent={Intent.PRIMARY}
                  onClick={() => onSubmit(values)}
                >
                  Save
                </Button>
                {/* <Button
                  intent={Intent.PRIMARY}
                  onClick={() => onSubmit(values)}
                  minimal
                >
                  Advanced settings
                </Button> */}
              </div>
            </FormGroup>
          </div>
        )}
      </FormHandler>
    </Modal>
  )
}

ConfigModal.propTypes = {
  isOpen: PropTypes.bool,
  isUpdating: PropTypes.bool,
  closeModal: PropTypes.func,
  updateProject: PropTypes.func,
  project: PropTypes.object,
}

export default ConfigModal
