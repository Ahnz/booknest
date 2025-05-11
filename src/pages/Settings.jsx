import { Page, Navbar, Block } from "konsta/react";

const Settings = () => {
  return (
    <Page className="bg-gray-100">
      <Navbar title="Settings" />
      <Block strong inset>
        <p>This is a placeholder for the Settings page. Add settings options here.</p>
      </Block>
    </Page>
  );
};

export default Settings;
