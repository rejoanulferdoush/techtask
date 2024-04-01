const NavTabs = ({ summaryTab, setSummarytTab, dataTab, setDataTab }) => {
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
      <ul className="flex justify-center items-center space-x-3">
        <li
          className={`text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150 ${
            summaryTab
              ? "bg-green-500 text-white"
              : "hover:bg-green-500 hover:text-white"
          }`}
          onClick={() => {
            handleSummaryTab();
          }}
        >
          All Task Summary Charts
        </li>
        <li
          className={`text-xl uppercase px-4 py-2 shadow-sm border-2 rounded-md border-green-500 cursor-pointer transition-all duration-150 ${
            dataTab
              ? "bg-green-500 text-white"
              : "hover:bg-green-500 hover:text-white"
          }`}
          onClick={() => {
            handleDataTab();
          }}
        >
          Task Data
        </li>
      </ul>
    </div>
  );
};

export default NavTabs;
