import React from "react"
import PropTypes from "prop-types"
import Form from "../../shared/components/Form"
import useApi from "../../shared/hooks/api"
import { ActionButton, Actions, FormElement, FormHeading } from "../Authentication/Styles"
import history from "../../history"
import moment from "moment"
import { formatDate } from "../../shared/utils/dateTime"

const propTypes = {
  modalClose: PropTypes.func.isRequired
}


const CreateUserModal = ({ modalClose }) => {
  const [{ isCreating }, createUser] = useApi.post(`/users/`)
  return <div>
    <Form
      validations={{
        username: Form.is.required(),
        first_name: Form.is.required(),
        middle_name: Form.is.required(),
        last_name: Form.is.required(),
        phone_number: Form.is.required(),
        birth_date: Form.is.required(),
        new_password: Form.is.required(),
        confirm_new_password: Form.is.required()
      }}
      initialValues={{
        username: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        birth_date: moment().toISOString(),
        new_password: "",
        confirm_new_password: ""
      }}
      onSubmit={async (values, form) => {
        try {
          const response = await createUser({ ...values, birth_date: formatDate(values.birth_date, "YYYY-MM-DD") })
          modalClose()
          history.push(`/employees/${response.id}`)
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      }}
    >
      <FormElement autoComplete="off">
        <FormHeading>
          Создание сотрудника
        </FormHeading>
        <Form.Field.Input
          name="username"
          label="Логин"
          autoComplete="new-username"
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
          <Form.Field.Input
            name="first_name"
            label="Имя"
            autoComplete="new-first-name"
          />
          <Form.Field.Input
            name="middle_name"
            label="Отчество"
            autoComplete="new-middle-name"
          />
          <Form.Field.Input
            name="last_name"
            label="Фамилия"
            autoComplete="new-last-name"
          />
        </div>
        <Form.Field.DatePicker
          name="birth_date"
          label="Дата рождения"
          withTime={false}
          autoComplete="new-birth-date"
        />
        <Form.Field.Input
          name="phone_number"
          label="Номер телефона"
          autoComplete="new-phone-number"
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
          <Form.Field.Input
            name="new_password"
            type="password"
            label="Пароль"
            autoComplete="new-password"
          />
          <Form.Field.Input
            name="confirm_new_password"
            type="password"
            label="Повторите пароль"
            autoComplete="confirm-new-password"
          />
        </div>
        <Actions>
          <ActionButton variant="primary" isWorking={isCreating}>
            Создать
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  </div>
}

CreateUserModal.propTypes = propTypes

export default CreateUserModal