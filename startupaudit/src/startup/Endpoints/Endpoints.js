const BASE_URL = "http://localhost:5009/startup-api/";

export const LOGIN = `${BASE_URL}login`;
export const SIGNUP = `${BASE_URL}signup`;

/****************Company******************* */
export const GET_ORGANIZATION_API = (user_id) =>
  `${BASE_URL}organization/${user_id}`;

export const DELETE_ORGANIZATION_API = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;

export const GET_SPECIFIC_ORGANIZATION = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;

export const POST_ORGANIZATION_API = `${BASE_URL}organization`;

export const UPDATE_SPECIFIC_ORGANIZATION = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;
/********************ENVIRONMENT************************** */
export const POST_ENVIRONMENT_API = `${BASE_URL}environment`;
export const GET_ENVIRONMENT_API = `${BASE_URL}environment`;
export const DELETE_ENVIRONMENT_API = (environmentid) =>
  `${BASE_URL}environment/${environmentid}`;
export const GET_SPECIFIC_ENVIRONMENT = (environmentid) =>
  `${BASE_URL}environment/${environmentid}`;
export const UPDATE_SPECIFIC_ENVIRONMENT = (environmentid) =>
  `${BASE_URL}environment/${environmentid}`;
