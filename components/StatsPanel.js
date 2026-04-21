import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { RARITIES, RARITY_CONFIG } from '../utils/lootLogic';

function StatRow({ rarity, count, percentage }) {
  const config = RARITY_CONFIG[rarity];
  const pct = parseFloat(percentage);
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: pct,
      duration: 420,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const barWidth = animWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={styles.rarityLabel}>{config.label}</Text>

      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            { width: barWidth, backgroundColor: config.color },
          ]}
        />
      </View>

      <Text style={styles.countText}>{count}</Text>
      <Text style={[styles.pctText, { color: config.color }]}>{percentage}%</Text>
    </View>
  );
}

export default function StatsPanel({ stats }) {
  return (
    <View style={styles.container}>
      <View style={styles.totalRow}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalValue}>{stats.total}</Text>
          <Text style={styles.totalLabel}>Cofres{'\n'}Abiertos</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.probBlock}>
          <Text style={styles.probTitle}>Probabilidades</Text>
          <Text style={[styles.probLine, { color: RARITY_CONFIG.Common.color }]}>Común · 60%</Text>
          <Text style={[styles.probLine, { color: RARITY_CONFIG.Rare.color }]}>Raro · 30%</Text>
          <Text style={[styles.probLine, { color: RARITY_CONFIG.Epic.color }]}>Épico · 10%</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View>
        {Object.values(RARITIES).map(rarity => (
          <StatRow
            key={rarity}
            rarity={rarity}
            count={stats.counts[rarity]}
            percentage={stats.percentages[rarity]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111120',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e1e30',
  },
  totalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  totalBlock: { alignItems: 'center', flex: 1 },
  totalValue: { color: '#fff', fontSize: 40, fontWeight: 'bold', lineHeight: 44 },
  totalLabel: {
    color: '#666',
    fontSize: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  divider: { width: 1, height: 60, backgroundColor: '#2a2a3a', marginHorizontal: 16 },
  probBlock: { flex: 1 },
  probTitle: {
    color: '#666',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  probLine: { fontSize: 12, marginBottom: 3, fontWeight: '500' },
  separator: { height: 1, backgroundColor: '#1e1e30', marginBottom: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  rarityLabel: { color: '#ccc', fontSize: 13, width: 58 },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#2a2a3a',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  barFill: { height: '100%', borderRadius: 3 },
  countText: { color: '#aaa', fontSize: 12, width: 28, textAlign: 'right', marginRight: 6 },
  pctText: { fontSize: 12, fontWeight: 'bold', width: 48, textAlign: 'right' },
});
