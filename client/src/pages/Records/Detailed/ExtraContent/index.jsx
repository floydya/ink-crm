import React, { useContext } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import StartRecordButton from "pages/Records/Detailed/ExtraContent/Modals/Start"
import CancelRecordButton from "pages/Records/Detailed/ExtraContent/Modals/Cancel"
import { RecordStatus, RecordStatusLabel } from "pages/Records/utils"
import { Button, Descriptions, Divider } from "antd"
import { formatDateTime } from "shared/utils/dateTime"
import FinishRecordButton from "pages/Records/Detailed/ExtraContent/Modals/Finish"

const ActionButtons = () => {
  const { record } = useContext(RecordContext)
  if ([RecordStatus.PENDING, RecordStatus.NEW].includes(record.status)) {
    return (
      <>
        <StartRecordButton />
        <CancelRecordButton />
      </>
    )
  } else if ([RecordStatus.IN_WORK].includes(record.status)) {
    return (
      <>
        <FinishRecordButton />
      </>
    )
  }
  return null
}

const RecordExtraContent = () => {
  const { record } = useContext(RecordContext)
  return <>
    <ActionButtons />
    <Divider orientation="right">
      <RecordStatusLabel size="large" status={record.status} children={record.status_display} />
    </Divider>
    <Descriptions column={1} style={{ marginTop: "15px" }}>
      <Descriptions.Item label="Студия">
        <Button type="dashed">{record.parlor.name}</Button>
      </Descriptions.Item>
      <Descriptions.Item label="Кто создал">
        {`${record.created_by.role_display} ${record.created_by.user.full_name}`}
      </Descriptions.Item>
      <Descriptions.Item label="Когда создана">
        {formatDateTime(record.created_at, "dddd, DD.MM.YYYY HH:mm:ss")}
      </Descriptions.Item>
      <Descriptions.Item label="Последнее изменение статуса">
        {formatDateTime(record.status_changed, "dddd, DD.MM.YYYY HH:mm:ss")}
      </Descriptions.Item>
    </Descriptions>
  </>
}

export default RecordExtraContent
