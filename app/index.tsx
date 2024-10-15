import { SafeAreaView, Text, View, StyleSheet } from "react-native"; // Ensure StyleSheet is imported
import CommentsList from "../components/CommentsList";

export default function Index() {
  const resourceId = '1'; // Change this based on your resource

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      <CommentsList resourceId={resourceId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin:10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});