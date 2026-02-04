import { ReactNode } from "react";
import { CartProvider } from "./cart-context";
import { UserProvider } from "./user-context";

const Context = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
};

export default Context;
