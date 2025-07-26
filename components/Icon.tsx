import { TouchableOpacity } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

const IconButton = ({ onPress, icon }: { icon: any; onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <IconSymbol size={23} name={icon} color={"black"} />
    </TouchableOpacity>
  );
};
export default IconButton;
