import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Expense } from '../types';
import { CATEGORIES, MONTHS } from '../constants/categories';
import { formatINR } from '../utils/formatCurrency';

interface Props { expenses: Expense[]; }

const { width } = Dimensions.get('window');

export function AnalyticsScreen({ expenses }: Props) {
  const now = new Date();

  // Last 6 months data
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const total = expenses
        .filter(e => {
          const ed = new Date(e.date);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        })
        .reduce((s, e) => s + e.amount, 0);
      months.push({ label: MONTHS[d.getMonth()], total });
    }
    return months;
  }, [expenses]);

  const maxMonth = Math.max(...monthlyData.map(m => m.total), 1);

  // Category totals
  const catTotals = useMemo(() =>
    CATEGORIES.map(c => ({
      ...c,
      total: expenses.filter(e => e.category === c.name).reduce((s, e) => s + e.amount, 0),
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total),
  [expenses]);

  const grand = catTotals.reduce((s, c) => s + c.total, 0) || 1;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <Text style={styles.pageTitle}>ANALYTICS</Text>

        {/* Monthly Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MONTHLY SPEND — LAST 6 MONTHS</Text>
          <View style={styles.barChart}>
            {monthlyData.map((m, i) => (
              <View key={i} style={styles.barCol}>
                <Text style={styles.barVal}>
                  {m.total > 0 ? (m.total >= 1000 ? `${(m.total/1000).toFixed(1)}k` : String(m.total)) : ''}
                </Text>
                <View style={styles.barWrapper}>
                  <View style={[
                    styles.barRect,
                    {
                      height: m.total > 0 ? (m.total / maxMonth) * 100 : 4,
                      backgroundColor: m.total > 0 ? '#FFE566' : '#22222F',
                      opacity: 0.4 + (m.total / maxMonth) * 0.6,
                    }
                  ]} />
                </View>
                <Text style={styles.barLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CATEGORY DISTRIBUTION</Text>
          {catTotals.length === 0 ? (
            <Text style={styles.emptyText}>No data yet</Text>
          ) : (
            catTotals.map(c => (
              <View key={c.name} style={styles.distRow}>
                <View style={styles.distLeft}>
                  <Text style={styles.distIcon}>{c.icon}</Text>
                  <Text style={styles.distName}>{c.name}</Text>
                </View>
                <View style={styles.distRight}>
                  <Text style={[styles.distAmt, { color: c.color }]}>{formatINR(c.total)}</Text>
                  <Text style={styles.distPct}>{((c.total / grand) * 100).toFixed(0)}%</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Top Categories Full Bar */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>TOP CATEGORIES</Text>
          {catTotals.map(c => (
            <View key={c.name} style={styles.topCatRow}>
              <View style={styles.topCatHeader}>
                <View style={styles.distLeft}>
                  <Text style={styles.distIcon}>{c.icon}</Text>
                  <Text style={styles.distName}>{c.name}</Text>
                </View>
                <Text style={[styles.distAmt, { color: c.color }]}>{formatINR(c.total)}</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${(c.total/grand)*100}%` as any, backgroundColor: c.color }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#09090E' },
  container: { flex: 1, paddingHorizontal: 16 },
  pageTitle: { fontSize: 9, letterSpacing: 3, color: '#55556A', marginVertical: 16 },
  card: {
    backgroundColor: '#111118', borderWidth: 1,
    borderColor: '#22222F', borderRadius: 12,
    padding: 18, marginBottom: 14,
  },
  cardTitle: { fontSize: 9, letterSpacing: 3, color: '#55556A', marginBottom: 16 },

  // Bar chart
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: 6 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barWrapper: { flex: 1, justifyContent: 'flex-end', width: '100%' },
  barRect: { width: '100%', borderRadius: 3, minHeight: 4 },
  barVal: { fontSize: 8, color: '#E2E2F0' },
  barLabel: { fontSize: 9, color: '#55556A' },

  // Distribution
  distRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#1A1A26',
  },
  distLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distIcon: { fontSize: 18 },
  distName: { fontSize: 12, color: '#E2E2F0', fontFamily: 'monospace' },
  distRight: { alignItems: 'flex-end' },
  distAmt: { fontSize: 13, fontWeight: '500', fontFamily: 'monospace' },
  distPct: { fontSize: 10, color: '#55556A', marginTop: 2 },

  // Top cats
  topCatRow: { marginBottom: 14 },
  topCatHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  barBg: { height: 4, backgroundColor: '#22222F', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },

  emptyText: { fontSize: 12, color: '#55556A', textAlign: 'center', paddingVertical: 20 },
});