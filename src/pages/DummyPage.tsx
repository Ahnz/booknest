import { Page, Navbar, Block } from "konsta/react";

interface DummyPageProps {
  title: string;
}

const DummyPage: React.FC<DummyPageProps> = ({ title }) => {
  return (
    <div className="bg-gray-100">
      <Block strong inset>
        <p>
          This is a placeholder for the {title} page. Add {title.toLowerCase()}{" "}
          options here.
        </p>
      </Block>
    </div>
  );
};

export { DummyPage };
