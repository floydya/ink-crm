import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useCurrentProfile } from "../../../shared/hooks/currentUser"
import { Form } from "../../../shared/components"
import { ActionButton, Actions, FormElement, FormHeading } from "../../Authentication/Styles"
import useApi from "../../../shared/hooks/api"
import moment from "moment"
import history from "../../../history"
import { getAPIValues } from "shared/components/FileInput"

const CreateRecord = () => {
  const { customerId } = useParams()
  const profile = useCurrentProfile()
  const [{isCreating}, createRecord] = useApi.post(`/records/`)
  const [{ data: sessionTypes }] = useApi.get(`/types/sessions/`, {}, { mountFetch: true })
  const [{ data: employees }] = useApi.get(`/profiles/`, { parlor: profile?.parlor?.id }, { mountFetch: true })
  const types = useMemo(
    () => (sessionTypes || []).map(el => ({ label: el.name, value: el.id })),
    [sessionTypes]
  )
  const filteredEmployees = useMemo(
    () => (employees || [])
      .map(el => ({
        label: `[${el.role_display}] ${el.user.full_name}`,
        value: el.id,
        session_types: el.session_motivations.map(el => el.id)
      })),
    [employees]
  )
  return <div>
    <Form
      validations={{
        type: Form.is.required(),
        datetime: Form.is.required(),
        performer: Form.is.required()
      }}
      initialValues={{
        type: "",
        datetime: moment().add(5, "minutes"),
        performer: "",
        approximate_time: "",
        comment: "",
        sketch: "",
        prepayment: "",
      }}
      onSubmit={async (values, form) => {
        const formData = {
          type: values.type,
          datetime: values.datetime,
          performer: values.performer,
          approximate_time: values.approximate_time || null,
          comment: values.comment,
          sketch: getAPIValues(values.sketch),
          prepayment: values.prepayment || null,
          customer: customerId,
          parlor: profile.parlor.id,
          created_by: profile.id,
        }
        try {
          const response = await createRecord(formData)
          await history.push(`/records/${response.id}`)
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      }}
    >
      <FormElement>
        <FormHeading>Создание записи</FormHeading>
        <Form.Field.Select name="type" label="Тип сеанса" options={types} />
        <Form.Field.DatePicker name="datetime" label="Дата" />
        <Form.Field.Select name="performer" label="Мастер" options={filteredEmployees} filter={
          (option, formValues) => option.session_types.find(el => el === formValues.type)
        }/>
        <Form.Field.Input name="approximate_time" label="Примерное время на сеанс" type="time" />
        <Form.Field.Textarea name="comment" label="Комментарий" />
        <Form.Field.Input name="prepayment" label="Предоплата" type="number" />
        <Form.Field.FileInput name="sketch" label="Эскиз" />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isCreating}>
            Создать
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  </div>
}

export default CreateRecord
