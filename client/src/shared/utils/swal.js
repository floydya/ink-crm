import {default as NativeSwal} from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const Swal = withReactContent(NativeSwal)

Swal.handleAPIError = (error) => {
    if (error.data.non_field_errors) {
        Swal.showValidationMessage(error.data.non_field_errors[0])
    } else {
        Swal.showValidationMessage(Object.values(error.data).flat().join("\n"))
    }
}

export default Swal

