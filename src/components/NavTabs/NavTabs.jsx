import { useState } from "react";
import PublicDataTab from "../PublicDataTab/PublicDataTab";
import PublicSummaryTab from "../PublicSummaryTab/PublicSummaryTab";

const NavTabs = () => {
  const [summaryTab, setSummarytTab] = useState(true);
  const [dataTab, setDataTab] = useState(false);

  const handleSummaryTab = () => {
    setSummarytTab(true);
    setDataTab(false);
  };

  const handleDataTab = () => {
    setSummarytTab(false);
    setDataTab(true);
  };

  return (
    <div>
      <ul className="flex justify-center items-center space-x-3 mb-10">
        <li
          className={`text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 ${
            summaryTab
              ? "bg-sky-500 text-white"
              : "hover:bg-sky-500 hover:text-white"
          }`}
          onClick={() => {
            handleSummaryTab();
          }}
        >
          All Task Summary Charts
        </li>
        <li
          className={`text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-sky-500 cursor-pointer transition-all duration-150 ${
            dataTab
              ? "bg-sky-500 text-white"
              : "hover:bg-sky-500 hover:text-white"
          }`}
          onClick={() => {
            handleDataTab();
          }}
        >
          Task Data
        </li>
      </ul>
      {summaryTab ? <PublicSummaryTab /> : <PublicDataTab />}
    </div>
  );
};

export default NavTabs;
