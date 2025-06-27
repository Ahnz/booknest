import { useState, lazy, Suspense } from "react";
import { App } from "konsta/react";
import TabBar from "./components/TabBar";
import { DummyPage } from "./pages/DummyPage";

// Lazy load BookList to improve initial load performance
const BookList = lazy(() => import("./pages/BookList"));

interface Tab {
  id: string;
  title: string;
  component: React.ReactNode;
}

const tabs: Tab[] = [
  { id: "tab-1", title: "Home", component: <BookList /> },
  { id: "tab-2", title: "Settings", component: <DummyPage title="Settings" /> },
  { id: "tab-3", title: "Search", component: <DummyPage title="Search" /> },
  { id: "tab-4", title: "Account", component: <DummyPage title="Account" /> },
];

const AppComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("tab-1");

  return (
    <App theme="ios" dark={false}>
      <Suspense fallback={<div>Loading...</div>}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{ display: activeTab === tab.id ? "block" : "none" }}
          >
            {tab.component}
          </div>
        ))}
      </Suspense>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </App>
  );
};

export default AppComponent;
