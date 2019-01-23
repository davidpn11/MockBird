import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Spinner, Intent } from '@blueprintjs/core'
import styled from 'styled-components'

const CarouselWrapper = styled.div`
  position: relative;
  display: flex;

  img {
    height: 100%;
  }
`

const CarouselButton = styled(Button)`
  position: absolute;
  left: ${props => (props.left ? '0' : '')};
  right: ${props => (props.right ? '0' : '')};
  height: 50px;
  width: 50px;
  border-radius: 100%;
  margin: 0.5rem;
`

const Img = ({ src, isHidden, onLoad, width }) => (
  <img src={src} width={width} hidden={isHidden} onLoad={onLoad} />
)

Img.propTypes = {
  src: PropTypes.string,
  isHidden: PropTypes.bool,
  onLoad: PropTypes.func,
  width: PropTypes.string,
}

class Carousel extends Component {
  static propTypes = {
    imgs: PropTypes.array,
  }

  state = {
    currImg: 0,
    size: 0,
    isLoading: true,
  }

  componentDidMount() {
    if (this.props.imgs) {
      this.setState({ size: this.props.imgs.length })
    }
    document.addEventListener('keydown', this.getArrow)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.getArrow)
  }

  prevImg = () =>
    this.setState(prev => ({
      currImg: prev.currImg === 0 ? prev.size - 1 : prev.currImg - 1,
    }))

  nextImg = () =>
    this.setState(prev => ({
      currImg: prev.currImg === prev.size - 1 ? 0 : prev.currImg + 1,
    }))

  getImgs() {
    const { imgs } = this.props
    const { currImg } = this.state
    return imgs.map((img, index) => (
      <Img
        width="300"
        key={img}
        src={img}
        isHidden={currImg !== index}
        onLoad={index === 0 ? this.onLoad : null}
      />
    ))
  }

  onLoad = () =>
    this.setState(prev => ({
      isLoading: false,
    }))

  getArrow = event => {
    if (event.keyCode === 37) {
      this.prevImg()
    } else if (event.keyCode === 39) {
      this.nextImg()
    }
  }
  render() {
    const { currImg, isLoading } = this.state
    return (
      <div>
        {isLoading ? <Spinner size={25} intent={Intent.PRIMARY} /> : null}
        <CarouselWrapper hidden={isLoading}>
          <div className="flex h-100 items-center">
            <CarouselButton minimal onClick={this.prevImg} left>
              <Icon icon="chevron-left" iconSize={25} color="white" />
            </CarouselButton>
          </div>
          {this.getImgs()}
          <div className="flex h-100 items-center">
            <CarouselButton minimal onClick={this.nextImg} right>
              <Icon icon="chevron-right" iconSize={25} color="white" />
            </CarouselButton>
          </div>
        </CarouselWrapper>
      </div>
    )
  }
}

export default Carousel
