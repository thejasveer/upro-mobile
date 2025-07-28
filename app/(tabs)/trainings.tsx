import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useTrainings } from "@/hooks/useTrainings";

export interface TrainingInterface {
	id: number;
	title: string;
	description: string;
	experience_reward: number;
	duration_minutes: number;
	subscription_type_id: number;
}

export default function TrainingsScreen() {
	const router = useRouter();
	const { trainings, getTrainings } = useTrainings();
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [activeTab, setActiveTab] = useState<"Training" | "Exercise">("Training");

	useEffect(() => {
		getTrainings();
	}, []);

	// section definitions
	const sections = [
		{ title: "Warm Up", data: trainings?.filter((t) => t.duration_minutes < 15) || [] },
		{ title: "15 mins", data: trainings?.filter((t) => t.duration_minutes === 15) || [] },
		{ title: "Drill", data: trainings?.filter((t) => t.duration_minutes > 15) || [] },
	];

	// color palette for options (mix of green with teal/yellow)
	const optionColors = ["bg-green-200", "bg-teal-200", "bg-yellow-200", "bg-green-300", "bg-teal-300"];

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="p-5">
				{/* Tabs */}
				<View className="flex-row mb-4">
					{["Training", "Exercise"].map((tab) => (
						<TouchableOpacity
							key={tab}
							onPress={() => setActiveTab(tab as any)}
							className={`flex-1 py-2 mr-2 rounded-md items-center ${activeTab === tab ? "bg-green-500" : "bg-gray-200"}`}
						>
							<Text className={`${activeTab === tab ? "text-white" : "text-black"}`}>{tab}</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Search Bar */}
				<View className="mb-4">
					<TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="search" placeholderTextColor="brown" className="bg-gray-100 rounded-md px-4 py-2" />
				</View>
			</View>

			{/* Sections - vertical scroll */}
			<ScrollView className="px-5" showsVerticalScrollIndicator={false}>
				{sections.map((section) => (
					<View key={section.title} className="mb-6">
						{/* Header */}
						<View className="flex-row justify-between items-center mb-2">
							<Text className="text-xl font-semibold">{section.title}</Text>

							{section.data.length > 0 && (
								<TouchableOpacity
									onPress={() => {
                    router.push("/trainings/view-more");
									}}
								>
									<Text className="text-blue-500">View More</Text>
								</TouchableOpacity>
							)}
						</View>

						{/* Options - horizontal linear with colorful backgrounds */}
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View className="flex-row">
								{section.data.length === 0 && (
									<View className="py-8 px-4">
										<Text className="text-gray-500">No trainings available.</Text>
									</View>
								)}

								{section.data.map((item, idx) => {
									const bgClass = optionColors[idx % optionColors.length];

									return (
										<TouchableOpacity
											key={item.id}
											onPress={() => router.push(`/trainings/single/${item.id}`)}
											className={`${bgClass} w-40 mr-4 aspect-square rounded-md items-center justify-center`}
										>
											<Text className="text-center px-2">{item.title}</Text>
										</TouchableOpacity>
									);
								})}
							</View>
						</ScrollView>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}
