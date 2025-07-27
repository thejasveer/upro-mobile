import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import { getNameIntial } from "./TopNavBar";
import { IconSymbol } from "./ui/IconSymbol";

export const Profiles = () => {
  const { profiles, currentProfile, setCurrentProfile, refreshProfiles } =
    useAuth();
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const handleProfileCreated = async () => {
    await refreshProfiles(); // Refresh the profiles list to show the newly created profile
    setShowAddUserForm(false); // Go back to profiles list
  };

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
        <AddUserForm
          onProfileCreated={handleProfileCreated}
          onBack={() => setShowAddUserForm(false)}
        />
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
  onProfileCreated,
  onBack,
}: {
  setAsAddUserForm?: () => void;
  onProfileCreated?: () => void;
  onBack?: () => void;
}) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dominantFoot, setDominantFoot] = useState("");
  const [playingPosition, setPlayingPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const { account } = useAuth();

  const handleAddUser = async () => {
    if (!name || !gender || !ageGroup) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!account) {
      Alert.alert("Error", "No account found");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from("users").insert([
      {
        name,
        account_id: account.id,
        gender,
        age_group: parseInt(ageGroup),
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        dominant_foot:
          dominantFoot === "right"
            ? true
            : dominantFoot === "left"
              ? false
              : null,
        playing_position: playingPosition || null,
      },
    ]);

    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Profile created successfully!");
      setName("");
      setGender("");
      setAgeGroup("");
      setWeight("");
      setHeight("");
      setDominantFoot("");
      setPlayingPosition("");
      if (onProfileCreated) {
        onProfileCreated();
      }
    }
  };

  return (
    <View className="p-5">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={onBack} className="p-2">
          <Text className="text-blue-600 text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-center text-blue-700 flex-1">
          Create New Profile
        </Text>
        <View className="w-12" />
      </View>

      <TextInput
        placeholder="Name *"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
      />

      <TextInput
        placeholder="Gender (Male/Female/Other) *"
        value={gender}
        onChangeText={setGender}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
      />

      <TextInput
        placeholder="Age Group (e.g., 18) *"
        value={ageGroup}
        onChangeText={setAgeGroup}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Dominant Foot (left/right)"
        value={dominantFoot}
        onChangeText={setDominantFoot}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
      />

      <TextInput
        placeholder="Playing Position"
        value={playingPosition}
        onChangeText={setPlayingPosition}
        className="border border-gray-300 p-3 rounded-md mb-3 bg-white"
      />

      <TouchableOpacity
        onPress={handleAddUser}
        className="bg-blue-600 p-3 rounded-md"
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Creating..." : "Create Profile"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
