import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Animated } from 'react-native';
import LootCard from './LootCard';
import { RARITY_CONFIG } from '../utils/lootLogic';

function HistoryItem({ item, index, isNew }) {
  const slideAnim = useRef(new Animated.Value(isNew ? -28 : 0)).current;
  const fadeAnim  = useRef(new Animated.Value(isNew ? 0  : 1)).current;

  useEffect(() => {
    if (!isNew) return;
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const config = RARITY_CONFIG[item.rarity];

  return (
    <Animated.View
      style={[
        styles.row,
        { borderLeftColor: config.color },
        { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
      ]}
    >
      <Text style={styles.indexText}>#{index + 1}</Text>
      <LootCard item={item} size="small" />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.rarity, { color: config.color }]}>{config.label}</Text>
      </View>
    </Animated.View>
  );
}

export default function LootHistory({ history }) {
  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin historial aún</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <HistoryItem item={item} index={index} isNew={index === 0} />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#111120',
    borderWidth: 1,
    borderColor: '#1e1e30',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    backgroundColor: '#111120',
  },
  indexText: {
    color: '#444',
    fontSize: 11,
    width: 28,
    textAlign: 'right',
    marginRight: 10,
  },
  info: { marginLeft: 12, flex: 1 },
  name: { color: '#e0e0e0', fontSize: 14, fontWeight: '600' },
  rarity: { fontSize: 12, marginTop: 2 },
  separator: { height: 1, backgroundColor: '#1a1a2a' },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#111120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e1e30',
  },
  emptyText: { color: '#555', fontSize: 14 },
});
