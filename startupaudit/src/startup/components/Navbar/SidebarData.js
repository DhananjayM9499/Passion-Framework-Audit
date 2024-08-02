import React from "react";
import { GoOrganization } from "react-icons/go";
import {
  AiOutlineAudit,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
} from "react-icons/ai";
import { RiGovernmentLine } from "react-icons/ri";
import { VscTypeHierarchy } from "react-icons/vsc";
import {
  LiaExternalLinkSquareAltSolid,
  LiaObjectUngroup,
} from "react-icons/lia";
import {
  PiAirTrafficControl,
  PiUsersThree,
  PiBlueprintLight,
} from "react-icons/pi";
import { IoWarningOutline, IoHardwareChipOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import { BiLeaf } from "react-icons/bi";
import { LuClipboardCheck } from "react-icons/lu";
import { TbListDetails, TbActivityHeartbeat } from "react-icons/tb";
import { MdOutlineCategory, MdSyncProblem } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";
export const SidebarData = [
  {
    title: "Home",
    path: "/home",
    icon: <AiOutlineHome />,
    cName: "nav-text text-left",
  },
  {
    title: "Organization",
    path: "/organization",
    icon: <GoOrganization />,
    cName: "nav-text",
  },

  {
    title: "Governance",
    path: "#",
    icon: <AiOutlineAudit />,
    cName: "sub-nav-text",
    subNav: [
      {
        title: "Governance Framework",
        path: "/governancegroup",
        icon: <RiGovernmentLine />,
        cName: "sub-nav-text",
      },
      {
        title: "Thrust Area",
        path: "/thrustarea",
        icon: <LiaExternalLinkSquareAltSolid />,
        cName: "sub-nav-text",
      },
      {
        title: "Control",
        path: "/governancecontrol",
        icon: <PiAirTrafficControl />,
        cName: "sub-nav-text",
      },
    ],
  },
  {
    title: "Master",
    path: "#",
    icon: <TbListDetails />,
    cName: "sub-nav-text",
    subNav: [
      {
        title: "Environment",
        path: "/environment",
        icon: <BiLeaf />,
        cName: "sub-nav-text",
      },
      {
        title: "Stakeholder",
        path: "/stakeholder",
        icon: <GrGroup />,
        cName: "sub-nav-text",
      },
      {
        title: "Vulnerabilities",
        path: "/vulnerabilities",
        icon: <IoWarningOutline />,
        cName: "sub-nav-text",
      },
      {
        title: "Technology",
        path: "/technology",
        icon: <IoHardwareChipOutline />,
        cName: "sub-nav-text",
      },

      {
        title: "Responsibility Center",
        path: "/responsibilitycenter",
        icon: <LuClipboardCheck />,
        cName: "sub-nav-text",
      },
      {
        title: "Responsibility Group",
        path: "/responsibilitygroup",
        icon: <PiUsersThree />,
        cName: "sub-nav-text",
      },
      {
        title: "Project Type",
        path: "/projecttype",
        icon: <AiOutlineFundProjectionScreen />,
        cName: "sub-nav-text",
      },
      {
        title: "Project Category",
        path: "/projectcategory",
        icon: <MdOutlineCategory />,
        cName: "sub-nav-text",
      },
      {
        title: "Issue",
        path: "/issue",
        icon: <MdSyncProblem />,
        cName: "sub-nav-text",
      },
      {
        title: "Theme",
        path: "/thememaster",
        icon: <PiBlueprintLight />,
        cName: "sub-nav-text",
      },
      {
        title: "Theme Activity",
        path: "/themeactivity",
        icon: <TbActivityHeartbeat />,
        cName: "sub-nav-text",
      },
      {
        title: "Activity Group",
        path: "/activitygroup",
        icon: <HiOutlineUserGroup />,
        cName: "sub-nav-text",
      },
      {
        title: "Object",
        path: "/object",
        icon: <LiaObjectUngroup />,
        cName: "sub-nav-text",
      },
      {
        title: "Object Type",
        path: "/objecttype",
        icon: <VscTypeHierarchy />,
        cName: "sub-nav-text",
      },
    ],
  },
];
