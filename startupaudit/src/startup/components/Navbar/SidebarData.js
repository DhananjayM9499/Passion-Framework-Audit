import React from "react";
import { GoOrganization, GoDatabase, GoTasklist } from "react-icons/go";
import { SiThealgorithms } from "react-icons/si";
import { AiOutlineAudit, AiOutlineHome } from "react-icons/ai";
import { RiGovernmentLine } from "react-icons/ri";
import { LiaExternalLinkSquareAltSolid } from "react-icons/lia";
import { PiAirTrafficControl, PiUsersThree } from "react-icons/pi";
import { GrResources } from "react-icons/gr";
import { IoWarningOutline, IoHardwareChipOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import { BiLeaf } from "react-icons/bi";
import { LuClipboardCheck } from "react-icons/lu";
import { TbListDetails } from "react-icons/tb";
import { MdOutlineChecklist } from "react-icons/md";
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
    title: "Algorithm Inventory",
    path: "/algorithminventory",
    icon: <SiThealgorithms />,
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
        path: "/framework",
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
        path: "/control",
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
        title: "Resources",
        path: "/resources",
        icon: <GrResources />,
        cName: "sub-nav-text",
      },
      {
        title: "Issue",
        path: "/issue",
        icon: <MdOutlineChecklist />,
        cName: "sub-nav-text",
      },
      {
        title: "Dataset",
        path: "/dataset",
        icon: <GoDatabase />,
        cName: "sub-nav-text",
      },
      {
        title: "Theme Activity",
        path: "/themeactivity",
        icon: <GoTasklist />,
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
    ],
  },
];
