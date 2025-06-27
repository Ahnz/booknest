import { Tabbar, TabbarLink, Icon } from "konsta/react";
import { MdMenuBook, MdBarChart, MdSearch, MdSettings } from "react-icons/md";
import { IconType } from "react-icons";

interface Tab {
  id: string;
  label: string;
  icon: IconType;
}

interface TabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const isLabels: boolean = false;
  const isIcons: boolean = true;

  const tabs: Tab[] = [
    { id: "tab-1", label: "Book List", icon: MdMenuBook },
    { id: "tab-2", label: "Statistics", icon: MdBarChart },
    { id: "tab-3", label: "Online Search", icon: MdSearch },
    { id: "tab-4", label: "Settings", icon: MdSettings },
  ];

  return (
    <Tabbar labels={isLabels} icons={isIcons} className="left-0 bottom-0 fixed">
      {tabs.map((tab) => (
        <TabbarLink
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {isIcons && (
            <Icon
              ios={<tab.icon className="w-7 h-7" />}
              material={<tab.icon className="w-6 h-6" />}
            />
          )}
          {isLabels && <span>{tab.label}</span>}
        </TabbarLink>
      ))}
    </Tabbar>
  );
};

export default TabBar;
