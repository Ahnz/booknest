import { Tabbar, TabbarLink, Icon } from "konsta/react";
import { IconType } from "react-icons";

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
  const isLabels: boolean = false;
  const isIcons: boolean = true;

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
          {isLabels && <span>{tab.title}</span>}
        </TabbarLink>
      ))}
    </Tabbar>
  );
};

export default TabBar;
