import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react"
import qs from "query-string"
import useApi from "../../shared/hooks/api"
import {
  Notification,
  NotificationData,
  NotificationList, NotificationTitle, NotificationTypeId,
  SectionTitle
} from "./Styles"
import { NotificationTypeIcon } from "../../shared/components"
import { useCurrentProfile } from "../../shared/hooks/currentUser"
import NoResults from "../../shared/components/NoResults"

const Notifications = ({ $scrollOverlayRef, $clickableOverlayRef }) => {
  const profile = useCurrentProfile()
  const [{ data, isLoading }, fetchNotifications] = useApi.get(`/notifications/`, {}, { lazy: true })
  const prevData = useRef(null)
  const [notificationList, setNotificationList] = useState([])
  useEffect(() => {
    if (profile?.id) {
      const initialQueryParams = { recipient: profile.id, limit: 25 }
      fetchNotifications(initialQueryParams)
    }
  }, [profile, fetchNotifications])

  const nextQueryParams = useMemo(() => data && data.next && qs.parseUrl(data.next).query, [data])
  const fetchMore = useCallback(() => {
    if (window.innerHeight + $scrollOverlayRef.current.scrollTop !== $clickableOverlayRef.current.offsetHeight || isLoading) return
    fetchNotifications(nextQueryParams)
  }, [$clickableOverlayRef, $scrollOverlayRef, isLoading, fetchNotifications, nextQueryParams])

  useEffect(() => {
    if (data?.results && prevData.current?.next !== data?.next) {
      setNotificationList(prev => [...prev, ...data.results])
    }
    prevData.current = data
  }, [data])

  useEffect(() => {
    const ref = $scrollOverlayRef.current
    if (ref) {
      ref.addEventListener("scroll", fetchMore)
      return () => ref.removeEventListener("scroll", fetchMore)
    }
  }, [$scrollOverlayRef, fetchMore])

  return <NotificationList>
    {notificationList.length > 0 ? (
      <Fragment>
        <SectionTitle>Уведомления</SectionTitle>
        {notificationList.map(renderNotification)}
      </Fragment>
    ) : (
      <NoResults title="У Вас нет уведомлений." />
    )}
  </NotificationList>
}

const renderNotification = notification => (
  // <Link key={issue.id} to={`/project/board/issues/${issue.id}`}>
  <Notification key={`${notification.type}-${notification.id}`}>
    <NotificationTypeIcon type={notification.type} size={25} />
    <NotificationData>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationTypeId>{notification.timesince} назад</NotificationTypeId>
    </NotificationData>
  </Notification>
  // </Link>
)

export default Notifications