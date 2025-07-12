import { useState, lazy, Suspense } from "react";
import { App, Page, Navbar } from "konsta/react";
import TabBar from "./components/TabBar";
import { DummyPage } from "./pages/DummyPage";
import {
  MdMenuBook,
  MdFavorite,
  MdBarChart,
  MdSettings,
  MdHomeFilled,
  MdOutlineStar,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import BookListPage from "./pages/BookListPage";
import { BooksProvider } from "./context/BooksContext";
import ScannerPage from "./pages/ScannerPage";

const BookList = lazy(() => import("./pages/BookListPage"));

const tabs = [
  {
    id: "home",
    title: "Home",
    icon: MdHomeFilled,
    component: <BookListPage />,
  },
  {
    id: "favorites",
    title: "Wishlist",
    icon: MdOutlineStar,
    component: <DummyPage title="Favorites" />,
  },
  {
    id: "scanner",
    title: "Scanner",
    icon: MdOutlineDocumentScanner,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: MdBarChart,
    component: <DummyPage title="Statistics" />,
  },
  {
    id: "settings",
    title: "Settings",
    icon: MdSettings,
    component: <DummyPage title="Settings" />,
  },
];

const AppComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showScanner, setShowScanner] = useState(false);
  const [previousTab, setPreviousTab] = useState<string>("home");

  const handleTabChange = (tabId: string) => {
    // Remember last tab and open scanner
    if (tabId === "scanner") {
      setPreviousTab(activeTab);
      setShowScanner(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setActiveTab(previousTab);
  };

  return (
    <App theme="ios" dark={false}>
      <BooksProvider>
        {showScanner ? (
          <ScannerPage onClose={handleCloseScanner} />
        ) : (
          <>
            <Page>
              <Navbar title={activeTab} transparent large />
              <Suspense fallback={<div>Loading...</div>}>
                {tabs
                  .filter((tab) => tab.id !== "scanner")
                  .map((tab) => (
                    <div
                      key={tab.id}
                      style={{
                        display: activeTab === tab.id ? "block" : "none",
                      }}
                      className="overflow-visible"
                    >
                      {tab.component}
                    </div>
                  ))}
              </Suspense>
            </Page>
            <TabBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </>
        )}
      </BooksProvider>
    </App>
  );
};

export default AppComponent;
