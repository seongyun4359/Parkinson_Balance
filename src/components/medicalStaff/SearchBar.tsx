import React from "react"
import {
	View,
	TextInput,
	TouchableOpacity,
	Text,
	StyleSheet,
} from "react-native"
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
		<View style={styles.searchContainer}>
			<View style={styles.inputWrapper}>
				<Ionicons
					name="search"
					size={20}
					color="#666"
					style={styles.searchIcon}
				/>
				<TextInput
					style={styles.searchInput}
					placeholder="환자 이름 검색"
					value={value}
					onChangeText={onChangeText}
					placeholderTextColor="#aaa"
				/>
			</View>
			<TouchableOpacity style={styles.searchButton} onPress={onSearch}>
				<Text style={styles.searchButtonText}>검색</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		marginBottom: 20,
		gap: 10,
	},
	inputWrapper: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 12,
		backgroundColor: "#f8f8f8",
	},
	searchIcon: {
		paddingLeft: 12,
	},
	searchInput: {
		flex: 1,
		height: 50,
		paddingHorizontal: 10,
		fontSize: 16,
	},
	searchButton: {
		backgroundColor: "#76DABF",
		paddingHorizontal: 24,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	searchButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
})

export default SearchBar
