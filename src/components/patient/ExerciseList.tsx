import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IonIcon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import Video from "react-native-video";

interface Exercise {
  id: string;
  title: string;
  video: any;
  definition?: string;
  method?: string;
  effect?: string;
}

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const openVideoModal = (video: any) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
  };

  const openInfoModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setInfoModalVisible(true);
  };

  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.exerciseButton}>
            <Text style={styles.exerciseText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => openVideoModal(item.video)}
                onPressIn={() => setActiveIcon(`play-${item.id}`)}
                onPressOut={() => setActiveIcon(null)}
              >
                <Icon
                  name="play"
                  size={18}
                  color={activeIcon === `play-${item.id}` ? "#76DABF" : "#333"}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openInfoModal(item)}
                onPressIn={() => setActiveIcon(`info-${item.id}`)}
                onPressOut={() => setActiveIcon(null)}
              >
                <IonIcon
                  name="information-circle-outline"
                  size={22}
                  color={activeIcon === `info-${item.id}` ? "#76DABF" : "#333"}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal isVisible={isVideoModalVisible} onBackdropPress={() => setVideoModalVisible(false)}>
        <View style={styles.modalContainer}>
          {selectedVideo && (
            <Video source={selectedVideo} style={styles.video} controls resizeMode="contain" />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setVideoModalVisible(false)}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isInfoModalVisible} onBackdropPress={() => setInfoModalVisible(false)}>
        <View style={styles.infoModalContainer}>
          {selectedExercise && (
            <>
              <Text style={styles.modalTitle}>{selectedExercise.title}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>정의</Text>
                <Text style={styles.infoText}>{selectedExercise.definition || "정보 없음"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>방법</Text>
                <Text style={styles.infoText}>{selectedExercise.method || "정보 없음"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>효능</Text>
                <Text style={styles.infoText}>{selectedExercise.effect || "정보 없음"}</Text>
              </View>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => {
                  openVideoModal(selectedExercise.video);
                  setInfoModalVisible(false);
                }}
              >
                <Text style={styles.playButtonText}>재생</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100,
    paddingTop: 30,
  },
  exerciseButton: {
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
  modalContainer: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  video: {
    width: 300,
    height: 200,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  infoModalContainer: {
    backgroundColor: "#F9F9F9",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    width: 60,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  playButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    elevation: 2,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ExerciseList;
