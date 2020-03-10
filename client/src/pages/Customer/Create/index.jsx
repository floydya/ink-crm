import React, { useCallback, useEffect, useRef, useState } from "react"
import history from "../../../history"
import { Button, Input } from "../../../shared/components"
import { isValidPhoneNumber } from "../../../shared/utils/phoneNumberValidation"
import { Container, SearchContainer } from "./Styles"
import useApi from "../../../shared/hooks/api"

const CustomerSearch = () => {

  const [{ clearData }, fetchPhoneNumber] = useApi.get("/phone/")
  const [, createPhone] = useApi.post("/phone/")

  const searchInput = useRef(null)
  useEffect(() => {
    searchInput.current.focus()
  }, [])

  const [phoneNumber, setPhoneNumber] = useState("+380")

  const handleSearch = useCallback(async (e) => {
    try {
      if (e) e.preventDefault()
    } catch {
      // pass
    }
    clearData()
    const response = await fetchPhoneNumber({ number: phoneNumber })
    if ((response || []).length > 0) {
      if (response[0].customer) {
        await history.push(`/customers/${response[0].customer}`)
      } else {
        await history.push(`/customers/create/${response[0].id}`)
      }
    } else {
      const createResponse = await createPhone({ number: phoneNumber })
      await history.push(`/customers/create/${createResponse.id}`)
    }
  }, [createPhone, clearData, fetchPhoneNumber, phoneNumber])

  return <Container>
    <SearchContainer onSubmit={handleSearch}>
      <Input ref={searchInput} icon="phone" onChange={setPhoneNumber} value={phoneNumber} />
      <Button variant="primary" type="submit" disabled={!isValidPhoneNumber(phoneNumber)}>
        Найти
      </Button>
    </SearchContainer>
  </Container>

}

export default CustomerSearch