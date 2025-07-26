import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

const Button = ({
  onPress,
  loading,
  text,
  styles,
}: {
  text: String;
  onPress: () => void;
  loading: boolean;
  styles: string;
}) => {
  const [Bloading, setBLoading] = useState<Boolean>(loading);

  return (
    <TouchableOpacity className={styles} onPress={onPress} disabled={loading}>
      <Text className="text-lg font-semibold text-center text-white">
        {loading ? "Loading..." : text}
      </Text>
    </TouchableOpacity>
  );
};
export default Button;
