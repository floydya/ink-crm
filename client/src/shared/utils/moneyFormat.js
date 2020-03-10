import React from 'react'

export const formatMoney = amount => {
  amount = parseFloat(amount)
  return <span style={{ color: amount > 0 ? "green" : "red" }}>
    {amount > 0 && "+"}{amount.toFixed(2)}
  </span>
}