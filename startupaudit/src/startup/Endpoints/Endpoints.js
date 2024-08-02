const BASE_URL = "http://localhost:5009/startup-api/";

export const LOGIN = `${BASE_URL}login`;
export const SIGNUP = `${BASE_URL}signup`;

/****************ORGANIZATION******************* */
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
/******************STAKEHOLDER*************************************** */
export const POST_STAKEHOLDER_API = `${BASE_URL}stakeholder`;
export const GET_STAKEHOLDER_API = `${BASE_URL}stakeholder`;
export const DELETE_STAKEHOLDER_API = (stakeholderid) =>
  `${BASE_URL}stakeholder/${stakeholderid}`;
export const GET_SPECIFIC_STAKEHOLDER = (stakeholderid) =>
  `${BASE_URL}stakeholder/${stakeholderid}`;
export const UPDATE_SPECIFIC_STAKEHOLDER = (stakeholderid) =>
  `${BASE_URL}stakeholder/${stakeholderid}`;
/***********************VULNERABILITIES**************************************** */
export const POST_VULNERABILITY_API = `${BASE_URL}vulnerability`;
export const GET_VULNERABILITY_API = `${BASE_URL}vulnerability`;
export const DELETE_VULNERABILITY_API = (vulnerabilityid) =>
  `${BASE_URL}vulnerability/${vulnerabilityid}`;
export const GET_SPECIFIC_VULNERABILITY = (vulnerabilityid) =>
  `${BASE_URL}vulnerability/${vulnerabilityid}`;
export const UPDATE_SPECIFIC_VULNERABILITY = (vulnerabilityid) =>
  `${BASE_URL}vulnerability/${vulnerabilityid}`;
/*****************************TECHNOLOGY********************************************************** */
export const POST_TECHNOLOGY_API = `${BASE_URL}technology`;
export const GET_TECHNOLOGY_API = `${BASE_URL}technology`;
export const DELETE_TECHNOLOGY_API = (technologyid) =>
  `${BASE_URL}technology/${technologyid}`;
export const GET_SPECIFIC_TECHNOLOGY = (technologyid) =>
  `${BASE_URL}technology/${technologyid}`;
export const UPDATE_SPECIFIC_TECHNOLOGY = (technologyid) =>
  `${BASE_URL}technology/${technologyid}`;
/*****************************RESOURCES********************************************************** */
export const POST_RESOURCES_API = `${BASE_URL}resource`;
export const GET_RESOURCES_API = `${BASE_URL}resource`;
export const DELETE_RESOURCES_API = (resourceid) =>
  `${BASE_URL}resource/${resourceid}`;
export const GET_SPECIFIC_RESOURCES = (resourceid) =>
  `${BASE_URL}resource/${resourceid}`;
export const UPDATE_SPECIFIC_RESOURCES = (resourceid) =>
  `${BASE_URL}resource/${resourceid}`;
/*****************************PROJECT TYPE********************************************************** */
export const POST_PROJECTTYPE_API = `${BASE_URL}projecttype`;
export const GET_PROJECTTYPE_API = `${BASE_URL}projecttype`;
export const DELETE_PROJECTTYPE_API = (projecttypeid) =>
  `${BASE_URL}projecttype/${projecttypeid}`;
export const GET_SPECIFIC_PROJECTTYPE = (projecttypeid) =>
  `${BASE_URL}projecttype/${projecttypeid}`;
export const UPDATE_SPECIFIC_PROJECTTYPE = (projecttypeid) =>
  `${BASE_URL}projecttype/${projecttypeid}`;
/*****************************PROJECT CATEGORY********************************************************** */
export const POST_PROJECTCATEGORY_API = `${BASE_URL}projectcategory`;
export const GET_PROJECTCATEGORY_API = `${BASE_URL}projectcategory`;
export const DELETE_PROJECTCATEGORY_API = (projectcategoryid) =>
  `${BASE_URL}projectcategory/${projectcategoryid}`;
export const GET_SPECIFIC_PROJECTCATEGORY = (projectcategoryid) =>
  `${BASE_URL}projectcategory/${projectcategoryid}`;
