import React, { Fragment } from "react";
import { useCurrentProfile } from "shared/hooks/currentUser";
import { Button, Table, PageLoader, PageError, Icon } from "shared/components";
import useApi from "shared/hooks/api";
import NoResults from "shared/components/NoResults";
import { formatDateTime } from "shared/utils/dateTime";

const PaymentActions = ({ payment }) => {
    return <div>
        
    </div>
}

const columns = [
    {
        Header: "#",
        accessor: "id",
        width: 50,
        className: "text-center",
    },
    {
        Header: "Тип платежа",
        accessor: "type.name",
    },
    {
        Header: "Сумма",
        accessor: "amount",
        Cell: ({cell: {row: {original}}}) => (
            <span>{original.payed_amount} / {original.amount}</span>
        )
    },
    {
        Header: "Создание платежа",
        accessor: "created_at",
        Cell: ({ cell: {row: {original}}}) => (
            <div style={{ display: "flex", flexFlow: "column" }}>
                <p>{original.created_by.full_name}</p>
                <p>{formatDateTime(original.created_at, "DD.MM.YYYY HH:mm")}</p>
            </div>
        )
    },
    {
        Header: "",
        accessor: "id",
        Cell: ({ cell: {row: {original}}}) => (
            <Icon type="plus-square" />
        ),
        className: "text-right",
    }
]

const Payments = () => {
  const profile = useCurrentProfile();
  const [{ isLoading, error, data }] = useApi.get(
    `/expenses/`,
    { parlor: profile?.parlor?.id },
    { mountFetch: true }
  );

  if (isLoading) return <PageLoader />;
  if (error) return <PageError />;

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
  );
};

export default Payments;
