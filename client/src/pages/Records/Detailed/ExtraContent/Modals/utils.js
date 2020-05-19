export const getCoupon = (couponList, coupon) => {
  return (couponList || []).find(el => el.id === coupon)
}

export const getCouponDenomination = (couponList, coupon) => {
  return getCoupon(couponList, coupon)?.denomination || 0
}

export const getCouponType = (couponList, coupon) => {
  return getCoupon(couponList, coupon)?.type_display
}

export const getPrepayments = prepayments => {
  return (prepayments || []).reduce(
    (acc, next) => acc + parseFloat(next.value),
    0.0
  )
}

export const getPerformerMotivation = (performer, session_type) => {
  return (
    (performer?.session_motivations || []).find(
      el => el.session_type.id === session_type
    )?.base_percent / 100.0 || 0
  )
}

export const getPerformerCash = (record, price, coupons, coupon) => {
  return getRevenue(getCoupon(coupons, coupon), price) *
    getPerformerMotivation(record.performer, record.type.id)
}

export const getInviteMotivation = (inviter, session_type) => {
  return (
    (inviter?.session_motivations || []).find(
      el => el.session_type.id === session_type
    )?.invite_percent / 100.0 || 0
  )
}

export const getInviteCash = (record, price, coupons, coupon) => {
  return getRevenue(getCoupon(coupons, coupon), price) *
    getInviteMotivation(record.created_by, record.type.id)
}

export const getRevenue = (coupon, price) => {
  const couponDenomination =
    coupon?.type === "discount" ? parseFloat(coupon.denomination) : 0.0
  return price - couponDenomination
}
