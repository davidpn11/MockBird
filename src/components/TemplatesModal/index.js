import React, { Component } from 'react'
import styled from 'styled-components'
import { Button, Intent, InputGroup } from '@blueprintjs/core'
import { db } from '~/services/firebase'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Carousel from '~/components/UI/Carousel'

const imgs = [
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1534406315430-4d7cf92bc690?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
]

const templates = [
  {
    id: 12323,
    name: 'Basic',
    defaultColors: ['#5e35b1', '#4527a0', '#fbc02d'],
    active: '',
  },
  // {
  //   id: 123456,
  //   name: 'Basic',
  //   defaultColors: ['#64B5F6', '#2196F3', '#C0CA33'],
  //   active: '',
  // },
]

const Template = styled.li`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 0px solid rgba(123, 123, 123, 0.498039);
  border-radius: 4px;
  color: rgb(153, 153, 153);
  line-height: 50px;
  padding-left: 32px;
  font-size: 24px;
  font-weight: 500;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;
  margin: 0 15px 5px 15px;
  cursor: pointer;
  &.active {
    background-color: rgb(214, 214, 214);
  }
  & > div {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: ${props => (props.color ? props.color : 'black')};
  }
`

const NameInput = styled(InputGroup)`
  margin: 0 15px;
`

class TemplatesModal extends Component {
  static propTypes = {
    history: PropTypes.object,
  }
  state = {
    templates,
    projectName: '',
    isCreating: false,
  }

  constructor(props) {
    super(props)
    this.nameChanged = this.nameChanged.bind(this)
  }

  setActive(template) {
    const temps = this.state.templates.map(t => ({
      ...t,
      active: t.id === template.id ? 'active' : '',
    }))
    this.setState({ templates: temps, selectedTemplate: template })
  }

  getTemplates() {
    const { templates } = this.state
    return templates.map(t => (
      <Template
        key={t.id}
        color={t.defaultColors[0]}
        className={t.active}
        onClick={() => this.setActive(t)}
      >
        <div />
        <span>{t.name}</span>
      </Template>
    ))
  }

  nameChanged(event) {
    this.setState({ projectName: event.target.value })
  }

  addProject() {
    this.setState({ isCreating: true }, () => {
      const { projectName, selectedTemplate } = this.state
      const proj = {
        templateId: selectedTemplate.id,
        name: projectName,
        primaryColor: selectedTemplate.defaultColors[0],
        secundaryColor: selectedTemplate.defaultColors[1],
        backgroundColor: '#e5e5e5',
        accentColor: selectedTemplate.defaultColors[2],
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

  render() {
    const { projectName, selectedTemplate, isCreating } = this.state

    return (
      <div className="flex flex-column h-100">
        <Carousel imgs={imgs} />
        {/* <ul>{this.getTemplates()}</ul>
        <div className="pt-dialog-footer flex items-center mr3">
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
            <span className="pt-icon-standard pt-icon-arrow-right pt-align-right" />
          </Button>
        </div> */}
      </div>
    )
  }
}

export default withRouter(TemplatesModal)
