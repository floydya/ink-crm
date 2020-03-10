import React, { useCallback, useMemo } from "react"
import { Button } from "../../../../shared/components"
import { useModalStateHelper } from "../../../Home/components/shared"
import Modal from "../../../../shared/components/Modal"
import { StoreForm } from "../MotivationForm"
import useApi from "../../../../shared/hooks/api"
import pubsub from "sweet-pubsub"

const TableRow = ({ sell, types, employee }) => {
  const modalHelper = useModalStateHelper()
  const [, deleteMotivation] = useApi.delete(`/motivation/sells/${sell?.id}/`)
  const handleDelete = useCallback(() => {
    deleteMotivation().then(() => pubsub.emit("fetch-profile"))
  }, [deleteMotivation])
  return <tr>
    <td colSpan={2}>{sell.sell_category.name}</td>
    <td colSpan={1} className="text-center">{sell.base_percent} %</td>
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
            <StoreForm
              modalClose={close}
              employee={employee}
              motivation={sell}
              types={types}
            />
          )}
        />
      )}
    </td>
  </tr>
}


const StoreTable = ({ employee, sells }) => {
  const modalHelper = useModalStateHelper()
  const [{ data: types }] = useApi.get(`/store/categories/`, {}, { mountFetch: true })
  const typeOptions = useMemo(
    () => (types || []).map(el => ({ value: el.id, label: el.name })).filter(
      el => !sells.find(mot => mot.sell_category?.id === el.value)
    ),
    [sells, types]
  )
  return <table>
    <caption>
      Сеансы
    </caption>
    <thead>
    <tr>
      <th colSpan={2}>Категория</th>
      <th colSpan={1} className="text-center">Процент</th>
      <th colSpan={1} />
    </tr>
    </thead>
    <tbody>
    {sells.map(sell => (<TableRow sell={sell} types={typeOptions} employee={employee} />))}
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
              <StoreForm
                modalClose={close}
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

export default StoreTable