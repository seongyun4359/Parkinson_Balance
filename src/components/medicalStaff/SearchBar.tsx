import React from "react"
import { View, TextInput, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

interface SearchBarProps {
	value: string
	onChangeText: (text: string) => void
	onSearch: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
	value,
	onChangeText,
	onSearch,
}) => {
	return (
		<View style={styles.container}>
			<Ionicons name="search" size={24} color="#888" style={styles.icon} />
			<TextInput
				style={styles.input}
				placeholder="검색어를 입력하세요"
				value={value}
				onChangeText={onChangeText}
				placeholderTextColor="#aaa"
				returnKeyType="search"
				onSubmitEditing={onSearch} // 엔터 키 입력 시 검색
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	icon: {
		marginRight: 8,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
})

export default SearchBar
