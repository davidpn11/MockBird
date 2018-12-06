import styled from 'styled-components'

export const Input = styled.input`
  padding: 10px 12px;
  background: ${props => (props.secundaryColor ? props.secundaryColor : '')};
  color: ${props => (props.accentColor ? props.accentColor : '')};
  margin: 10px 5px;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 2px;
  margin-right: 10px;
  font-size: 18px;
  &::placeholder {
    color: ${props => (props.accentColor ? props.accentColor : '')};
  }
`

export const Radio = styled.div`
  margin: 5px;
  input[type='radio'] {
    display: none;
  }
  input[type='radio'] + label {
    color: #292321;
    font-size: 16px;
    display: flex;
  }
  input[type='radio'] + label span {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: -1px 4px 0 0;
    vertical-align: middle;
    cursor: pointer;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }

  input[type='radio'] + label span {
    transition: background-color 0.1s linear;
    background-color: ${props =>
      props.secundaryColor ? props.secundaryColor : ''};
  }

  input[type='radio']:checked + label span {
    transition: background-color 0.1s linear;
    background-color: ${props =>
      props.primaryColor ? props.primaryColor : ''};
  }
`

export const Header = styled.h2`
  text-align: center;
  width: 100%;
  margin: 10px 5px;
  color: ${props => (props.textColor ? props.textColor : '#000')};
  font-size: ${props =>
    props.textSize ? props.textSize * 0.5 + 'em' : '1.5em'};
`
export const SubHeader = styled.span`
  width: 100%;
  margin: 10px 5px;
  color: ${props => (props.textColor ? props.textColor : '#000')};
  font-weight: 400;
  font-size: ${props =>
    props.textSize ? props.textSize * 0.3 + 'em' : '0.5em'};
`
