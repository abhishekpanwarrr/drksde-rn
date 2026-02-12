import { ReactNode } from "react";
import { CartProvider } from "./cart-context";
import { UserProvider } from "./user-context";
import { BiometricProvider } from "@/context/biometric-context";

const Context = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <BiometricProvider>
        <CartProvider>{children}</CartProvider>
      </BiometricProvider>
    </UserProvider>
  );
};

export default Context;
