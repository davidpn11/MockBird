import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
  Card,
  Elevation,
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

const CardWithMargin = styled(Card)`
  margin-bottom: 0.5rem;
`

class BuildBoard extends Component {
  static propTypes = {
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
        let hasChanges = false
        let screenBuilds = nextProps.build.screenBuilds.reduce((obj, curr) => {
          const { id, ...rest } = curr
          const equiScreen = nextProps.screens.find(s => s.id === id)
          if (equiScreen) {
            rest.name = equiScreen.name
            return { ...obj, [id]: rest }
          } else {
            return obj
          }
        }, {})
        const newScreens = nextProps.screens.reduce((newObj, curr) => {
          if (!screenBuilds[curr.id]) {
            const { id, name } = curr
            return {
              ...newObj,
              [id]: { name, generatedURL: '', targetURL: '' },
            }
          } else {
            return newObj
          }
        }, {})
        screenBuilds = { ...screenBuilds, ...newScreens }
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

          if (!s.generatedURL) {
            return null
          }
          const url = `https://client.mockbird.io${s.generatedURL}`
          return (
            <CardWithMargin key={key} elevation={Elevation.TWO}>
              <li className="flex flex-column">
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
            </CardWithMargin>
          )
        })}
        <li className="w-100 justify-end mt4">
          <Button onClick={this.toggleShowBuild} intent={Intent.PRIMARY} large>
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
    const { makeBuild, isBuilding } = this.props
    const { build, showBuild } = this.state
    const hasScreens = build.screenBuilds
      ? Object.keys(build.screenBuilds).length > 0
      : false
    return (
      <div>
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
                    rightIcon="build"
                    onClick={() =>
                      makeBuild(values).then(teste => this.toggleShowBuild())
                    }
                    large
                  >
                    Build
                  </Button>
                </div>
              </BuildWrapper>
            )}
          </FormHandler>
        )}
      </div>
    )
  }
}

export default BuildBoard