export const UPDATE_SPECIFIC_PROJECTCATEGORY = (projectcategoryid) =>
  `${BASE_URL}projectcategory/${projectcategoryid}`;
/*****************************RESPONSIBILITY CENTER********************************************************** */
export const POST_RESPONSIBILITYCENTER_API = `${BASE_URL}responsibilitycenter`;
export const GET_RESPONSIBILITYCENTER_API = `${BASE_URL}responsibilitycenter`;
export const DELETE_RESPONSIBILITYCENTER_API = (responsibilitycenterid) =>
  `${BASE_URL}responsibilitycenter/${responsibilitycenterid}`;
export const GET_SPECIFIC_RESPONSIBILITYCENTER = (responsibilitycenterid) =>
  `${BASE_URL}responsibilitycenter/${responsibilitycenterid}`;
export const UPDATE_SPECIFIC_RESPONSIBILITYCENTER = (responsibilitycenterid) =>
  `${BASE_URL}responsibilitycenter/${responsibilitycenterid}`;
/*****************************RESPONSIBILITY GROUP********************************************************** */
export const POST_RESPONSIBILITYGROUP_API = `${BASE_URL}responsibilitygroup`;
export const GET_RESPONSIBILITYGROUP_API = `${BASE_URL}responsibilitygroup`;
export const DELETE_RESPONSIBILITYGROUP_API = (responsibilitygroupid) =>
  `${BASE_URL}responsibilitygroup/${responsibilitygroupid}`;
export const GET_SPECIFIC_RESPONSIBILITYGROUP = (responsibilitygroupid) =>
  `${BASE_URL}responsibilitygroup/${responsibilitygroupid}`;
export const UPDATE_SPECIFIC_RESPONSIBILITYGROUP = (responsibilitygroupid) =>
  `${BASE_URL}responsibilitygroup/${responsibilitygroupid}`;
/*****************************THEME********************************************************** */
export const POST_THEMEMASTER_API = `${BASE_URL}thememaster`;
export const GET_THEMEMASTER_API = `${BASE_URL}thememaster`;
export const DELETE_THEMEMASTER_API = (thememasterid) =>
  `${BASE_URL}thememaster/${thememasterid}`;
export const GET_SPECIFIC_THEMEMASTER = (thememasterid) =>
  `${BASE_URL}thememaster/${thememasterid}`;
export const UPDATE_SPECIFIC_THEMEMASTER = (thememasterid) =>
  `${BASE_URL}thememaster/${thememasterid}`;
/*****************************THEME ACTIVITY********************************************************** */
export const POST_THEMEACTIVITY_API = `${BASE_URL}themeactivity`;
export const GET_THEMEACTIVITY_API = `${BASE_URL}themeactivity`;
export const DELETE_THEMEACTIVITY_API = (themeactivityid) =>
  `${BASE_URL}themeactivity/${themeactivityid}`;
export const GET_SPECIFIC_THEMEACTIVITY = (themeactivityid) =>
  `${BASE_URL}themeactivity/${themeactivityid}`;
export const UPDATE_SPECIFIC_THEMEACTIVITY = (themeactivityid) =>
  `${BASE_URL}themeactivity/${themeactivityid}`;
/*****************************ACTIVITY GROUP********************************************************** */
export const POST_ACTIVITYGROUP_API = `${BASE_URL}activitygroup`;
export const GET_ACTIVITYGROUP_API = `${BASE_URL}activitygroup`;
export const DELETE_ACTIVITYGROUP_API = (activitygroupid) =>
  `${BASE_URL}activitygroup/${activitygroupid}`;
export const GET_SPECIFIC_ACTIVITYGROUP = (activitygroupid) =>
  `${BASE_URL}activitygroup/${activitygroupid}`;
export const UPDATE_SPECIFIC_ACTIVITYGROUP = (activitygroupid) =>
  `${BASE_URL}activitygroup/${activitygroupid}`;
