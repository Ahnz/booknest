import { useState, lazy, Suspense } from "react";
import { App } from "konsta/react";
import TabBar from "./components/TabBar";
import { DummyPage } from "./pages/DummyPage";
import { IconType } from "react-icons";
import {
  MdMenuBook,
  MdFavorite,
  MdSearch,
  MdBarChart,
  MdSettings,
  MdHomeFilled,
  MdStarRate,
  MdOutlineFavorite,
  MdOutlineStar,
  MdQrCodeScanner,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import BookListPage from "./pages/BookListPage";
import SearchPage from "./pages/SearchPage";
import { BooksProvider } from "./context/BooksContext";
import { Navbar } from "konsta/react";
import { Page } from "konsta/react";

// Lazy load BookList
const BookList = lazy(() => import("./pages/BookListPage"));

interface Tab {
  id: string;
  title: string;
  icon: IconType;
  component: React.ReactNode;
}

// Centralized tab configuration
const tabs: Tab[] = [
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
    component: <SearchPage />,
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

  return (
    <App theme="ios" dark={false}>
      <Page>
        <Navbar title={activeTab} transparent large />
        <Suspense fallback={<div>Loading...</div>}>
          <BooksProvider>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                style={{ display: activeTab === tab.id ? "block" : "none" }}
                className="overflow-visible"
              >
                {tab.component}
              </div>
            ))}
          </BooksProvider>
        </Suspense>
      </Page>
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </App>
  );
};

export default AppComponent;
