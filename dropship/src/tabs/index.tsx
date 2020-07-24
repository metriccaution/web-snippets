import { h, FunctionalComponent } from "preact";
import "./index.scss";

export interface TabsProps {
  active: string;
  tabs: string[];
  onTabChange: (tabName: string) => void;
}

const Tabs: FunctionalComponent<TabsProps> = ({
  tabs,
  active,
  onTabChange,
}: TabsProps) => {
  return (
    <div class="tab-bar">
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          text={tab}
          active={tab === active}
          select={(): void => onTabChange(tab)}
        />
      ))}
    </div>
  );
};

interface TabProps {
  active: boolean;
  text: string;
  select: () => void;
}

const Tab: FunctionalComponent<TabProps> = ({
  text,
  active,
  select,
}: TabProps) => (
  <button class={`tab ${active ? "active" : ""}`} onClick={select}>
    {text}
  </button>
);

export default Tabs;
