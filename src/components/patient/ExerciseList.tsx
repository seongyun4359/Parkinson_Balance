import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import Video from "react-native-video";

interface Exercise {
  id: string;
  title: string;
  video: any;
}

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const openVideoModal = (video: any) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
  };

  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseButton}
            onPress={() => openVideoModal(item.video)}
            onPressIn={() => setActiveIcon(`play-${item.id}`)}
            onPressOut={() => setActiveIcon(null)}
          >
            <Text style={styles.exerciseText}>{item.title}</Text>
            <Icon
              name="play"
              size={18}
              color={activeIcon === `play-${item.id}` ? "#76DABF" : "#333"}
              style={styles.icon}
            />
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
});

export default ExerciseList;
