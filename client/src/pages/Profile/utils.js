import React from "react"
import { Tag } from "antd"

export const PaymentStatus = {
  PAYED: "True",
  CANCELED: "False",
  PENDING: "null"
}

export const PaymentStatusNames = {
  [PaymentStatus.PAYED]: "Выплачен",
  [PaymentStatus.CANCELED]: "Отменен",
  [PaymentStatus.PENDING]: "Ожидание"
}

export const PaymentStatusColors = {
  [PaymentStatus.PAYED]: "green",
  [PaymentStatus.CANCELED]: "gray",
  [PaymentStatus.PENDING]: "volcano"
}

export const PaymentStatusLabel = ({ status }) => (
  <Tag color={PaymentStatusColors[status]} children={PaymentStatusNames[status]} />
)