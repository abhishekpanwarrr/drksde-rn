import { Drawer } from "expo-router/drawer";

const HomeLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerType: "back",
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "DRKSDE",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "DRKSDE",
        }}
      />
    </Drawer>
  );
};

export default HomeLayout;
