import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const STAR = require('../../assets/icons/star.png');
const STAR_OUTLINE = require('../../assets/icons/star-outline.png');

type Props = { rating?: number; max?: number };

export default function StarRating({ rating = 4, max = 5 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => (
        <Image
          key={i}
          source={i < rating ? STAR : STAR_OUTLINE}
          style={[styles.star, i === 0 ? undefined : styles.starAfter]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  star: { width: 16, height: 16, resizeMode: 'contain' },
  starAfter: { marginLeft: 2 },
});