/*****************************GOVERNANCE GROUP********************************************************** */
export const POST_GOVERNANCEGROUP_API = `${BASE_URL}governancegroup`;
export const GET_GOVERNANCEGROUP_API = `${BASE_URL}governancegroup`;
export const DELETE_GOVERNANCEGROUP_API = (groupid) =>
  `${BASE_URL}governancegroup/${groupid}`;
export const GET_SPECIFIC_GOVERNANCEGROUP = (groupid) =>
  `${BASE_URL}governancegroup/${groupid}`;
export const UPDATE_SPECIFIC_GOVERNANCEGROUP = (groupid) =>
  `${BASE_URL}governancegroup/${groupid}`;
/*****************************THRUST AREA********************************************************** */
export const POST_THRUSTAREA_API = `${BASE_URL}thrustarea`;
export const GET_THRUSTAREA_API = `${BASE_URL}thrustarea`;
export const DELETE_THRUSTAREA_API = (thrustid) =>
  `${BASE_URL}thrustarea/${thrustid}`;
export const GET_SPECIFIC_THRUSTAREA = (thrustid) =>
  `${BASE_URL}thrustarea/${thrustid}`;
export const UPDATE_SPECIFIC_THRUSTAREA = (thrustid) =>
  `${BASE_URL}thrustarea/${thrustid}`;
/*****************************GOVERNANCE CONTROL********************************************************** */
export const POST_GOVERNANCECONTROL_API = `${BASE_URL}governancecontrol`;
export const GET_GOVERNANCECONTROL_API = `${BASE_URL}governancecontrol`;
export const DELETE_GOVERNANCECONTROL_API = (controlid) =>
  `${BASE_URL}governancecontrol/${controlid}`;
export const GET_SPECIFIC_GOVERNANCECONTROL = (controlid) =>
  `${BASE_URL}governancecontrol/${controlid}`;
export const UPDATE_SPECIFIC_GOVERNANCECONTROL = (controlid) =>
  `${BASE_URL}governancecontrol/${controlid}`;

/*****************************GOVERNANCE CONTROL********************************************************** */
export const POST_PROJECTDETAILS_API = `${BASE_URL}projectdetails`;
export const GET_PROJECTDETAILS_API = `${BASE_URL}projectdetails`;
export const DELETE_PROJECTDETAILS_API = (projectdetailsid) =>
  `${BASE_URL}projectdetails/${projectdetailsid}`;
export const GET_SPECIFIC_PROJECTDETAILS = (projectdetailsid) =>
  `${BASE_URL}projectdetails/${projectdetailsid}`;
export const GET_PROJECTDETAILS_BYID = (user_id, organization) =>
  `${BASE_URL}projectdetails/${user_id}/${organization}`;
export const UPDATE_SPECIFIC_PROJECTDETAILS = (projectdetailsid) =>
  `${BASE_URL}projectdetails/${projectdetailsid}`;
/*****************************OBJECT TYPE********************************************************** */
export const POST_OBJECTTYPE_API = `${BASE_URL}objecttype`;
export const GET_OBJECTTYPE_API = `${BASE_URL}objecttype`;
export const DELETE_OBJECTTYPE_API = (objecttypeid) =>
  `${BASE_URL}objecttype/${objecttypeid}`;
export const GET_SPECIFIC_OBJECTTYPE = (objecttypeid) =>
  `${BASE_URL}objecttype/${objecttypeid}`;
export const UPDATE_SPECIFIC_OBJECTTYPE = (objecttypeid) =>
  `${BASE_URL}objecttype/${objecttypeid}`;
/*****************************OBJECT ********************************************************** */
export const POST_OBJECT_API = `${BASE_URL}object`;
export const GET_OBJECT_API = `${BASE_URL}object`;
export const DELETE_OBJECT_API = (objectid) => `${BASE_URL}object/${objectid}`;
export const GET_SPECIFIC_OBJECT = (objectid) =>
  `${BASE_URL}object/${objectid}`;
export const UPDATE_SPECIFIC_OBJECT = (objectid) =>
  `${BASE_URL}object/${objectid}`;
