import { useState, lazy, Suspense } from "react";
import { App, Page, Navbar } from "konsta/react";
import TabBar from "./components/TabBar";
import { DummyPage } from "./pages/DummyPage";
import {
  MdBarChart,
  MdSettings,
  MdHomeFilled,
  MdOutlineStar,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import BookListPage from "./pages/BookListPage";
import { BooksProvider } from "./context/BooksContext";
import ModalPage from "./pages/ModalPage";
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
    title: "",
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
  const [modalOpen, setModalOpen] = useState(false);
  const [previousTab, setPreviousTab] = useState<string>("home");

  const handleTabChange = (tabId: string) => {
    if (tabId === "scanner") {
      setPreviousTab(activeTab);
      setModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveTab(previousTab);
  };

  return (
    <App theme="ios" dark={false}>
      <BooksProvider>
        {modalOpen ? (
          <ModalPage onClose={handleCloseModal} />
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
