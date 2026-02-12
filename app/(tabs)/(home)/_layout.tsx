import { Drawer } from "expo-router/drawer";
import { Pressable } from "react-native";
import { UserAvatar } from "./settings";
import { useUser } from "@/context/user-context";
import { useRouter } from "expo-router";

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
          headerRight: () => <HeaderRight />,
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

function HeaderRight() {
  const {
    state: { user },
  } = useUser();
  const router = useRouter();
  return (
    <Pressable className="mr-2" onPress={() => router.push("/settings")}>
      {user && <UserAvatar name={user?.name} avatar={user?.avatar} size={30} />}
    </Pressable>
  );
}
