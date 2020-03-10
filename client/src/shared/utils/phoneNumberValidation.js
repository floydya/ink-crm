import {parsePhoneNumberFromString} from 'libphonenumber-js/core'
import metadata from 'libphonenumber-js/metadata.min.json'

export function isValidPhoneNumber(value) {
    if (!value) return false

    const phoneNumber = parsePhoneNumberFromString(value, metadata)
    if (!phoneNumber) return false

    return phoneNumber.isValid()
}
