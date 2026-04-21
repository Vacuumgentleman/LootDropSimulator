import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const SIZE_CONFIG = {
  large:  { box: 100, emoji: 42, radius: 20, border: 3 },
  medium: { box: 72,  emoji: 30, radius: 14, border: 2 },
  small:  { box: 54,  emoji: 22, radius: 10, border: 2 },
};

export default function LootCard({ item, size = 'medium' }) {
  const { visualConfig } = item;
  const s = SIZE_CONFIG[size] || SIZE_CONFIG.medium;

  const scaleAnim      = useRef(new Animated.Value(0)).current;
  const rotateAnim     = useRef(new Animated.Value(0)).current;
  const glowOpacity    = useRef(new Animated.Value(0)).current;
  const loopRef        = useRef(null);

  useEffect(() => {
    const isEpic = item.rarity === 'Epic';

    // Scale spring entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 80,
      friction: 6,
      useNativeDriver: true,
    }).start(() => {
      // Start glow pulse after entrance
      const loopMs = isEpic ? 600 : 1100;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.65, duration: loopMs / 2, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.05, duration: loopMs / 2, useNativeDriver: true }),
        ])
      );
      loopRef.current = loop;
      loop.start();
    });

    // Full spin for Epic
    if (isEpic) {
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }).start();
    }

    return () => { if (loopRef.current) loopRef.current.stop(); };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowSize   = s.box + 10;
  const glowRadius = s.radius + 5;

  return (
    <View style={{ width: glowSize, height: glowSize, alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow layer behind card */}
      <Animated.View
        style={{
          position: 'absolute',
          width: glowSize,
          height: glowSize,
          borderRadius: glowRadius,
          backgroundColor: visualConfig.glowColor,
          opacity: glowOpacity,
        }}
      />

      {/* Card */}
      <Animated.View
        style={[
          styles.container,
          {
            width: s.box,
            height: s.box,
            borderRadius: s.radius,
            borderWidth: s.border,
            backgroundColor: visualConfig.bgColor,
            borderColor: visualConfig.borderColor,
            shadowColor: visualConfig.glowColor,
            transform: [
              { scale: scaleAnim },
              { rotate: item.rarity === 'Epic' ? spin : '0deg' },
            ],
          },
        ]}
      >
        <Text style={{ fontSize: s.emoji, lineHeight: s.box, textAlign: 'center' }}>
          {visualConfig.emoji}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
});
