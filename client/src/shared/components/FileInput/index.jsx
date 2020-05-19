import React, { forwardRef, useCallback } from "react"
import PropTypes from "prop-types"
import { useDropzone } from "react-dropzone"

import { getBase64 } from "shared/utils/base64"
import Button from "shared/components/Button"

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
  const onDrop = useCallback(acceptedFiles => {
    Promise.all(
      acceptedFiles.map(async file => ({ ...file, base64: await getBase64(file) }))
    ).then(
      files => onChange(files)
    )
  }, [onChange])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ disabled, onDrop, multiple })
  return (
    <div {...getRootProps()} style={{ textAlign: "center" }}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <Button variant="secondary" icon="file" type="button">
            Отпустите файлы здесь ...
          </Button> :
          <Button variant="secondary" icon="plus-square" type="button">
            {
              inputProps.value
                ? inputProps.value.length > 1
                  ? `${inputProps.value[0].path} и еще ${inputProps.value.length - 1} файлов`
                  : inputProps.value[0].path
                : "Перетащите файлы сюда или нажмите эту кнопку для выбора"
            }
          </Button>
      }
    </div>
  )
})

FileInput.propTypes = propTypes
FileInput.defaultProps = defaultProps

export const getAPIValues = (value) => {
  if (value.length > 0) {
    if (value.length > 1) {
      return value.map(el => el.base64)
    }
    return value[0].base64
  }
  return null
}

export default FileInput
