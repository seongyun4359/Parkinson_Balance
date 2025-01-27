import React from "react"
import {
	View,
	TextInput,
	TouchableOpacity,
	Text,
	StyleSheet,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Icon from "react-native-vector-icons/MaterialIcons"

interface SearchBarProps {
	value: string
	onChangeText: (text: string) => void
	onSearch: () => void
	placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
	value,
	onChangeText,
	onSearch,
	placeholder,
}) => {
	return (
		<View style={styles.container}>
			<Icon name="search" size={24} color="#666" />
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
			/>
			{value.length > 0 && (
				<TouchableOpacity onPress={() => onChangeText("")}>
					<Icon name="close" size={24} color="#666" />
				</TouchableOpacity>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		padding: 8,
		marginBottom: 16,
	},
	input: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
	},
})

export default SearchBar
