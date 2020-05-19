import React, { useContext, useMemo } from "react"
import { message, Form, Input, Table, Button, TreeSelect, Popconfirm } from "antd"
import pubsub from "sweet-pubsub"
import { RecordContext } from "pages/Records/Detailed/context"
import useApi from "shared/hooks/api"
import ModalForm from "components/ModalForm"
import { RecordStatus } from "pages/Records/utils"
import uniqBy from "lodash/uniqBy"

const groupItems = (items) => {
  const categories = uniqBy(items.map(el => el.category), e => e.id)
  return categories.map(category => ({
    title: category.name,
    value: `category-${category.id}`,
    selectable: false,
    checkable: false,
    children: items
      .filter(item => item.category.id === category.id)
      .map(item => ({ title: item.name, value: item.id }))
  }))
}

const CreateConsumableModalForm = () => {
  const { record } = useContext(RecordContext)
  const [{ data }] = useApi.get(`/store/items/`, {}, { mountFetch: true })
  const items = useMemo(() => groupItems(data || []), [data])
  const [{ isCreating }, createConsumable] = useApi.post(`/store/consumables/`)

  return <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <ModalForm
      buttonProps={{
        type: "primary",
        children: "Добавить расходник"
      }}
      title={`Добавление расходника`}
      modalProps={{
        okText: "Добавить",
        cancelText: "Отменить",
        okButtonProps: { loading: isCreating }
      }}
      formProps={{ layout: "vertical" }}
      handleSubmit={async (values) => {
        const formData = {
          ...values, record: record.id
        }
        await createConsumable(formData)
        message.success("Расходник успешно добавлен!")
        pubsub.emit("fetch-record")
      }}
    >
      <Form.Item label="Товар" name="item">
        <TreeSelect
          treeData={items}
          showSearch
          filterTreeNode={(input, option) => option.title.toLowerCase().indexOf(input.toLowerCase()) > -1}
        />
      </Form.Item>
      <Form.Item label="Количество" name="value">
        <Input type="number" />
      </Form.Item>
    </ModalForm>
  </div>
}

const DeleteConsumablePrompt = ({ consumable }) => {
  const [, deleteConsumable] = useApi.delete(`/store/consumables/${consumable.id}/`)
  return <Popconfirm
    title="Вы действительно хотите удалить этот расходник?"
    cancelText="Отмена"
    okText="Удалить"
    onConfirm={async () => {
      await deleteConsumable()
      message.success("Расходник успешно удален!")
      pubsub.emit("fetch-record")
    }}
  >
    <Button type="dashed">Удалить</Button>
  </Popconfirm>
}

const Consumables = () => {
  const { record } = useContext(RecordContext)
  const [{ data }] = useApi.get(`/store/consumables/`, { record: record.id }, { mountFetch: true })
  return <Table
    pagination={false}
    title={() => record.status === RecordStatus.IN_WORK ? <CreateConsumableModalForm /> : null}
    columns={[
      { title: "ID", dataIndex: "id", key: "id" },
      {
        title: "Товар",
        dataIndex: "item",
        key: "item",
        render: v => v.name
      },
      { title: "Количество", dataIndex: "value", key: "value" },
      ...record.status === RecordStatus.IN_WORK ? [{
        title: "Действия", dataIndex: "", key: "x", render: (_, r) => <DeleteConsumablePrompt consumable={r} />
      }] : []
    ]}
    dataSource={data || []}
    rowKey="id"
  />
}

export default Consumables
