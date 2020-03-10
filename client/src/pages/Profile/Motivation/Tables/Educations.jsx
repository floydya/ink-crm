import React, { useCallback, useMemo } from "react"
import { Button } from "../../../../shared/components"
import { useModalStateHelper } from "../../../Home/components/shared"
import Modal from "../../../../shared/components/Modal"
import { SessionForm } from "../MotivationForm"
import useApi from "../../../../shared/hooks/api"
import pubsub from "sweet-pubsub"

const TableRow = ({ employee, education, types }) => {
  const modalHelper = useModalStateHelper()
  const [, deleteMotivation] = useApi.delete(`/motivation/educations/${education?.id}/`)
  const handleDelete = useCallback(() => {
    deleteMotivation().then(() => pubsub.emit("fetch-profile"))
  }, [deleteMotivation])
  return <tr>
    <td colSpan={2}>{education.session_type.name}</td>
    <td colSpan={1} className="text-center">{education.base_percent} %</td>
    <td colSpan={1} className="text-center">{education.invite_percent} %</td>
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
              href="educations"
              employee={employee}
              motivation={education}
              types={types}
            />
          )}
        />
      )}
    </td>
  </tr>
}


const EducationsTable = ({ educations, employee }) => {
  const modalHelper = useModalStateHelper()
  const [{ data: types }] = useApi.get(`/types/sessions/`, {}, { mountFetch: true })
  const typeOptions = useMemo(
    () => (types || []).map(el => ({ value: el.id, label: el.name })).filter(
      el => !educations.find(mot => mot.session_type?.id === el.value)
    ),
    [educations, types]
  )
  return <table>
    <caption>
      Обучение
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
    {educations.map(education => (<TableRow education={education} types={typeOptions} employee={employee} />))}
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
                href="educations"
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

export default EducationsTable