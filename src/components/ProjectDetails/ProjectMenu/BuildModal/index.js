import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from '~/components/UI/Modal'
import FormHandler from '~/components/FormHandler'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  FormGroup,
  InputGroup,
  Intent,
  Button,
  Icon,
  Tooltip,
  Position,
} from '@blueprintjs/core'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'

const BuildWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 20px;
  > div:first-child {
    display: flex;
    flex-direction: column;
  }
`

const OverflowText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

class BuildModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    isOpen: PropTypes.bool.isRequired,
    isBuilding: PropTypes.bool,
    screens: PropTypes.array,
    currentBuild: PropTypes.object,
    makeBuild: PropTypes.func,
  }

  state = {
    build: {},
    showBuild: true,
    copyText: 'Copy',
  }

  toggleShowBuild = () =>
    this.setState(prev => ({
      showBuild: !prev.showBuild,
    }))

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.build || nextProps.screens) {
      if (!isEmpty(nextProps.build)) {
        const screenBuilds = nextProps.build.screenBuilds.reduce(
          (obj, curr) => {
            const { id, ...rest } = curr
            return { ...obj, [id]: rest }
          },
          {}
        )
        return { build: { ...nextProps.build, screenBuilds } }
      } else if (
        nextProps.screens &&
        (!prevState.build.screenBuilds ||
          nextProps.screens.length !==
            Object.keys(prevState.build.screenBuilds).length)
      ) {
        const screenBuilds = nextProps.screens.reduce((obj, screen) => {
          const { id, name } = screen

          return {
            ...obj,
            [id]: { name, generatedURL: '', targetURL: '' },
          }
        }, {})
        return {
          build: {
            screenBuilds,
          },
          showBuild: false,
        }
      }
    }
    return null
  }

  getFormFields(values, errors = {}, directChange) {
    return Object.keys(values).map(key => {
      const hasError = errors[key] ? Intent.DANGER : Intent.NONE
      const screen = values[key]
      return (
        <FormGroup
          key={key}
          label={screen.name}
          intent={hasError}
          className="w-100"
        >
          <InputGroup
            className="bp3-fill"
            name={key}
            placeholder="URL"
            value={screen.targetURL}
            intent={hasError}
            onChange={event =>
              directChange(key, { ...screen, targetURL: event.target.value })
            }
          />
        </FormGroup>
      )
    })
  }

  checkTargetURLs = values => {
    const re = /^((http|https):\/\/[^ "]+|\{\{[A-Za-z0-9.@[\]]+\}\}[^ "]*)$/
    return Object.keys(values).reduce((obj, key) => {
      const targetURL = values[key].targetURL
      return !re.test(targetURL) ? { ...obj, [key]: true } : obj
    }, {})
  }

  changeCopyText = () => {
    this.setState({ copyText: 'Copied!' }, () => {
      setTimeout(() => {
        this.setState({ copyText: 'Copy' })
      }, 2000)
    })
  }

  showScreenBuilds() {
    const {
      build: { screenBuilds = {} },
      copyText,
    } = this.state

    return Object.keys(screenBuilds).length > 0 ? (
      <ul className="w-100 flex flex-column">
        {Object.keys(screenBuilds).map(key => {
          const s = screenBuilds[key]
          const url = `http://client.mockbird.io${s.generatedURL}`
          return (
            <li key={key} className="flex flex-column">
              <strong>{s.name}</strong>
              <span className="w-100 flex items-center justify-between">
                <OverflowText>
                  <Tooltip content={url} position={Position.BOTTOM}>
                    {url}
                  </Tooltip>
                </OverflowText>
                <Tooltip content={copyText} position={Position.BOTTOM}>
                  <CopyToClipboard text={url} onCopy={this.changeCopyText}>
                    <Button intent={Intent.PRIMARY} minimal>
                      <Icon icon="clipboard" iconSize={15} />
                    </Button>
                  </CopyToClipboard>
                </Tooltip>
              </span>
            </li>
          )
        })}
        <li className="w-100 justify-end mt4">
          <Button onClick={this.toggleShowBuild} intent={Intent.PRIMARY}>
            Edit Build
          </Button>
        </li>
      </ul>
    ) : (
      <span className="w-100 flex items-center justify-center f3 fw6 mv5">
        Add screens to continue
      </span>
    )
  }

  render() {
    const { isOpen, closeModal, makeBuild, isBuilding } = this.props
    const { build, showBuild } = this.state
    const hasScreens = build.screenBuilds
      ? Object.keys(build.screenBuilds).length > 0
      : false
    return (
      <Modal isOpen={isOpen} closeModal={closeModal} title="Project Build">
        {showBuild ? (
          <div className="ph3 flex flex-column">
            <h3>
              Add the given screen URL's to you bot as a webview to use as a
              WebView
            </h3>
            {this.showScreenBuilds()}
          </div>
        ) : (
          <FormHandler
            initialValues={{ ...build.screenBuilds }}
            onValidate={this.checkTargetURLs}
          >
            {({ values, errors, handleChange, directChange }) => (
              <BuildWrapper>
                <h3>
                  {hasScreens
                    ? 'Add the URL that each screen submission will make a POST request'
                    : 'Add screens to be able to build a project'}
                </h3>
                <div className="flex flex-column">
                  {this.getFormFields(values, errors, directChange)}
                </div>
                <div className="flex flex-row justify-end">
                  <Button
                    intent={Intent.DANGER}
                    minimal
                    onClick={this.toggleShowBuild}
                    hidden={!hasScreens}
                    className="mr2"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!isEmpty(errors) || !hasScreens}
                    intent={Intent.PRIMARY}
                    loading={isBuilding}
                    onClick={() =>
                      makeBuild(values).then(
                        teste => !console.log(teste) && this.toggleShowBuild()
                      )
                    }
                  >
                    Build
                  </Button>
                </div>
              </BuildWrapper>
            )}
          </FormHandler>
        )}
      </Modal>
    )
  }
}

export default BuildModal
