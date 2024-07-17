import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

import { FaCity } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";

export const SidebarData = [
  {
    title: " Home",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: " Organization",
    path: "/organization",
    icon: <FaIcons.FaWarehouse />,
    cName: "nav-text",
  },
  {
    title: " State",
    path: "/state",
    icon: <IoLocationSharp />,
    cName: "nav-text",
  },
  {
    title: " City",
    path: "/city",
    icon: <FaCity />,
    cName: "nav-text",
  },
];
