import React from 'react'
import styled from 'styled-components'
import Loader from 'react-loaders'

const Overlay = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(74, 74, 74, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
`

const GlobalLoader = () => {
  return (
    <Overlay>
      <Loader type="ball-pulse-sync" />
    </Overlay>
  )
}

export default GlobalLoader
