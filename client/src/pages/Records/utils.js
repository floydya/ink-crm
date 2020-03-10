import styled from "styled-components";
import { mixin, color } from "shared/utils/styles";

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
    [RecordStatus.NEW]: mixin.rgba(color.primary, 0.285),
    [RecordStatus.PENDING]: mixin.rgba(color.primary, 0.285),
    [RecordStatus.IN_WORK]: mixin.rgba(color.success, 0.285),
    [RecordStatus.FINISHED]: mixin.rgba(color.secondary, 0.875),
    [RecordStatus.CANCELED]: mixin.rgba(color.danger, 0.285),
}

export const RecordStatusLabel = styled.span`
    ${mixin.tag()}
    background: ${props => recordStatusColors[props.status]};
`