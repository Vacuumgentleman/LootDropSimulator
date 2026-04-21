import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LootCard from './LootCard';
import { RARITY_CONFIG } from '../utils/lootLogic';

const PARTICLE_COUNT = 6;
const PARTICLE_DISTANCE = 72;
const PARTICLE_ANGLES = Array.from(
  { length: PARTICLE_COUNT },
  (_, i) => (i * 360) / PARTICLE_COUNT
);

export default function LootResult({ item, animKey, isOpening }) {
  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const wobbleAnim  = useRef(new Animated.Value(0)).current;
  const glowAnim    = useRef(new Animated.Value(0)).current;
  const glowLoopRef = useRef(null);

  const particleAnims = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Shake when opening starts
  useEffect(() => {
    if (!isOpening) return;
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 65, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 65, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 65, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 65, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4,   duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 40, useNativeDriver: true }),
    ]).start();
  }, [isOpening]);

  // Reveal when new item arrives
  useEffect(() => {
    if (animKey === 0 || !item) return;

    if (glowLoopRef.current) glowLoopRef.current.stop();

    // Reset particles
    particleAnims.forEach(p => {
      p.translateX.setValue(0);
      p.translateY.setValue(0);
      p.opacity.setValue(0);
    });

    // Reset reveal values
    scaleAnim.setValue(0.2);
    opacityAnim.setValue(0);
    wobbleAnim.setValue(-10);
    glowAnim.setValue(0);

    // Spring reveal
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 120, friction: 5, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(wobbleAnim, { toValue: 0, tension: 80,  friction: 4, useNativeDriver: true }),
    ]).start(() => {
      const loopMs = item.rarity === 'Epic' ? 700 : 1300;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1,   duration: loopMs / 2, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.15, duration: loopMs / 2, useNativeDriver: true }),
        ])
      );
      glowLoopRef.current = loop;
      loop.start();
    });

    // Epic particles
    if (item.rarity === 'Epic') {
      const animations = particleAnims.map((p, i) => {
        const rad = (PARTICLE_ANGLES[i] * Math.PI) / 180;
        return Animated.parallel([
          Animated.timing(p.opacity, { toValue: 1, duration: 80, useNativeDriver: true }),
          Animated.timing(p.translateX, {
            toValue: Math.cos(rad) * PARTICLE_DISTANCE,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(p.translateY, {
            toValue: Math.sin(rad) * PARTICLE_DISTANCE,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(150),
            Animated.timing(p.opacity, { toValue: 0, duration: 450, useNativeDriver: true }),
          ]),
        ]);
      });
      Animated.parallel(animations).start();
    }
  }, [animKey]);

  // Cleanup
  useEffect(() => {
    return () => { if (glowLoopRef.current) glowLoopRef.current.stop(); };
  }, []);

  const wobbleRotate = wobbleAnim.interpolate({
    inputRange: [-10, 0, 10],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const config = item ? RARITY_CONFIG[item.rarity] : null;

  return (
    <View style={styles.outerWrapper}>
      {/* Particle layer — always rendered, particles start invisible */}
      <View style={styles.particleLayer} pointerEvents="none">
        {particleAnims.map((p, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.particle,
              {
                color: config ? config.color : '#CE93D8',
                opacity: p.opacity,
                transform: [
                  { translateX: p.translateX },
                  { translateY: p.translateY },
                ],
              },
            ]}
          >
            ◆
          </Animated.Text>
        ))}
      </View>

      {/* Glow ring behind the card */}
      {config && (
        <Animated.View
          style={[styles.glowRing, { borderColor: config.color, opacity: glowAnim }]}
          pointerEvents="none"
        />
      )}

      {/* Main animated card */}
      <Animated.View
        style={[
          styles.container,
          config
            ? { backgroundColor: config.bgColor, borderColor: config.borderColor, shadowColor: config.glowColor }
            : styles.emptyStyle,
          {
            transform: [
              { translateX: shakeAnim },
              { scale: scaleAnim },
              { rotate: wobbleRotate },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        {!item ? (
          <>
            <Text style={styles.emptyEmoji}>🎁</Text>
            <Text style={styles.emptyTitle}>
              {isOpening ? 'Abriendo cofre...' : 'Cofre esperando...'}
            </Text>
            {!isOpening && (
              <Text style={styles.emptySubtitle}>Abre un cofre para ver tu botín</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.label}>✦ ÚLTIMO BOTÍN ✦</Text>
            <LootCard key={animKey} item={item} size="large" />
            <Text style={[styles.itemName, { color: config.color }]}>{item.name}</Text>
            <View style={[styles.badge, { backgroundColor: config.borderColor }]}>
              <Text style={styles.badgeText}>{config.label.toUpperCase()}</Text>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginBottom: 14,
    alignItems: 'center',
  },
  particleLayer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
    fontSize: 13,
    fontWeight: 'bold',
  },
  glowRing: {
    position: 'absolute',
    top: -5, left: -5, right: -5, bottom: -5,
    borderRadius: 23,
    borderWidth: 3,
    zIndex: 0,
  },
  container: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 12,
    zIndex: 1,
  },
  emptyStyle: {
    backgroundColor: '#111120',
    borderColor: '#2a2a3a',
    shadowColor: '#000',
  },
  emptyEmoji: { fontSize: 52, marginBottom: 8 },
  emptyTitle: { color: '#888', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  emptySubtitle: { color: '#555', fontSize: 13 },
  label: { color: '#666', fontSize: 11, letterSpacing: 2, marginBottom: 14 },
  itemName: { fontSize: 22, fontWeight: 'bold', marginTop: 14, textAlign: 'center' },
  badge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 1.5 },
});
