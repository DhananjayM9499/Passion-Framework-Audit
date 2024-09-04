const BASE_URL = "http://localhost:5009/startup-api/";
//const BASE_URL = "https://audit1.passionit.com/startup-api/startup-api/";

export const LOGIN = `${BASE_URL}login`;
export const SIGNUP = `${BASE_URL}signup`;

/****************ORGANIZATION******************* */
export const GET_ORGANIZATION_API = (user_id) =>
  `${BASE_URL}userOrganization/${user_id}`;

export const DELETE_ORGANIZATION_API = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;

export const GET_SPECIFIC_ORGANIZATION = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;

export const POST_ORGANIZATION_API = `${BASE_URL}organization`;

export const UPDATE_SPECIFIC_ORGANIZATION = (organizationid) =>
  `${BASE_URL}organization/${organizationid}`;

export const GET_ORGANIZATION_BYNAME = (organization) =>
  `${BASE_URL}organizationName/${organization}`;
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

/*****************************PROJECT DETAILS********************************************************** */
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
export const GET_PROJECTDETAILS_USERID = (user_id) =>
  `${BASE_URL}userprojectdetails/${user_id}`;
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
/************************************EVIDENCE************************************************ */
export const POST_EVIDENCE_API = `${BASE_URL}evidence`;
export const GET_EVIDENCE_API = `${BASE_URL}evidence`;
export const DELETE_EVIDENCE_API = (evidenceid) =>
  `${BASE_URL}evidence/${evidenceid}`;
export const GET_SPECIFIC_EVIDENCE = (evidenceid) =>
  `${BASE_URL}evidence/${evidenceid}`;
export const UPDATE_SPECIFIC_EVIDENCE = (evidenceid) =>
  `${BASE_URL}evidence/${evidenceid}`;
export const GET_EVIDENCE_BYUSERID = (user_id, projectdetailsid) =>
  `${BASE_URL}evidence/${user_id}/${projectdetailsid}`;
/************************************ASSESSMENT************************************************ */
export const POST_ASSESSMENT_API = `${BASE_URL}assessment`;
export const GET_ASSESSMENT_API = `${BASE_URL}assessment`;
export const DELETE_ASSESSMENT_API = (assessmentid) =>
  `${BASE_URL}assessment/${assessmentid}`;
export const GET_SPECIFIC_ASSESSMENT = (assessmentid) =>
  `${BASE_URL}assessment/${assessmentid}`;
export const UPDATE_SPECIFIC_ASSESSMENT = (assessmentid) =>
  `${BASE_URL}assessment/${assessmentid}`;
export const GET_ASSESSMENT_BYUSERID = (user_id, evidenceid) =>
  `${BASE_URL}assessment/${user_id}/${evidenceid}`;
/************************************AUDIT************************************************ */
export const POST_AUDIT_API = `${BASE_URL}governanceaudit`;
export const GET_AUDIT_API = `${BASE_URL}governanceaudit`;
export const DELETE_AUDIT_API = (governanceauditid) =>
  `${BASE_URL}governanceaudit/${governanceauditid}`;
export const GET_SPECIFIC_AUDIT = (governanceauditid) =>
  `${BASE_URL}governanceaudit/${governanceauditid}`;
export const UPDATE_SPECIFIC_AUDIT = (governanceauditid) =>
  `${BASE_URL}governanceaudit/${governanceauditid}`;
export const GET_AUDIT_BYUSERID = (user_id, auditplanid) =>
  `${BASE_URL}governanceaudit/${user_id}/${auditplanid}`;
/************************************AUDIT PLAN************************************************ */
export const POST_AUDITPLAN_API = `${BASE_URL}auditplan`;
export const GET_AUDITPLAN_API = `${BASE_URL}auditplan`;
export const DELETE_AUDITPLAN_API = (auditplanid) =>
  `${BASE_URL}auditplan/${auditplanid}`;
export const GET_SPECIFIC_AUDITPLAN = (auditplanid) =>
  `${BASE_URL}auditplan/${auditplanid}`;
export const UPDATE_SPECIFIC_AUDITPLAN = (auditplanid) =>
  `${BASE_URL}auditplan/${auditplanid}`;
export const GET_AUDITPLAN_BYUSERID = (user_id, assessmentid) =>
  `${BASE_URL}auditplan/${user_id}/${assessmentid}`;
export const GET_USER_AUDITPLAN = (user_id) =>
  `${BASE_URL}userauditplan/${user_id}`;
/********************************SCORE CARD************************************************ */
export const GET_SCORECARD_API = (user_id) => `${BASE_URL}scorecard/${user_id}`;
export const RESET_PASSWORD_API = `${BASE_URL}reset-password`;
export const VALIDATE_TOKEN_API = `${BASE_URL}validate-reset-token`;
export const UPDATE_PASSWORD_API = `${BASE_URL}password`;
