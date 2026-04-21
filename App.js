import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';

import LootResult from './components/LootResult';
import LootHistory from './components/LootHistory';
import StatsPanel from './components/StatsPanel';
import { openLootBoxes, validateInput } from './utils/lootLogic';

const HISTORY_LIMIT = 20;

const INITIAL_STATS = {
  total: 0,
  counts: { Common: 0, Rare: 0, Epic: 0 },
  percentages: { Common: '0.0', Rare: '0.0', Epic: '0.0' },
};

export default function App() {
  const [history, setHistory] = useState([]);
  const [lastItem, setLastItem] = useState(null);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [inputValue, setInputValue] = useState('1');
  const [inputError, setInputError] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const handleOpenChest = useCallback(() => {
    const validation = validateInput(inputValue);
    if (!validation.valid) {
      setInputError(validation.error);
      return;
    }
    setInputError('');
    setIsOpening(true);

    Animated.sequence([
      Animated.timing(buttonScaleAnim, { toValue: 0.91, duration: 80, useNativeDriver: true }),
      Animated.spring(buttonScaleAnim, { toValue: 1, tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();

    const amount = validation.value;

    setTimeout(() => {
      const newItems = openLootBoxes(amount);
      const latestItem = newItems[newItems.length - 1];

      setLastItem(latestItem);
      setAnimKey(k => k + 1);
      setHistory(prev => [...newItems].reverse().concat(prev).slice(0, HISTORY_LIMIT));
      setStats(prev => {
        const newTotal = prev.total + newItems.length;
        const newCounts = { ...prev.counts };
        newItems.forEach(item => { newCounts[item.rarity]++; });
        const newPercentages = {};
        Object.keys(newCounts).forEach(rarity => {
          newPercentages[rarity] = newTotal > 0
            ? ((newCounts[rarity] / newTotal) * 100).toFixed(1)
            : '0.0';
        });
        return { total: newTotal, counts: newCounts, percentages: newPercentages };
      });
      setIsOpening(false);
    }, 360);
  }, [inputValue]);

  const handleReset = useCallback(() => {
    setHistory([]);
    setLastItem(null);
    setStats(INITIAL_STATS);
    setInputValue('1');
    setInputError('');
    setAnimKey(0);
    setIsOpening(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a18" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🎲</Text>
          <Text style={styles.title}>Loot Drop</Text>
          <Text style={styles.subtitle}>S I M U L A T O R</Text>
        </View>

        <LootResult item={lastItem} animKey={animKey} isOpening={isOpening} />

        <View style={styles.controlsCard}>
          <Text style={styles.controlsLabel}>CANTIDAD DE COFRES</Text>
          <TextInput
            style={[styles.input, inputError ? styles.inputErr : null]}
            value={inputValue}
            onChangeText={v => { setInputValue(v); setInputError(''); }}
            keyboardType="numeric"
            maxLength={3}
            placeholder="1"
            placeholderTextColor="#444"
            selectTextOnFocus
          />
          {inputError ? <Text style={styles.errorText}>{inputError}</Text> : null}

          <View style={styles.btnRow}>
            <Animated.View style={[styles.openBtnWrapper, { transform: [{ scale: buttonScaleAnim }] }]}>
              <TouchableOpacity
                style={[styles.openBtn, isOpening && styles.openBtnDisabled]}
                onPress={handleOpenChest}
                disabled={isOpening}
                activeOpacity={0.9}
              >
                <Text style={styles.openBtnEmoji}>{isOpening ? '⏳' : '🎁'}</Text>
                <Text style={styles.openBtnText}>{isOpening ? 'Abriendo...' : 'Abrir Cofre'}</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleReset}
              activeOpacity={0.75}
            >
              <Text style={styles.resetBtnText}>↺  Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊  Estadísticas</Text>
          <StatsPanel stats={stats} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📜  Historial{history.length > 0 ? `  (${history.length})` : ''}
          </Text>
          <LootHistory history={history} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a18' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  header: { alignItems: 'center', paddingVertical: 28 },
  headerIcon: { fontSize: 56, marginBottom: 6 },
  title: { fontSize: 34, fontWeight: 'bold', color: '#f0f0f0', letterSpacing: 3 },
  subtitle: { fontSize: 13, color: '#9C27B0', letterSpacing: 5, marginTop: 4 },
  controlsCard: {
    backgroundColor: '#111120',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e1e30',
  },
  controlsLabel: { color: '#555', fontSize: 11, letterSpacing: 1.5, marginBottom: 8 },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2e2e50',
    color: '#f0f0f0',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    marginBottom: 4,
  },
  inputErr: { borderColor: '#EF5350' },
  errorText: { color: '#EF5350', fontSize: 12, marginBottom: 6, textAlign: 'center' },
  btnRow: { flexDirection: 'row', marginTop: 10 },
  openBtnWrapper: { flex: 1, marginRight: 10 },
  openBtn: {
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  openBtnDisabled: { backgroundColor: '#3d1060', shadowOpacity: 0.2 },
  openBtnEmoji: { fontSize: 20, marginRight: 8 },
  openBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  resetBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2e2e50',
  },
  resetBtnText: { color: '#888', fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 14 },
  sectionTitle: {
    color: '#777',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
});
