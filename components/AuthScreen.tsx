import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

type AuthMode = "signin" | "signup";

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (mode === "signup" && (!firstName || !lastName)) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, firstName, lastName);
        Alert.alert("Success", "Check your email for the confirmation link!");
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert("Success", "Check your email for the reset link!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center px-6 bg-gray-50"
    >
      <SafeAreaView>
        <View className="p-8 rounded-lg">
          <Text className="mb-8 text-3xl font-bold text-center text-gray-800">
            {mode === "signin" ? "Welcome" : "Create Account"}
          </Text>
          <View
            className="flex justify-center items-center"
            style={{ height: 150 }}
          >
            <Image
              source={require("../assets/images/logo.png")}
              className="h-full w-48"
              resizeMode="contain"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700">Email</Text>
            <TextInput
              className="px-4 py-3 text-gray-800 rounded-lg border border-gray-300"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {mode === "signup" && (
            <>
              <View className="mb-6">
                <Text className="mb-2 font-medium text-gray-700">
                  First Name
                </Text>
                <TextInput
                  className="px-4 py-3 text-gray-800 rounded-lg border border-gray-300"
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View className="mb-6">
                <Text className="mb-2 font-medium text-gray-700">
                  Last Name
                </Text>
                <TextInput
                  className="px-4 py-3 text-gray-800 rounded-lg border border-gray-300"
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </>
          )}

          <View className="mb-6">
            <Text className="mb-2 font-medium text-gray-700">Password</Text>
            <TextInput
              className="px-4 py-3 text-gray-800 rounded-lg border border-gray-300"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            className={`py-4 rounded-lg mb-4 ${
              loading ? "bg-green-700" : "bg-green-600"
            }`}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text className="text-lg font-semibold text-center text-white">
              {loading
                ? "Loading..."
                : mode === "signin"
                  ? "Sign In"
                  : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 mb-4"
            onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            <Text className="font-medium text-center text-blue-600">
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>

          {mode === "signin" && (
            <TouchableOpacity className="py-2" onPress={handleResetPassword}>
              <Text className="text-center text-gray-600">
                Forgot your password?
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
