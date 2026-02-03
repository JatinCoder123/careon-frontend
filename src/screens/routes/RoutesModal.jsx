import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RoutesModal({
  visible,
  routes,
  onSelectRoute,
  onClose,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Choose a Route</Text>

          {routes.map((route, index) => (
            <TouchableOpacity
              key={index}
              style={styles.routeItem}
              onPress={() => onSelectRoute(index)}
            >
              <Text>Route {index + 1}</Text>
              <Text>
                {route.legs[0].distance.text} •{" "}
                {route.legs[0].duration.text}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.allBtn}
            onPress={() => onSelectRoute(null)}
          >
            <Text>Show All Routes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ marginTop: 10 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  routeItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  allBtn: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },
});
