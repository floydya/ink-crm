import React, { Fragment, useMemo } from "react";
import { formatMoney } from "../../../shared/utils/moneyFormat";
import { formatDateTime } from "../../../shared/utils/dateTime";
import { capitalize } from "../../../shared/utils/string";
import { Icon, Modal } from "../../../shared/components";
import { useModalStateHelper } from "../../Home/components/shared";
import Payment from "../../../components/Payment";
import history from "../../../history";

const TransactionEntity = ({ transaction }) => {
  const transactionModalAvailable = useMemo(
    () => ["fine", "bounty"].includes(transaction.entity__type),
    [transaction.entity__type]
  );
  const modalHelper = useModalStateHelper();
  return (
    <tr>
      <td>{formatDateTime(transaction.created_at, "HH:mm:ss")}</td>
      <td colSpan={3}>{capitalize(transaction.reference)}</td>
      <td className="text-right">{formatMoney(transaction.amount)}</td>
      {transactionModalAvailable && (
        <td className="text-right">
          <Icon
            type="info"
            size={20}
            style={{ color: "cornflowerblue" }}
            onClick={modalHelper.open}
          />
          {modalHelper.isOpen() && (
            <Modal
              isOpen
              withCloseIcon
              testid={`modal:transaction-${transaction.id}`}
              width={800}
              onClose={modalHelper.close}
              renderContent={() => (
                <Payment payment={transaction.entity_object} />
              )}
            />
          )}
        </td>
      )}
      {transaction.entity__type === "employeerecordpayment" && (
        <td className="text-right">
          <Icon
            type="link"
            size={20}
            style={{ color: "cornflowerblue" }}
            onClick={() =>
              history.push(`/records/${transaction.entity_object.record}`)
            }
          />
        </td>
      )}
    </tr>
  );
};

const Transactions = ({ groupedTransactions }) => {
  return (
    <table cellPadding={0} cellSpacing={0}>
      <thead>
        <tr>
          <th className="text-left">Дата</th>
          <th className="text-left" colSpan={3}>
            Источник
          </th>
          <th className="text-right">Сумма</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedTransactions).map(([date, _transactions]) => (
          <Fragment key={date}>
            <tr className="date-block">
              <th className="text-left">{date}</th>
              <th className="text-left" colSpan={3} />
              <th className="text-right">
                {formatMoney(
                  _transactions.reduce(
                    (acc, next) => acc + parseFloat(next.amount),
                    0
                  )
                )}
              </th>
              <th />
            </tr>
            {_transactions.map(transaction => (
              <TransactionEntity
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Transactions;
