import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet, Image, ScrollView } from 'react-native';
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
      
      ...
    `,
    author: 'Dr. Elena Ramirez',
    images: [
      'https://i.imgur.com/XlxjRBr.jpeg',
      'https://i.imgur.com/5EiGZCJ.jpeg',
      'https://i.imgur.com/tndnH7A.png',
    ],
  };

  // Animation value
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity

  // Start the fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 300, // Duration of the fade
      useNativeDriver: true, // Use native driver for performance
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Conditional Rendering Based on parentCommentId */}
          {parentCommentId ? (
            <>
              <Text style={styles.header}>{resource.header}</Text>
              <Text style={styles.author}>By: {resource.author}</Text>
            </>
          ) : (
            <>
              {/* Full Resource Info Display */}
              <Text style={styles.header}>{resource.header}</Text>
              <Text style={styles.author}>By: {resource.author}</Text>
              <Text style={styles.description}>{resource.description}</Text>
              <ExpandableText
                text={resource.content}
                style={styles.content}
                characterLimit={100}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                {resource.images.slice(0, 3).map((imageUri, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </>
          )}
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    maxWidth:800,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
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