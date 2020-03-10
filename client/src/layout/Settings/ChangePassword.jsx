import React, { useContext } from "react"
import PropTypes from "prop-types"
import { AuthenticationContext } from "../../services/authentication.service"
import useApi from "../../shared/hooks/api"
import { Form } from "../../shared/components"
import toast from "../../shared/utils/toast"
import { ActionButton, Actions, FormElement, FormHeading } from "./Styles"
import { logoutUser } from "../../store/actions/authentication.actions"

const propTypes = {
  modalClose: PropTypes.func.isRequired
}

const ChangePassword = ({ modalClose }) => {
  const { dispatch } = useContext(AuthenticationContext)
  const [{ isUpdating }, changePassword] = useApi.patch(`/auth/change-password/`)

  return <Form
    enableReinitialize
    initialValues={{
      old_password: "",
      new_password: "",
      repeat_new_password: ""
    }}
    validations={{
      old_password: Form.is.required(),
      new_password: Form.is.required(),
      repeat_new_password: Form.is.required()
    }}
    onSubmit={async (values, form) => {
      try {
        await changePassword(values)
        toast.success("Пароль успешно изменен.")
        dispatch(logoutUser())
        modalClose()
      } catch (error) {
        Form.handleAPIError(error, form)
      }
    }}
  >
    <FormElement>
      <FormHeading>Изменение пароля</FormHeading>
      <Form.Field.Input
        name="old_password"
        type="password"
        label="Старый пароль"
      />
      <Form.Field.Input
        name="new_password"
        type="password"
        label="Новый пароль"
      />
      <Form.Field.Input
        name="repeat_new_password"
        type="password"
        label="Повторите новый пароль"
      />
      <Actions>
        <ActionButton type="submit" variant="primary" isWorking={isUpdating}>
          Изменить
        </ActionButton>
      </Actions>
    </FormElement>
  </Form>
}

ChangePassword.propTypes = propTypes

export default ChangePassword

