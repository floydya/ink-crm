import React, { Fragment } from "react"
import { useCurrentProfile } from "shared/hooks/currentUser"
import { Button, Table, PageLoader, PageError } from "shared/components"
import useApi from "shared/hooks/api"
import NoResults from "shared/components/NoResults"
import { formatDateTime } from "shared/utils/dateTime"
import { useModalStateHelper } from "pages/Home/components/shared"
import Modal from "shared/components/Modal"
import Form from "shared/components/Form"
import { ActionButton, Actions, FormElement } from "pages/Authentication/Styles"

const PaymentActions = ({ payment }) => {
  const payModalHelper = useModalStateHelper()
  const [{isUpdating}, paymentUpdate] = useApi.patch(`/expenses/${payment.id}/`)

  return <div>
    <Button icon="pay" variant="secondary" onClick={payModalHelper.open}>
      Оплатить
    </Button>
    {payModalHelper.isOpen() && (
      <Modal
        isOpen
        withCloseIcon={false}
        onClose={payModalHelper.close}
        renderContent={({close}) => (
          <Form
            initialValues={{
              payed_amount: "",
            }}
            validations={{
              payed_amount: Form.is.required()
            }}
            onSubmit={async (values, form) => {
              try {
                await paymentUpdate(values)
                await close()
              } catch (error) {
                Form.handleAPIError(error, form)
              }
            }}
          >
            <FormElement>
              <Form.Field.Input
                type="number"
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
                <ActionButton variant="secondary" disabled={isUpdating} type="button" onClick={close}>
                  Отменить
                </ActionButton>
              </Actions>
            </FormElement>
          </Form>
        )}
      />
    )}
  </div>
}

const columns = [
  {
    Header: "#",
    accessor: "id",
    width: 50,
    className: "text-center"
  },
  {
    Header: "Тип платежа",
    accessor: "type.name"
  },
  {
    Header: "Сумма",
    accessor: "amount",
    Cell: ({ cell: { row: { original } } }) => (
      <span>{original.payed_amount} / {original.amount}</span>
    )
  },
  {
    Header: "Создание платежа",
    accessor: "created_at",
    Cell: ({ cell: { row: { original } } }) => (
      <div style={{ display: "flex", flexFlow: "column" }}>
        <p>{original.created_by.full_name}</p>
        <p>{formatDateTime(original.created_at, "DD.MM.YYYY HH:mm")}</p>
      </div>
    )
  },
  {
    Header: "",
    accessor: "id",
    Cell: ({ cell: { row: { original } } }) => (<PaymentActions payment={original} />),
    className: "text-right"
  }
]

const Payments = () => {
  const profile = useCurrentProfile()
  const [{ isLoading, error, data }] = useApi.get(
    `/expenses/`,
    { parlor: profile?.parlor?.id, unpayed: true },
    { mountFetch: true }
  )

  if (isLoading) return <PageLoader />
  if (error) return <PageError />

  return (
    <Fragment>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4>Неоплаченные платежи</h4>
        <Button variant="secondary" icon="plus-square">
          Добавить расход/платеж
        </Button>
      </div>
      {data.length
        ? <Table columns={columns} data={data} />
        : <NoResults title="Платежи отсутствуют" />
      }
    </Fragment>
  )
}

export default Payments
