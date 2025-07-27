import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import { getNameIntial } from "./TopNavBar";
import { IconSymbol } from "./ui/IconSymbol";

export const Profiles = () => {
  const { profiles, currentProfile, setCurrentProfile } = useAuth();
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  return (
    <SafeAreaView>
      {!showAddUserForm ? (
        <View className="p-5 flex flex-col gap-3 ">
          <Text className="text-3xl text-[#0d9447]">Profiles</Text>

          {profiles.length > 0 &&
            profiles.map((profile) => (
              <View
                key={profile.id}
                className="flex flex-col items-center justify-center mb-4"
              >
                <TouchableOpacity
                  key={profile.id}
                  onPress={() => {
                    setCurrentProfile(profile);
                  }}
                  className={`p-5  flex justify-center items-center rounded-full h-40 w-40 mb-2 ${
                    currentProfile?.id === profile.id
                      ? "bg-green-300"
                      : "bg-gray-200"
                  }`}
                >
                  <Text className="text-3xl">
                    {getNameIntial(profile.name)}
                  </Text>
                </TouchableOpacity>
                <Text className="text-lg  font-semibold ml-4">
                  {profile.name} {}
                  <Text className=" text-sm text-gray-500">
                    {profile.subscription_type === 1
                      ? "Free"
                      : profile.subscription_type === 2
                        ? "Premium"
                        : "Unknown"}
                  </Text>
                </Text>
              </View>
            ))}
          <SetupProfile
            setShowAddUserForm={() => {
              setShowAddUserForm(true);
            }}
          />
        </View>
      ) : (
        <AddUserForm></AddUserForm>
      )}
    </SafeAreaView>
  );
};

const SetupProfile = ({
  setShowAddUserForm,
}: {
  setShowAddUserForm: () => void;
}) => {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={setShowAddUserForm}>
        <View className="flex-1 items-center justify-center">
          <View className=" h-40 w-40 rounded-full bg-gray-300 flex justify-center items-center">
            <IconSymbol size={28} color={"white"} name={"plus"}></IconSymbol>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default function AddUserForm({
  setAsAddUserForm,
}: {
  setAsAddUserForm?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email }]);

    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "User added!");
      setName("");
      setEmail("");
    }
  };

  return (
    <View className="p-5">
      <Text className="text-lg font-bold mb-2 text-center text-blue-700">
        Add New User
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        onPress={handleAddUser}
        className="bg-blue-600 p-3 rounded-md"
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Adding..." : "Add User"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
