import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import { useTheme } from "@react-navigation/native";
import { getNameIntial } from "./TopNavBar";

export const Profiles = () => {
  const { profiles, currentProfile, setCurrentProfile, refreshProfiles } =
    useAuth();
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const { colors } = useTheme();

  const handleProfileCreated = async () => {
    await refreshProfiles(); // Refresh the profiles list to show the newly created profile
    setShowAddUserForm(false); // Go back to profiles list
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {!showAddUserForm ? (
        <ScrollView className="flex-1">
          <View className="p-6 pb-20">
            <Text
              className="text-3xl font-bold mb-8 text-center"
              style={{ color: colors.text }}
            >
              Select Profile
            </Text>

            <View className="flex-col gap-6">
              {profiles.length > 0 &&
                profiles.map((profile) => (
                  <TouchableOpacity
                    key={profile.id}
                    onPress={() => {
                      setCurrentProfile(profile);
                    }}
                    className={`p-6 rounded-2xl flex-row items-center ${
                      currentProfile?.id === profile.id ? "bg-green-100" : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentProfile?.id === profile.id
                          ? "#dcfce7"
                          : colors.card,
                      borderWidth: currentProfile?.id === profile.id ? 2 : 1,
                      borderColor:
                        currentProfile?.id === profile.id
                          ? "#16a34a"
                          : colors.border || "#e5e7eb",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <View
                      className={`h-16 w-16 rounded-full mr-4 flex justify-center items-center ${
                        currentProfile?.id === profile.id
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      <Text className="text-white text-xl font-bold">
                        {getNameIntial(profile.name)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-lg font-semibold"
                        style={{ color: colors.text }}
                      >
                        {profile.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {profile.subscription_type === 1
                          ? "Free Plan"
                          : profile.subscription_type === 2
                            ? "Premium Plan"
                            : "Unknown Plan"}
                      </Text>
                    </View>
                    {currentProfile?.id === profile.id && (
                      <View className="h-6 w-6 rounded-full bg-green-500 flex justify-center items-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}

              <TouchableOpacity
                onPress={() => setShowAddUserForm(true)}
                className="p-6 rounded-2xl border-2 border-dashed border-gray-300 flex-row items-center justify-center"
                style={{
                  backgroundColor: colors.card,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="h-16 w-16 rounded-full bg-gray-200 mr-4 flex justify-center items-center">
                  <Text className="text-gray-600 text-2xl">+</Text>
                </View>
                <Text
                  className="text-lg font-medium"
                  style={{ color: colors.text }}
                >
                  Create New Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <AddUserForm
          onProfileCreated={handleProfileCreated}
          onBack={() => setShowAddUserForm(false)}
        />
      )}
    </SafeAreaView>
  );
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
  isButton = false,
  onPress,
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: "default" | "numeric";
  isButton?: boolean;
  onPress?: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold" style={{ color: colors.text }}>
        {label}
      </Text>
      {isButton ? (
        <TouchableOpacity
          onPress={onPress}
          className={`p-4 rounded-xl border ${error ? "border-red-500" : "border-gray-200"}`}
          style={{
            backgroundColor: colors.card,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Text
            className={value ? "text-gray-800" : "text-gray-400"}
            style={{ color: value ? colors.text : "#9ca3af" }}
          >
            {value || placeholder}
          </Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          className={`p-4 rounded-xl border ${error ? "border-red-500" : "border-gray-200"}`}
          style={{
            backgroundColor: colors.card,
            color: colors.text,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "numeric" ? "none" : "words"}
          autoCorrect={false}
          returnKeyType="done"
          blurOnSubmit={true}
        />
      )}
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { account } = useAuth();
  const { colors } = useTheme();

  const genderOptions = ["Male", "Female", "Other"];
  const footOptions = ["Right", "Left"];
  const positionOptions = ["Forward", "Midfielder", "Defender", "Goalkeeper"];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!ageGroup) {
      newErrors.ageGroup = "Age is required";
    } else {
      const age = parseInt(ageGroup);
      if (isNaN(age) || age < 5 || age > 100) {
        newErrors.ageGroup = "Age must be between 5 and 100";
      }
    }

    if (
      weight &&
      (isNaN(parseFloat(weight)) ||
        parseFloat(weight) < 20 ||
        parseFloat(weight) > 200)
    ) {
      newErrors.weight = "Weight must be between 20 and 200 kg";
    }

    if (
      height &&
      (isNaN(parseFloat(height)) ||
        parseFloat(height) < 100 ||
        parseFloat(height) > 250)
    ) {
      newErrors.height = "Height must be between 100 and 250 cm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showGenderActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", ...genderOptions],
          cancelButtonIndex: 0,
          title: "Select Gender",
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setGender(genderOptions[buttonIndex - 1]);
            setErrors((prev) => ({ ...prev, gender: "" }));
          }
        }
      );
    } else {
      Alert.alert(
        "Select Gender",
        "",
        genderOptions
          .map((option) => ({
            text: option,
            onPress: () => {
              setGender(option);
              setErrors((prev) => ({ ...prev, gender: "" }));
            },
          }))
          .concat([{ text: "Cancel", onPress: () => {} }])
      );
    }
  };

  const showFootActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", ...footOptions],
          cancelButtonIndex: 0,
          title: "Select Dominant Foot",
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setDominantFoot(footOptions[buttonIndex - 1]);
          }
        }
      );
    } else {
      Alert.alert(
        "Select Dominant Foot",
        "",
        footOptions
          .map((option) => ({
            text: option,
            onPress: () => setDominantFoot(option),
          }))
          .concat([{ text: "Cancel", onPress: () => {} }])
      );
    }
  };

  const showPositionActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", ...positionOptions],
          cancelButtonIndex: 0,
          title: "Select Playing Position",
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setPlayingPosition(positionOptions[buttonIndex - 1]);
          }
        }
      );
    } else {
      Alert.alert(
        "Select Playing Position",
        "",
        positionOptions
          .map((option) => ({
            text: option,
            onPress: () => setPlayingPosition(option),
          }))
          .concat([{ text: "Cancel", onPress: () => {} }])
      );
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleAgeChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setAgeGroup(numericText);
    if (errors.ageGroup) {
      setErrors((prev) => ({ ...prev, ageGroup: "" }));
    }
  };

  const handleWeightChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, "");
    setWeight(numericText);
    if (errors.weight) {
      setErrors((prev) => ({ ...prev, weight: "" }));
    }
  };

  const handleHeightChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, "");
    setHeight(numericText);
    if (errors.height) {
      setErrors((prev) => ({ ...prev, height: "" }));
    }
  };

  const handleAddUser = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fix the errors below");
      return;
    }

    if (!account) {
      Alert.alert("Error", "No account found");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from("users").insert([
      {
        name: name.trim(),
        account_id: account.id,
        gender: gender.toLowerCase(),
        age_group: parseInt(ageGroup),
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        dominant_foot:
          dominantFoot === "Right"
            ? true
            : dominantFoot === "Left"
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
      setErrors({});
      if (onProfileCreated) {
        onProfileCreated();
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="p-6 border-b"
          style={{
            backgroundColor: colors.card,
            borderBottomColor: colors.border || "#e5e7eb",
          }}
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
              <Text className="text-green-600 text-lg font-medium">← Back</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Create New Profile
            </Text>
            <View className="w-16" />
          </View>
        </View>

        {/* Form */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 pb-20">
            <InputField
              label="Full Name *"
              value={name}
              onChangeText={handleNameChange}
              placeholder="Enter full name"
              error={errors.name}
            />

            <InputField
              label="Gender *"
              value={gender}
              placeholder="Select gender"
              error={errors.gender}
              isButton={true}
              onPress={showGenderActionSheet}
            />

            <InputField
              label="Age *"
              value={ageGroup}
              onChangeText={handleAgeChange}
              placeholder="Enter age (5-100)"
              error={errors.ageGroup}
              keyboardType="numeric"
            />

            <InputField
              label="Weight (kg)"
              value={weight}
              onChangeText={handleWeightChange}
              placeholder="Enter weight (optional)"
              error={errors.weight}
              keyboardType="numeric"
            />

            <InputField
              label="Height (cm)"
              value={height}
              onChangeText={handleHeightChange}
              placeholder="Enter height (optional)"
              error={errors.height}
              keyboardType="numeric"
            />

            <InputField
              label="Dominant Foot"
              value={dominantFoot}
              placeholder="Select dominant foot"
              isButton={true}
              onPress={showFootActionSheet}
            />

            <InputField
              label="Playing Position"
              value={playingPosition}
              placeholder="Select position"
              isButton={true}
              onPress={showPositionActionSheet}
            />

            <TouchableOpacity
              onPress={handleAddUser}
              className={`p-4 rounded-xl mt-6 ${loading ? "opacity-70" : ""}`}
              style={{
                backgroundColor: "#16a34a",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? "Creating Profile..." : "Create Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
