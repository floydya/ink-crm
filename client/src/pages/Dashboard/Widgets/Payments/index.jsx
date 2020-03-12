import React, { Fragment, useEffect } from "react"
import { useCurrentProfile } from "shared/hooks/currentUser"
import { Button, Table, PageLoader, PageError } from "shared/components"
import useApi from "shared/hooks/api"
import NoResults from "shared/components/NoResults"
import { formatDateTime } from "shared/utils/dateTime"
import { useModalStateHelper } from "pages/Home/components/shared"
import Modal from "shared/components/Modal"
import pubsub from "sweet-pubsub"
import { UpdateExpense, CreateExpense } from "pages/Dashboard/Widgets/Payments/Forms"


const PaymentActions = ({ payment }) => {
  const payModalHelper = useModalStateHelper()

  return <div>
    <Button icon="pay" variant="secondary" onClick={payModalHelper.open}>
      Оплатить
    </Button>
    {payModalHelper.isOpen() && (
      <Modal
        isOpen
        withCloseIcon={false}
        onClose={payModalHelper.close}
        renderContent={({ close }) => (<UpdateExpense payment={payment} modalClose={close} />)}
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
    id: "actions",
    Cell: ({ cell: { row: { original } } }) => (<PaymentActions payment={original} />),
    className: "text-right"
  }
]

const Payments = () => {
  const profile = useCurrentProfile()
  const createExpenseModalHelper = useModalStateHelper()
  const [{ isLoading, error, data }, fetchPayments] = useApi.get(
    `/expenses/`,
    { parlor: profile?.parlor?.id, unpayed: true },
    { mountFetch: true }
  )

  useEffect(() => {
    pubsub.on("fetch-payments", fetchPayments)
    return () => pubsub.off("fetch-payments", fetchPayments)
  })

  if (isLoading) return <PageLoader />
  if (error) return <PageError />

  return (
    <Fragment>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4>Неоплаченные платежи</h4>
        <Button variant="secondary" icon="plus-square" onClick={createExpenseModalHelper.open}>
          Добавить расход/платеж
        </Button>
      </div>
      {data.length
        ? <Table columns={columns} data={data} />
        : <NoResults title="Платежи отсутствуют" />
      }
      {createExpenseModalHelper.isOpen() && (
        <Modal
          isOpen
          withCloseIcon={false}
          onClose={createExpenseModalHelper.close}
          width={600}
          renderContent={({ close }) => <CreateExpense modalClose={close} />}
        />
      )}
    </Fragment>
  )
}

export default Payments
