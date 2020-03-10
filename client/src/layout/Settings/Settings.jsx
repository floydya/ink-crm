import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Form } from "../../shared/components"
import useApi from "../../shared/hooks/api"
import toast from "../../shared/utils/toast"
import { ActionButton, Actions, FormElement, FormHeading } from "./Styles"
import { isEqual } from "lodash"
import pubsub from "sweet-pubsub"
import { AuthenticationContext } from "../../services/authentication.service"

const propTypes = {
  modalClose: PropTypes.func.isRequired
}

const Settings = ({ modalClose }) => {
  const { user } = useContext(AuthenticationContext)
  const [{ isUpdating }, updateUser] = useApi.patch(`/users/${user?.id}/`)

  return <Form
    enableReinitialize
    initialValues={{
      first_name: user?.first_name,
      middle_name: user?.middle_name,
      last_name: user?.last_name,
      phone_number: user?.phone_number,
      birth_date: user?.birth_date
    }}
    validations={{
      first_name: Form.is.required(),
      middle_name: Form.is.required(),
      last_name: Form.is.required(),
      phone_number: Form.is.required(),
      birth_date: Form.is.required()
    }}
    onSubmit={async (values, form) => {
      const { first_name, middle_name, last_name, phone_number, birth_date } = user
      const oldValues = { first_name, middle_name, last_name, phone_number, birth_date }
      if (!isEqual(values, oldValues)) {
        try {
          await updateUser(values)
          toast.success("Пользователь успешно обновлен.")
          pubsub.emit("fetch-user")
          modalClose()
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      } else {
        modalClose()
      }
    }}
  >
    <FormElement>
      <FormHeading>Настройки</FormHeading>
      <Form.Field.Input
        name="first_name"
        label="Имя"
      />
      <Form.Field.Input
        name="middle_name"
        label="Отчетство"
      />
      <Form.Field.Input
        name="last_name"
        label="Фамилия"
      />
      <Form.Field.Input
        name="birth_date"
        label="Дата рождения"
        type="date"
      />
      <Form.Field.Input
        name="phone_number"
        label="Номер телефона"
      />
      <Actions>
        <ActionButton type="submit" variant="primary" isWorking={isUpdating}>
          Обновить
        </ActionButton>
        {/*<ActionButton type="button" variant="empty" onClick={modalClose}>*/}
        {/*  Отменить*/}
        {/*</ActionButton>*/}
      </Actions>
    </FormElement>
  </Form>
}

Settings.propTypes = propTypes

export default Settings
