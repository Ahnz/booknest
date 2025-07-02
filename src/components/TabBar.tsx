import { Tabbar, TabbarLink, Icon } from "konsta/react";
import { IconType } from "react-icons";
import { MdBarChart } from "react-icons/md";

interface Tab {
  id: string;
  title: string;
  icon: IconType;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  const isLabels: boolean = true;
  const isIcons: boolean = true;

  return (
    <Tabbar labels={isLabels} icons={isIcons} className="left-0 bottom-0 fixed" innerClassName="overflow-visible">
      {tabs.map((tab, index) => {
        const isScannerTab = tab.id === "scanner";
        return (
          <TabbarLink
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            label={isLabels && !isScannerTab ? tab.title : undefined}
            icon={
              isIcons &&
              (isScannerTab ? (
                <span className="bg-ios-light-surface border-4 border-ios-light-surface-2 rounded-full -mt-5 p-4">
                  <tab.icon className="w-6 h-6" />
                </span>
              ) : (
                <tab.icon className="w-7 h-7" />
              ))
            }
          />
        );
      })}
    </Tabbar>
  );
};

export default TabBar;
