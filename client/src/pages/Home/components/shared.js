import React, { useCallback, useMemo, useState } from "react"
import Button from "../../../shared/components/Button"
import { formatDateTime } from "../../../shared/utils/dateTime"

export const ButtonCell = ({ cell: { value } }) => {
  const redirectUrl = useCallback(() => window.open(value), [value])
  return <Button
    disabled={!value}
    variant="secondary"
    icon="link"
    onClick={redirectUrl}
  >
    Перейти
  </Button>
}

export const CreatedCell = ({row: {original: {created_at, created_by}}}) => {
  return <div>
    <p>{created_by.full_name}</p>
    <p>{formatDateTime(created_at, "DD.MM.YYYY HH:mm:ss")}</p>
  </div>
}

export const useModalStateHelper = () => {
  const [modalShow, setModalShow] = useState(false)
  return useMemo(() => ({
    open: () => setModalShow(true),
    close: () => setModalShow(false),
    isOpen: () => modalShow === true
  }), [modalShow])
}

export const homeCardsColumns = [
  {
    Header: "ID",
    accessor: "id",
    width: 50,
    className: "text-center",
  },
  {
    Header: "Создание",
    accessor: "created_at",
    Cell: CreatedCell,
    width: 200,
  },
  {
    Header: "Тип",
    accessor: "type",
    Cell: ({ cell }) => cell.value.name,
    width: 200,
  },
  {
    Header: "Заметка",
    accessor: "note",
  },
  {
    Header: "Сумма",
    accessor: "amount",
    className: "text-right",
  },
  {
    Header: "Ссылка",
    accessor: "href",
    Cell: ButtonCell,
    className: "text-center",
  }
]