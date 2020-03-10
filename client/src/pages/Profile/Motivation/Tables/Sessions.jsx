import React, { useCallback, useMemo } from "react"
import { Button } from "../../../../shared/components"
import { useModalStateHelper } from "../../../Home/components/shared"
import Modal from "../../../../shared/components/Modal"
import { SessionForm } from "../MotivationForm"
import useApi from "../../../../shared/hooks/api"
import pubsub from "sweet-pubsub"

const TableRow = ({ session, types, employee }) => {
  const modalHelper = useModalStateHelper()
  const [, deleteMotivation] = useApi.delete(`/motivation/sessions/${session?.id}/`)
  const handleDelete = useCallback(() => {
    deleteMotivation().then(() => pubsub.emit("fetch-profile"))
  }, [deleteMotivation])
  return <tr>
    <td colSpan={2}>{session.session_type.name}</td>
    <td colSpan={1} className="text-center">{session.base_percent} %</td>
    <td colSpan={1} className="text-center">{session.invite_percent} %</td>
    <td colSpan={1} className="text-center"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Button icon="edit" iconSize={12} variant="primary" onClick={modalHelper.open} />
      <Button icon="trash" iconSize={12} variant="danger" onClick={handleDelete} />
      {modalHelper.isOpen() && (
        <Modal
          isOpen
          withCloseIcon
          width={600}
          onClose={modalHelper.close}
          renderContent={({ close }) => (
            <SessionForm
              modalClose={close}
              href="sessions"
              employee={employee}
              motivation={session}
              types={types}
            />
          )}
        />
      )}
    </td>
  </tr>
}


const SessionsTable = ({ employee, sessions }) => {
  const modalHelper = useModalStateHelper()
  const [{ data: types }] = useApi.get(`/types/sessions/`, {}, { mountFetch: true })
  const typeOptions = useMemo(
    () => (types || []).map(el => ({ value: el.id, label: el.name })).filter(
      el => !sessions.find(mot => mot.session_type?.id === el.value)
    ),
    [sessions, types]
  )
  return <table>
    <caption>
      Сеансы
    </caption>
    <thead>
    <tr>
      <th colSpan={2}>Категория</th>
      <th colSpan={1} className="text-center">Процент</th>
      <th colSpan={1} className="text-center">Приглашение</th>
      <th colSpan={1} />
    </tr>
    </thead>
    <tbody>
    {sessions.map(session => (<TableRow session={session} types={typeOptions} employee={employee} />))}
    </tbody>
    {typeOptions.length > 0 && <tfoot>
    <tr>
      <td colSpan={5} className="text-center">
        <Button
          icon="plus-square"
          variant="empty"
          onClick={modalHelper.open}
        >
          Добавить
        </Button>
        {modalHelper.isOpen() && (
          <Modal
            isOpen
            withCloseIcon
            width={600}
            onClose={modalHelper.close}
            renderContent={({ close }) => (
              <SessionForm
                modalClose={close}
                href="sessions"
                employee={employee}
                types={typeOptions}
              />
            )}
          />
        )}
      </td>
    </tr>
    </tfoot>}
  </table>
}

export default SessionsTable