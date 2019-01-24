import React, { Component } from 'react'
import styled from 'styled-components'
import {
  Button,
  Intent,
  InputGroup,
  Collapse,
  Icon,
  Spinner,
} from '@blueprintjs/core'
import { db } from '~/services/firebase'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Carousel from '~/components/UI/Carousel'
import { primaryBlue, gray800 } from '~/services/utils/colors'
import HelperText from '../UI/HelperText'

const NameInput = styled(InputGroup)`
  margin: 0 15px;
`

const TemplatesLoadingWraper = styled.div`
  display: flex;
  height: 100%;
  min-height: 500px;
  width: 100%;
  align-items: center;
  justify-content: center;
`

const TemplateStyled = styled.li`
  display: flex;
  min-width: 250px;
  flex-direction: column;
  align-items: center;
  border: 0px solid rgba(123, 123, 123, 0.498039);
  border-radius: 4px;
  color: rgb(153, 153, 153);
  line-height: 50px;
  font-size: 24px;
  font-weight: 500;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;
  margin: 0 15px 5px 15px;
  padding: 0 10px;
  & > .template-header {
    cursor: pointer;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    color: ${gray800};
  }
`

const CollapseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > .author {
    color: rgb(153, 153, 153);
    font-size: 13px;
    display: flex;
    a {
      color: rgb(153, 153, 153);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
        color: ${primaryBlue};
      }
    }
  }
  & > .colors {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`

const ColorCircle = styled.span`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${props => (props.color ? props.color : 'black')};
`

const HelperTextWrapper = styled.div`
  height: 500px;
  margin: 0 30px;
`

const Template = ({ template, setActive, isActive }) => (
  <TemplateStyled>
    <div className="template-header" onClick={() => setActive(template.id)}>
      <span className="ml3">{template.name}</span>
      <span>
        {isActive ? (
          <Icon icon="tick-circle" iconSize={20} intent={Intent.SUCCESS} />
        ) : (
          <Icon icon="chevron-down" iconSize={20} color="black" />
        )}
      </span>
    </div>
    <Collapse isOpen={isActive}>
      <CollapseWrapper>
        <span className="author">
          Made by
          <a href={template.authorURL} target="blank" className="ml1">
            {template.author}
          </a>
        </span>
        <div className="colors">
          <span className="mr3">Default colors:</span>
          {template.defaultColors
            ? template.defaultColors.map((color, i) => (
                <ColorCircle key={i} color={color} />
              ))
            : null}
        </div>
      </CollapseWrapper>
    </Collapse>
  </TemplateStyled>
)

Template.propTypes = {
  template: PropTypes.object,
  setActive: PropTypes.func,
  isActive: PropTypes.bool,
}

class TemplatesModal extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  state = {
    templates: [],
    projectName: '',
    selectedTemplate: '',
    isCreating: false,
    isLoadingTemplates: true,
  }

  get currentTemplate() {
    const { templates, selectedTemplate } = this.state
    return templates.length > 0 && selectedTemplate
      ? templates.find(t => t.id === selectedTemplate) || {}
      : {}
  }

  getImages() {
    return this.currentTemplate.images || []
  }
  setActive = id =>
    this.setState(prev => ({
      selectedTemplate: prev.selectedTemplate !== id ? id : '',
    }))

  getTemplates() {
    const { templates, selectedTemplate } = this.state
    return (
      <ul>
        {templates.map(t => (
          <Template
            key={t.id}
            template={t}
            setActive={this.setActive}
            isActive={selectedTemplate === t.id}
          />
        ))}
      </ul>
    )
  }

  componentDidMount = () => {
    db.getTemplatesAPI().then(templates =>
      this.setState({ templates, isLoadingTemplates: false }, () =>
        console.log(this.state.templates)
      )
    )
  }

  addProject() {
    this.setState({ isCreating: true }, () => {
      const { projectName, selectedTemplate } = this.state
      const proj = {
        templateId: selectedTemplate,
        name: projectName,
        primaryColor: this.currentTemplate.defaultColors[0],
        secundaryColor: this.currentTemplate.defaultColors[1],
        backgroundColor: '#e5e5e5',
        accentColor: this.currentTemplate.defaultColors[2],
        lastPublished: '',
      }
      db.addProjectAPI(proj)
        .then(res => {
          this.setState({ isCreating: false }, () =>
            this.props.history.push({ pathname: `/${res.id}` })
          )
        })
        .catch(err => console.error(err))
    })
  }

  nameChanged = event => {
    this.setState({ projectName: event.target.value })
  }

  render() {
    const {
      isLoadingTemplates,
      isCreating,
      projectName,
      selectedTemplate,
    } = this.state
    return (
      <div className="mt3">
        {isLoadingTemplates ? (
          <TemplatesLoadingWraper>
            <Spinner size={40} intent={Intent.PRIMARY} />
          </TemplatesLoadingWraper>
        ) : (
          <div className="flex flex-column w-100">
            <div className="flex flex-row justify-between">
              {this.getTemplates()}
              {selectedTemplate ? (
                <Carousel imgs={this.getImages()} />
              ) : (
                <HelperTextWrapper>
                  <HelperText text="Select a template to preview it and create a new project" />
                </HelperTextWrapper>
              )}
            </div>
            <div className="pt-dialog-footer flex items-center mr3 mt3">
              <NameInput
                className="bp3-fill"
                type="text"
                value={this.state.value}
                onChange={this.nameChanged}
                placeholder="Project Name"
                dir="auto"
              />
              <Button
                disabled={projectName.length === 0 || !selectedTemplate}
                large="true"
                intent={Intent.SUCCESS}
                className="grow-1"
                loading={isCreating}
                onClick={() => this.addProject()}
              >
                Finish
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(TemplatesModal)
