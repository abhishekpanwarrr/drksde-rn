import { useUser } from "@/context/user-context";
import { apiRequest } from "@/utils/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "login" | "register";

export default function Login() {
  const router = useRouter();
  const { dispatch } = useUser();

  const [mode, setMode] = useState<Mode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const body = isLogin ? { email, password } : { name, email, password };

      const res = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      // ✅ Save user + token
      dispatch({
        type: "LOGIN",
        user: res.data,
        token: res.token,
      });

      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      {/* Title */}
      <Text className="text-3xl font-bold mb-2 text-center">
        {isLogin ? "Welcome Back" : "Create Account"}
      </Text>

      <Text className="text-gray-500 mb-8 text-center">
        {isLogin ? "Login to continue" : "Register to get started"}
      </Text>

      {/* Name (Register only) */}
      {!isLogin && (
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        />
      )}

      {/* Email */}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      {/* Password */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />

      {/* Error */}
      {error && <Text className="text-red-500 text-sm mb-3 text-center">{error}</Text>}

      {/* Submit */}
      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        className="bg-black py-4 rounded-xl items-center"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold">
            {isLogin ? "Login" : "Register"}
          </Text>
        )}
      </Pressable>

      {/* Toggle */}
      <Pressable onPress={() => setMode(isLogin ? "register" : "login")} className="mt-6">
        <Text className="text-center text-gray-500">
          {isLogin ? "Don’t have an account? " : "Already have an account? "}
          <Text className="text-black font-semibold">{isLogin ? "Register" : "Login"}</Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
