import { useState } from "react";
import NavTabs from "../NavTabs/NavTabs";
import PublicSummaryTab from "../PublicSummaryTab/PublicSummaryTab";
import PublicDataTab from "../PublicDataTab/PublicDataTab";

const Main = () => {
  const [summaryTab, setSummarytTab] = useState(true);
  const [dataTab, setDataTab] = useState(false);

  return (
    <div className="max-w-screen-xl mx-auto px-[15px]">
      <div className="py-10 flex justify-between -mx-[15px] items-center mb-10 ">
        <h1 className="text-4xl text-center font-semibold uppercase logo-font">
          Tech Ops Task Tracker
        </h1>
        <NavTabs
          summaryTab={summaryTab}
          dataTab={dataTab}
          setSummarytTab={setSummarytTab}
          setDataTab={setDataTab}
        ></NavTabs>
      </div>
      {summaryTab ? <PublicSummaryTab /> : <PublicDataTab />}
    </div>
  );
};

export default Main;
