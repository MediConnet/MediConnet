import { REQUEST_STATUS, REQUEST_STATUS_LABEL } from "../../../shared/config/domain.constants";

export const RequestStatus = REQUEST_STATUS;
export type RequestStatusType = keyof typeof REQUEST_STATUS;
export const RequestStatusLabel = REQUEST_STATUS_LABEL;
