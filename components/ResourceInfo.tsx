// ResourceInfo.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import ExpandableText from './ExpandableText'; // Ensure the path is correct based on your project structure

interface ResourceInfoProps {
  // If you plan to make it dynamic in the future, you can pass resourceId as a prop
}

const ResourceInfo: React.FC<ResourceInfoProps> = () => {
  // Mock data for the resource
  const resource = {
    id: '2',
    header: 'Breakthrough Discovery: Scientists Confirm Evidence of Extraterrestrial Life',
    description: 'A team of international scientists has announced the detection of unmistakable signs of alien life, marking a monumental milestone in human history.',
    content: `
  In an unprecedented scientific achievement, researchers from the Global Astrobiology Institute (GAI) have confirmed the existence of extraterrestrial life forms. The discovery was made using advanced telescopic technology and sophisticated data analysis techniques that detected bio-signatures previously thought to be unattainable.
  
  The evidence was gathered from a distant exoplanet located within the habitable zone of its star system, approximately 150 light-years from Earth. The team identified complex organic molecules in the planet’s atmosphere, along with unusual light patterns that suggest the presence of intelligent life. These findings were corroborated by multiple independent observatories, ensuring the reliability of the data.
  
  Dr. Emily Zhang, the lead scientist on the project, stated, "This discovery fundamentally changes our understanding of life in the universe. The organic compounds we've detected are consistent with the metabolic processes of a technologically advanced civilization." The scientific community has lauded the breakthrough, emphasizing its potential to answer one of humanity’s most profound questions: Are we alone in the universe?
  
  The implications of this discovery extend beyond pure science. It opens up possibilities for future interstellar communication and collaboration, challenging us to rethink our place in the cosmos. As researchers continue to analyze the data, plans are underway for sending exploratory missions to gather more detailed information about the newly discovered life forms.
  
  This monumental announcement has sparked excitement and curiosity worldwide, reigniting the age-old fascination with the unknown and setting the stage for a new era of space exploration and discovery.
    `,
    author: 'Dr. Elena Ramirez',
    images: [
      'https://i.imgur.com/XlxjRBr.jpeg',
      'https://i.imgur.com/5EiGZCJ.jpeg',
      'https://i.imgur.com/tndnH7A.png',
      // Add more URLs if needed, but only the first three will be displayed
    ],
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header */}
        <Text style={styles.header}>{resource.header}</Text>
        
        {/* Author */}
        <Text style={styles.author}>By: {resource.author}</Text>

        {/* Description */}
        <Text style={styles.description}>{resource.description}</Text>

        {/* Content with ExpandableText */}
        <ExpandableText
          text={resource.content}
          style={styles.content}
          characterLimit={200}
        />

        {/* Images */}
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
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default ResourceInfo;