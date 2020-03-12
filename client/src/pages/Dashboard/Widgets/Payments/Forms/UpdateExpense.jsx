import React, { useEffect } from "react"
import Form from "shared/components/Form"
import pubsub from "sweet-pubsub"
import { ActionButton, Actions, FormElement } from "pages/Authentication/Styles"
import useApi from "shared/hooks/api"


const UpdateExpense = ({ payment, modalClose }) => {
  const [{ isUpdating }, paymentUpdate] = useApi.patch(`/expenses/${payment.id}/`)

  useEffect(() => {
    const inputElement = document.getElementById('payed_amount')
    if (inputElement) inputElement.focus()
  }, [])

  return <Form
    initialValues={{
      payed_amount: ""
    }}
    validations={{
      payed_amount: Form.is.required()
    }}
    onSubmit={async (values, form) => {
      try {
        await paymentUpdate(values)
        await pubsub.emit("fetch-payments")
        await modalClose()
      } catch (error) {
        Form.handleAPIError(error, form)
      }
    }}
  >
    <FormElement>
      <Form.Field.Input
        type="number"
        id="payed_amount"
        name="payed_amount"
        label="Сумма текущей транзакции"
        tip={(
          <span>Осталось оплатить: {payment.amount - payment.payed_amount}.</span>
        )}
      />
      <Actions>
        <ActionButton variant="primary" isWorking={isUpdating} type="submit">
          Оплатить
        </ActionButton>
        <ActionButton variant="secondary" disabled={isUpdating} type="button" onClick={modalClose}>
          Отменить
        </ActionButton>
      </Actions>
    </FormElement>
  </Form>
}

export default UpdateExpense
