import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatINR } from '../utils/formatCurrency';

interface Props {
  icon: string;
  name: string;
  color: string;
  total: number;
  maxTotal: number;
  percentage: number;
}

export function CategoryBar({ icon, name, color, total, maxTotal, percentage }: Props) {
  const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={[styles.amount, { color }]}>
          {formatINR(total)}
        </Text>
      </View>

      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${barWidth}%` as any, backgroundColor: color }
          ]}
        />
      </View>

      <Text style={styles.pct}>{percentage.toFixed(1)}% of total</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#22222F',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  name: { fontSize: 12, color: '#E2E2F0', fontFamily: 'monospace' },
  amount: { fontSize: 13, fontWeight: '500', fontFamily: 'monospace' },
  barBg: {
    height: 4,
    backgroundColor: '#22222F',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 2 },
  pct: {
    fontSize: 9,
    color: '#55556A',
    marginTop: 6,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});