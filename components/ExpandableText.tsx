// ExpandableText.tsx
import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';

interface ExpandableTextProps {
  text: string;
  style?: TextStyle;
  characterLimit?: number; // Character limit before truncation
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  style,
  characterLimit = 200,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  const shouldShowToggle = text.length > characterLimit;
  const displayText = isExpanded ? text : text.slice(0, characterLimit) + (text.length > characterLimit ? '...' : '');

  return (
    <>
      <Text style={[styles.text, style]}>
        {displayText}
      </Text>
      {shouldShowToggle && (
        <TouchableOpacity onPress={toggleExpansion}>
          <Text style={styles.toggleText}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  toggleText: {
    color: '#6200ee',
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ExpandableText;