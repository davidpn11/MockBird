import React from 'react'
import PropTypes from 'prop-types'

const RadioButton = ({
  Radio,
  title,
  primaryColor,
  secundaryColor,
  accentColor,
  backgroundColor,
  defaultOption,
  options = [],
}) => {
  const getOptions = () =>
    Radio
      ? options.map((opt, index) => (
          <Radio
            key={index}
            primaryColor={primaryColor}
            secundaryColor={secundaryColor}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
          >
            <input
              type="radio"
              id={index}
              name="radio"
              value={opt.value}
              defaultChecked={opt.value === defaultOption}
            />
            <label htmlFor={index}>
              <span />
              {opt.label}
            </label>
          </Radio>
        ))
      : options.map((opt, index) => (
          <div key={index}>
            <input
              type="radio"
              id={index}
              name="radio"
              value={opt.value}
              defaultChecked={opt.value === defaultOption}
            />
            <label htmlFor={index}>
              <span />
              {opt.label}
            </label>
          </div>
        ))
  return (
    <div className="flex flex-column" style={{ margin: '5px' }}>
      <h3 className="w-100">{title}</h3>
      {getOptions()}
    </div>
  )
}

RadioButton.propTypes = {
  primaryColor: PropTypes.string,
  secundaryColor: PropTypes.string,
  accentColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  Radio: PropTypes.any,
  title: PropTypes.string,
  options: PropTypes.array,
  defaultOption: PropTypes.string,
}

export default RadioButton
