import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DeletePopover from '~/components/UI/DeletePopover'

const Box = styled.div`
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  height: 150px;
  margin: 1rem;
  position: relative;
  width: 175px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: ${props =>
    props.primaryColor ? props.primaryColor : 'white'};

  & > span {
    width: 100%;
    height: 50px;
    font-size: 18px;
    background-color: whitesmoke;
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: black;
    box-shadow: 0px 2px 1px -2px grey;
  }

  .delete-icon {
    opacity: 0;
    transition: opacity 0.3s linear;
  }

  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    .delete-icon {
      opacity: 1;
    }
  }
`

function ProjectBox({ project, deleteProject }) {
  return (
    <Link to={`/${project.id}`}>
      <Box primaryColor={project.primaryColor}>
        <span className="flex flex-row items-center justify-between">
          <span>{project.name}</span>
          <span className="delete-icon">
            <DeletePopover
              onConfirm={deleteProject}
              header="Delete project"
              text="Are you sure you want to delete the project?"
            />
          </span>
        </span>
      </Box>
    </Link>
  )
}

ProjectBox.propTypes = {
  project: PropTypes.object,
  deleteProject: PropTypes.func,
}

export default ProjectBox
