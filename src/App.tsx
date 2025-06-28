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
} from "react-icons/md";
import BookListPage from "./pages/BookListPage";
import SearchPage from "./pages/SearchPage";

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
    id: "my_books",
    title: "My Books",
    icon: MdHomeFilled,
    component: <BookListPage />,
  },
  {
    id: "search",
    title: "Search",
    icon: MdSearch,
    component: <SearchPage />,
  },
  {
    id: "favorites",
    title: "Favorites",
    icon: MdOutlineStar,
    component: <DummyPage title="Favorites" />,
  },
  {
    id: "statistics",
    title: "Statistics",
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
  const [activeTab, setActiveTab] = useState<string>("my_books");

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
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </App>
  );
};

export default AppComponent;
