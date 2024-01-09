import NavTabs from "../NavTabs/NavTabs";

const Main = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-[15px] py-20">
      <h1 className="text-4xl text-center mb-10 font-semibold">
        Technical Task Tracker
      </h1>
      <NavTabs></NavTabs>
    </div>
  );
};

export default Main;
