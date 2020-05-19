import { useCurrentProfile } from "shared/hooks/currentUser"
import useApi from "shared/hooks/api"
import React, { useMemo } from "react"
import Form from "shared/components/Form"
import { getAPIValues } from "shared/components/FileInput"
import pubsub from "sweet-pubsub"
import { ActionButton, Actions, FormElement } from "pages/Authentication/Styles"

const CreateExpense = ({ modalClose }) => {
  const profile = useCurrentProfile()
  const [{ data }] = useApi.get(`/types/expenses/`, {}, { mountFetch: true })
  const typeOptions = useMemo(
    () => (data || []).map(el => ({ label: el.name, value: el.id })),
    [data]
  )
  const [{ isCreating }, createExpense] = useApi.post(`/expenses/`)

  return <Form
    initialValues={{
      type: "",
      amount: "",
      payed_amount: "",
      note: "",
      image: ""
    }}
    validations={{
      type: Form.is.required(),
      amount: Form.is.required()
    }}
    onSubmit={async (values, form) => {
      try {
        await createExpense({
          ...values,
          image: getAPIValues(values.image),
          parlor: profile.parlor.id
        })
        await pubsub.emit('fetch-payments')
        await modalClose()
      } catch (error) {
        console.error(error)
        Form.handleAPIError(error, form)
      }
    }}
  >
    <FormElement>
      <Form.Field.Select options={typeOptions} label="Тип платежа" name="type" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "25px" }}>
        <Form.Field.Input type="number" name="amount" label="Сумма платежа" />
        <Form.Field.Input type="number" name="payed_amount" label="Уже оплачено" />
      </div>
      <Form.Field.Textarea name="note" label="Заметка к платежу" />
      <Form.Field.FileInput name="image" label="Чек/накладная" />
      <Actions>
        <ActionButton variant="primary" isWorking={isCreating} type="submit">
          Добавить
        </ActionButton>
        <ActionButton variant="secondary" disabled={isCreating} type="button" onClick={modalClose}>
          Отменить
        </ActionButton>
      </Actions>
    </FormElement>
  </Form>
}

export default CreateExpense
