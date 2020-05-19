import React, { useContext } from "react"
import { RecordContext } from "pages/Records/Detailed/context"
import { Descriptions } from "antd"
import ChangeTypeModal from "pages/Records/Detailed/Content/Modals/ChangeType"
import ChangePerformerModal from "pages/Records/Detailed/Content/Modals/ChangePerformer"
import ChangeDatetimeModal from "pages/Records/Detailed/Content/Modals/ChangeDate"
import ChangeApproximateTime from "pages/Records/Detailed/Content/Modals/ChangeApproximateTime"

const RecordContent = () => {
  const { record } = useContext(RecordContext)

  return <Descriptions column={1}>
    <Descriptions.Item label="Тип записи">
      <ChangeTypeModal/>
    </Descriptions.Item>
    <Descriptions.Item label="Исполнитель">
      <ChangePerformerModal />
    </Descriptions.Item>
    <Descriptions.Item label="Дата">
      <ChangeDatetimeModal />
    </Descriptions.Item>
    <Descriptions.Item label="Примерное время на сеанс">
      <ChangeApproximateTime />
    </Descriptions.Item>
    {record.sketch && <Descriptions.Item label="Эскиз">
      <a href={record.sketch} rel="noopener noreferrer" target="_blank">
        Открыть в новой вкладке
      </a>
    </Descriptions.Item>}
    {record.comment && <Descriptions.Item label="Комментарий">{record.comment}</Descriptions.Item>}
  </Descriptions>
}

export default RecordContent