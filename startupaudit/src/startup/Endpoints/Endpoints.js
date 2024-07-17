const BASE_URL = "http://localhost:5009/startup-api/";

export const LOGIN = `${BASE_URL}login`;
export const SIGNUP = `${BASE_URL}signup`;

/****************Company******************* */
export const GET_ORGANIZATION_API = `${BASE_URL}organization`;

export const DELETE_ORGANIZATION_API = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;

export const GET_SPECIFIC_ORGANIZATION = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;

export const POST_ORGANIZATION_API = `${BASE_URL}organization`;

export const PUT_SPECIFIC_ORGANIZATION = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;
