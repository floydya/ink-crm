import React, { useContext } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import { RecordStatus } from "pages/Records/utils"
import { Button, Popconfirm, message } from "antd"
import useApi from "shared/hooks/api"
import pubsub from "sweet-pubsub"

const StartRecordButton = () => {
  const { record } = useContext(RecordContext)
  const [, startRecord] = useApi.patch(`/records/${record.id}/`)
  return (
    <Popconfirm
      cancelText="Отменить"
      okText="Начать"
      title="Вы уверены, что хотите начать запись?"
      onConfirm={async () => {
        await startRecord({ status: RecordStatus.IN_WORK })
        pubsub.emit("fetch-record")
        message.info("Запись начата")
      }}
    >
      <Button type="primary">Начать</Button>
    </Popconfirm>
  )
}

export default StartRecordButton
