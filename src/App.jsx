import { useState } from "react";
import { App } from "konsta/react";
import TabBar from "./components/TabBar";
import BookList from "./pages/BookList";
import Statistics from "./pages/Statistics";
import OnlineSearch from "./pages/OnlineSearch";
import Settings from "./pages/Settings";

const AppComponent = () => {
  const [activeTab, setActiveTab] = useState("tab-1");

  const renderPage = () => {
    switch (activeTab) {
      case "tab-1":
        return <BookList />;
      case "tab-2":
        return <Statistics />;
      case "tab-3":
        return <OnlineSearch />;
      case "tab-4":
        return <Settings />;
      default:
        return <BookList />;
    }
  };

  return (
    <App theme="ios" dark={false}>
      {renderPage()}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </App>
  );
};

export default AppComponent;
