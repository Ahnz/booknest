import { useState } from "react";
import { App } from "konsta/react";
import BookList from "./pages/BookList";
import TabBar from "./components/TabBar";

const AppComponent = () => {
  const [activeTab, setActiveTab] = useState("tab-1");

  const renderPage = () => {
    switch (activeTab) {
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
