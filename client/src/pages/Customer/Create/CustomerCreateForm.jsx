import React, { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { ActionButton, Actions, FormElement, FormHeading } from "../../Authentication/Styles"
import Input from "../../../shared/components/Input"
import useApi from "../../../shared/hooks/api"
import { FormContainer } from "./Styles"
import Form from "../../../shared/components/Form"
import moment from "moment"
import { formatDate } from "../../../shared/utils/dateTime"
import { useCurrentProfile } from "../../../shared/hooks/currentUser"
import history from "../../../history"

const CustomerCreateForm = () => {
  const { phoneNumber } = useParams()
  const profile = useCurrentProfile()
  const [{ data }] = useApi.get(`/phone/${phoneNumber}/`, {}, { mountFetch: true })

  useEffect(() => {
    if (data && data.customer) {
      history.push(`/customers/${data.customer}`)
    }
  }, [data])

  const [{ data: findOuts }] = useApi.get(`/types/find-outs/`, {}, { mountFetch: true })
  const [{ isCreating }, createCustomer] = useApi.post(`/customers/`)

  const findOutOptions = useMemo(
    () => (findOuts || []).map(el => ({ label: el.name, value: el.id })),
    [findOuts]
  )

  return <FormContainer>
    <Form
      validations={{
        full_name: Form.is.required(),
        email: Form.is.email(),
        find_out: Form.is.required()
      }}
      initialValues={{
        full_name: "",
        email: "",
        find_out: "",
        birth_date: moment(),
        note: ""
      }}
      onSubmit={async (values, form) => {
        try {
          const response = await createCustomer({
            ...values,
            phone: phoneNumber,
            created_by: profile.id,
            birth_date: formatDate(values.birth_date, "YYYY-MM-DD")
          })
          await history.push(`/customers/${response.id}`)
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      }}
    >
      <FormElement style={{ gridColumn: "2" }}>
        <FormHeading>Создание клиента</FormHeading>
        {data && <Input icon="phone" disabled value={data.number} />}
        <Form.Field.Input name="full_name" label="ФИО" />
        <Form.Field.Input name="email" label="Email" type="email" />
        <Form.Field.Select name="find_out" label="Откуда узнал?" options={findOutOptions} />
        <Form.Field.DatePicker name="birth_date" label="Дата рождения" withTime={false} />
        <Form.Field.Textarea name="note" label="Заметка" />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isCreating}>
            Создать
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  </FormContainer>


}

export default CustomerCreateForm