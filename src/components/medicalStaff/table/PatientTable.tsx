import React from "react"
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native"
import { Patient } from "../../../types/patient.ts"
import PatientTableRow from "./PatientTableRow"
import PatientTableHeader from "./PatientTableHeader"
import { SortConfig } from "../../../types/sortConfig.ts"

interface PatientTableProps {
	data: Patient[]
	selectedPatients: Set<string>
	sortConfigs: SortConfig[]
	onToggleSelect: (id: string) => void
	onToggleSelectAll: () => void
	onToggleFavorite: (id: string) => void
	onToggleSort: (key: keyof Patient) => void
}

const PatientTable = ({
	data,
	selectedPatients,
	sortConfigs,
	onToggleSelect,
	onToggleSelectAll,
	onToggleFavorite,
	onToggleSort,
}: PatientTableProps) => {
	return (
		<View style={styles.container}>
			<PatientTableHeader
				selectedCount={selectedPatients.size}
				totalCount={data.length}
				onToggleSelectAll={onToggleSelectAll}
				onToggleSort={onToggleSort}
			/>
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<PatientTableRow
						patient={item}
						isSelected={selectedPatients.has(item.id)}
						onToggleSelect={() => onToggleSelect(item.id)}
						onToggleFavorite={() => onToggleFavorite(item.id)}
					/>
				)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})

export default PatientTable
