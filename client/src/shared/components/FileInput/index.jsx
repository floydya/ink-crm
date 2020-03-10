import React, { forwardRef } from "react"
import PropTypes from "prop-types"

import { StyledInput, InputElement, StyledIcon } from "./Styles"

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool
}

const defaultProps = {
  className: undefined,
  disabled: false,
  value: undefined,
  icon: undefined,
  invalid: false,
  onChange: () => {
  },
  multiple: false
}

const FileInput = forwardRef(({ disabled, multiple, icon, className, onChange, ...inputProps }, ref) => {
  const handleChange = event => {
    const { files, value: values } = event.target
    onChange({ values, files }, event)
    // const {files} = event.target.files
    // if (inputProps.multiple) {
    //   onChange(files.map(file => {
    //     return getBase64(file)
    //   }), event)
    // } else {
    //   getBase64(files[0]).then(base64 => onChange(base64, event))
    // }
  }


  return (
    <StyledInput className={className}>
      {icon && <StyledIcon type={icon} size={15} />}
      <InputElement
        {...inputProps}
        type="file"
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        hasIcon={!!icon}
        ref={ref}
        value={inputProps.values}
      />
    </StyledInput>
  )
})

FileInput.propTypes = propTypes
FileInput.defaultProps = defaultProps

export default FileInput
