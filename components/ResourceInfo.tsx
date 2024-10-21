// ResourceInfo.tsx
// ResourceInfo.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import ExpandableText from './ExpandableText'; // Ensure the path is correct based on your project structure

interface ResourceInfoProps {
  parentCommentId?: string | null; // Accept parentCommentId as a prop
}

const ResourceInfo: React.FC<ResourceInfoProps> = ({ parentCommentId }) => {
  // Mock data for the resource
  const resource = {
    id: '2',
    header: 'Breakthrough Discovery: Scientists Confirm Evidence of Extraterrestrial Life',
    description: 'A team of international scientists has announced the detection of unmistakable signs of alien life, marking a monumental milestone in human history.',
    content: `
  In an unprecedented scientific achievement, researchers from the Global Astrobiology Institute (GAI) have confirmed the existence of extraterrestrial life forms. The discovery was made using advanced telescopic technology and sophisticated data analysis techniques that detected bio-signatures previously thought to be unattainable.
  
  ...`, // Shortened for brevity
    author: 'Dr. Elena Ramirez',
    images: [
      'https://i.imgur.com/XlxjRBr.jpeg',
      'https://i.imgur.com/5EiGZCJ.jpeg',
      'https://i.imgur.com/tndnH7A.png',
    ],
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Conditional rendering based on parentCommentId */}
        {parentCommentId ? (
          // Show only title and author when in reply mode
          <View>
            <Text style={styles.header}>{resource.header}</Text>
            <Text style={styles.author}>By: {resource.author}</Text>
          </View>
        ) : (
          <>
            {/* Full resource information when not in reply mode */}
            <Text style={styles.header}>{resource.header}</Text>
            <Text style={styles.author}>By: {resource.author}</Text>
            <Text style={styles.description}>{resource.description}</Text>

            {/* Content with ExpandableText */}
            <ExpandableText text={resource.content} style={styles.content} characterLimit={100} />

            {/* Images */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
              {resource.images.slice(0, 3).map((imageUri, index) => (
                <Image key={index} source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
              ))}
            </ScrollView>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.1, // For iOS shadow
    shadowRadius: 4, // For iOS shadow
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  author: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 5,

  },
});

export default ResourceInfo;