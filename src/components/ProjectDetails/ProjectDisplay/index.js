import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import DevTools from 'mobx-react-devtools'
import InputsMenu from './InputsMenu'
import { observer, inject } from 'mobx-react'
import isEmpty from 'lodash/isEmpty'
import SubmitButton from './SubmitButton'
import AsyncStyled from '~/components/UI/AsyncStyled'
import { ScreenInput } from '~/components/UI/ScreenInput'
import RadioButton from '~/components/UI/RadioButton'
import Phone from './Phone'
import HelperText from '~/components/UI/HelperText'

const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  & > input {
    height: 50px;
    margin-bottom: 10px;
  }
  & > div {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    & > span {
      height: 30px;
    }
  }
`

const Display = styled.div`
  display: flex;
  flex-grow: 5
  flex-direction: column;
  justify-content: space-between;
  grid-template-columns: 1fr, 50px;
  grid-auto-rows: 100px;
  max-width: 100%;
  border-radius: 3px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : 'inherit'};
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`

@inject('projectDetailStore')
@observer
class ProjectDisplay extends Component {
  static propTypes = {
    projectDetailStore: PropTypes.object,
  }

  state = {
    isAdding: false,
    hasTemplate: false,
    selectedInput: '',
  }

  get screenInputs() {
    return this.props.projectDetailStore.screenInputs || []
  }

  handleNameChange = event =>
    this.props.projectDetailStore.updateScreenName(event.target.value)

  canAddInput() {
    const maxWeight = this.props.projectDetailStore.currScreen.maxWeight
    return this.props.projectDetailStore.screenInputs.length < maxWeight
      ? true
      : false
  }

  addNewInput = input => {
    if (!this.canAddInput()) {
      alert('Max of inputs reached')
      return
    }
    const { icon, ...data } = input
    this.setState({ isAdding: true }, async () => {
      await this.props.projectDetailStore.addNewInput(data)
      this.setState({ isAdding: false })
    })
  }

  inputSelector(
    input,
    { Input, Radio, Header, SubHeader },
    { primaryColor, secundaryColor, accentColor, backgroundColor }
  ) {
    // console.log({ ...input })
    switch (input.metadata.type) {
      case 'textInput':
        const inputOut = Input ? (
          <Input
            className="template-input"
            type="text"
            placeholder={input.placeholder}
            primaryColor={primaryColor}
            secundaryColor={secundaryColor}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
          />
        ) : null
        return inputOut
      case 'radioButton':
        return RadioButton ? (
          <RadioButton
            Radio={Radio}
            title={input.title}
            options={input.options}
            defaultOption={input.defaultOption}
            primaryColor={primaryColor}
            secundaryColor={secundaryColor}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
          />
        ) : null
      case 'header':
        return Header ? (
          <Header textColor={input.textColor} textSize={input.textSize}>
            {input.text}
          </Header>
        ) : null
      case 'subheader':
        return SubHeader ? (
          <SubHeader textColor={input.textColor} textSize={input.textSize}>
            {input.text}
          </SubHeader>
        ) : null
      default:
        return null
    }
  }

  onScreenInputSelected = inputId => event => {
    this.setState({ selectedInput: inputId }, () =>
      this.props.projectDetailStore.setCurrScreenInput(inputId)
    )
  }

  deleteInput = (screenId, inputId) => () =>
    this.props.projectDetailStore.deleteInput(screenId, inputId)

  showInputs(project) {
    const templateId = this.props.projectDetailStore.templateId
    // console.log(templateId)
    if (!templateId) return null
    const path = './templates/' + templateId
    // console.log(path)
    const {
      primaryColor,
      secundaryColor,
      accentColor,
      backgroundColor,
    } = project
    const screenId = this.props.projectDetailStore.currScreen.id || ''
    return (
      <AsyncStyled module={import('' + path)}>
        {Components =>
          this.screenInputs.map(input => (
            <ScreenInput
              key={input.id}
              deleteInput={this.deleteInput(screenId, input.id)}
              onSelected={this.onScreenInputSelected(input.id)}
              isSelected={this.state.selectedInput === input.id}
            >
              {this.inputSelector(
                input,
                { ...Components },
                { primaryColor, secundaryColor, accentColor, backgroundColor }
              )}
            </ScreenInput>
          ))
        }
      </AsyncStyled>
    )
  }

  render() {
    const { isAdding } = this.state
    const currScreen = this.props.projectDetailStore.currScreen || {}
    const project = this.props.projectDetailStore.project
    const hasCurrentScreen = isEmpty(currScreen)
    // console.log(isEmpty(currScreen))
    return (
      <DisplayWrapper>
        <input
          maxLength="20"
          onChange={this.handleNameChange}
          type="text"
          placeholder="name"
          value={currScreen.name || ''}
        />
        <div>
          {/* <DevTools style={{ position: 'fixed', top: '0', right: '0' }} /> */}
          <Phone>
            {hasCurrentScreen ? (
              <HelperText text="Select or create a screen to add new inputs" />
            ) : isEmpty(this.screenInputs) ? (
              <HelperText text="Add a new screen input" />
            ) : (
              <Display backgroundColor={project.backgroundColor}>
                <div>{this.showInputs(project)}</div>
                <SubmitButton
                  color={project.primaryColor}
                  submitText={currScreen.submitText || 'SUBMIT'}
                  onChange={submitText =>
                    this.props.projectDetailStore.updateScreenSubmitText(
                      submitText
                    )
                  }
                />
              </Display>
            )}
          </Phone>
          <InputsMenu
            inputOptions={this.props.projectDetailStore.inputOptions}
            addNewInput={this.addNewInput}
            isAdding={isAdding}
            disabled={hasCurrentScreen}
          />
        </div>
      </DisplayWrapper>
    )
  }
}

export default ProjectDisplay
