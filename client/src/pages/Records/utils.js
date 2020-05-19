import React from "react";
import { Tag } from "antd"

export const RecordStatus = {
    NEW: 'new',
    PENDING: 'pending',
    IN_WORK: 'in_work',
    FINISHED: 'finished',
    CANCELED: 'canceled',
}

export const RecordStatusOrder = {
    [RecordStatus.NEW]: 100,
    [RecordStatus.PENDING]: 200,
    [RecordStatus.IN_WORK]: 300,
    [RecordStatus.FINISHED]: 400,
    [RecordStatus.CANCELED]: 500,
}

export const recordStatusColors = {
    [RecordStatus.NEW]: "gold",
    [RecordStatus.PENDING]: "gold",
    [RecordStatus.IN_WORK]: "volcano",
    [RecordStatus.FINISHED]: "lime",
    [RecordStatus.CANCELED]: "gray",
}

export const RecordStatusLabel = ({ status, children, ...props }) => (
  <Tag {...props} color={recordStatusColors[status]}>
      {children}
  </Tag>
)

export const canEdit = (status) => [RecordStatus.NEW, RecordStatus.PENDING].includes(status)
