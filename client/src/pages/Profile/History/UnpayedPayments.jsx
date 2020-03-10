import React, { useCallback, useEffect, useMemo, useRef } from "react"
import PropTypes from "prop-types"
import { Icon } from "../../../shared/components"
import useApi from "../../../shared/hooks/api"
import pubsub from "sweet-pubsub"
import moment from "moment"
import { formatDateTime } from "../../../shared/utils/dateTime"
import NoResults from "../../../shared/components/NoResults"


const PaymentEntity = ({ entity }) => {
  const URL = useMemo(
    () => entity.__type === `bounty`
      ? `/bounties/${entity.id}/`
      : `/fines/${entity.id}/`,
    [entity]
  )
  const prevUpdating = useRef(false)
  const [{ isUpdating }, updateEntity] = useApi.patch(URL)

  useEffect(() => {
    if (prevUpdating.current && !isUpdating) {
      pubsub.emit("fetch-unpayed-payments")
      pubsub.emit("fetch-transactions")
    }
    prevUpdating.current = isUpdating
  }, [isUpdating])

  return <tr style={{ backgroundColor: entity.color }}>
    <td className="text-center" colSpan={1}>
      {entity.id}
    </td>
    <td className="text-left" colSpan={2}>
      {entity.type.name}
    </td>
    <td colSpan={7}>
      <p><b>Период: </b></p>
      <p><b>Примечание: </b>{entity.note}</p>
      {!!entity.href && <p>
        <b>Доказательство: </b>
        <a href={entity.href} target="_blank" rel="noopener noreferrer">
          Открыть в новой вкладке
        </a>
      </p>}
      <p><b>Создал(-а): </b>{entity.created_by.full_name}</p>
      <p><b>Дата: </b>{formatDateTime(entity.created_at, "DD.MM.YYYY HH:mm:ss")}</p>
    </td>
    <td className="text-right" colSpan={1}>
      {entity.amount}
    </td>
    <td className="text-center" colSpan={1}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "5px",
        margin: "0 5px",
        alignItems: "center",
        height: "100%"
      }}>
        <Icon
          type="check"
          style={{ color: "green", cursor: "pointer" }}
          size={20}
          onClick={() => updateEntity({ status: true })}
        />
        <Icon
          type="trash"
          style={{ color: "red", cursor: "pointer" }}
          size={20}
          onClick={() => updateEntity({
            status: false,
            status_change_reason: prompt("Введите причину отмены выплаты")
          })}
        />
      </div>
    </td>
  </tr>
}


const propTypes = {
  employee: PropTypes.number.isRequired
}

const UnpayedPayments = ({ employee }) => {
  const [{ data: bounties }, fetchBounties] = useApi.get(`/bounties/`, {
    employee_id: employee,
    status: "null"
  }, { mountFetch: true })
  const [{ data: fines }, fetchFines] = useApi.get(`/fines/`, {
    employee_id: employee,
    status: "null"
  }, { mountFetch: true })

  const data = useMemo(() => {
    const _b = (bounties || []).map(el => ({ ...el, __type: "bounty", color: "rgba(0, 255, 0, 0.05)" }))
    const _f = (fines || []).map(el => ({ ...el, __type: "fine", color: "rgba(255, 0, 0, 0.05)" }))
    return [..._b, ..._f].sort((a, b) => moment(a.created_at).diff(moment(b.created_at)))
  }, [bounties, fines])

  const fetchAll = useCallback(() => {
    fetchFines()
    fetchBounties()
  }, [fetchFines, fetchBounties])

  useEffect(() => {
    pubsub.on("fetch-unpayed-payments", fetchAll)
    return () => pubsub.off("fetch-unpayed-payments", fetchAll)
  }, [fetchAll])

  return <table cellPadding={0} cellSpacing={0}>
    <thead>
    <tr>
      <th className="text-center" colSpan={1}>№</th>
      <th className="text-left" colSpan={2}>Тип</th>
      <th className="text-left" colSpan={7}>Описание</th>
      <th className="text-right" colSpan={1}>Сумма</th>
      <th colSpan={1} />
    </tr>
    </thead>
    <tbody>
    {data.length > 0
      ? data.map(payment => (<PaymentEntity key={`${payment.__type}-${payment.id}`} entity={payment} />))
      : <tr>
        <td colSpan={12}>
          <NoResults title="Нет штрафов или премий, ожидающих подтверждения!" />
        </td>
      </tr>
    }
    </tbody>
  </table>
}

UnpayedPayments.propTypes = propTypes

export default UnpayedPayments