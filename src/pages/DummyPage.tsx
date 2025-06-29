import { Page, Navbar, Block } from "konsta/react";

interface DummyPageProps {
  title: string;
}

const DummyPage: React.FC<DummyPageProps> = ({ title }) => {
  return (
    <Page className="bg-gray-100">
      <Navbar title={title} />
      <Block strong inset>
        <p>
          This is a placeholder for the {title} page. Add {title.toLowerCase()}{" "}
          options here.
        </p>
      </Block>
    </Page>
  );
};

export { DummyPage };
