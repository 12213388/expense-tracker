import React, { useMemo } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Expense } from '../types';
import { CATEGORIES, MONTHS } from '../constants/categories';
import { formatINR, formatDate } from '../utils/formatCurrency';
import { CategoryBar } from '../components/CategoryBar';
import { ExpenseCard } from '../components/ExpenseCard';

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function DashboardScreen({ expenses, onDelete, onAdd }: Props) {
  const now = new Date();

  const thisMonthExpenses = useMemo(() =>
    expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    }), [expenses]);

  const totalAll   = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalMonth = useMemo(() => thisMonthExpenses.reduce((s, e) => s + e.amount, 0), [thisMonthExpenses]);
  const avgPerTx   = expenses.length ? totalAll / expenses.length : 0;

  const catTotals = useMemo(() =>
    CATEGORIES.map(cat => ({
      ...cat,
      total: expenses.filter(e => e.category === cat.name)
                     .reduce((s, e) => s + e.amount, 0),
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total),
  [expenses]);

  const maxCat = catTotals[0]?.total || 1;

  const recent = useMemo(() =>
    [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
  [expenses]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>METABORONG · PORTFOLIO</Text>
            <Text style={styles.wordmark}>money.log</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addBtnText}>+ ADD</Text>
          </TouchableOpacity>
        </View>

        {/* Stat Cards */}
        <View style={styles.cardsRow}>
          <View style={[styles.card, styles.cardAccent]}>
            <Text style={styles.cardLabel}>THIS MONTH</Text>
            <Text style={[styles.cardVal, { color: '#FFE566' }]}>
              {formatINR(totalMonth)}
            </Text>
            <Text style={styles.cardSub}>{thisMonthExpenses.length} transactions</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>ALL TIME</Text>
            <Text style={[styles.cardVal, { color: '#E2E2F0' }]}>
              {formatINR(totalAll)}
            </Text>
            <Text style={styles.cardSub}>{expenses.length} transactions</Text>
          </View>
        </View>

        <View style={styles.cardFull}>
          <Text style={styles.cardLabel}>AVERAGE / ENTRY</Text>
          <Text style={[styles.cardVal, { color: '#4ECDC4' }]}>
            {formatINR(avgPerTx)}
          </Text>
          <Text style={styles.cardSub}>per transaction</Text>
        </View>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>CATEGORY BREAKDOWN</Text>
        {catTotals.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No data yet.</Text>
            <TouchableOpacity onPress={onAdd}>
              <Text style={styles.emptyLink}>Add your first expense →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          catTotals.map(cat => (
            <CategoryBar
              key={cat.name}
              icon={cat.icon}
              name={cat.name}
              color={cat.color}
              total={cat.total}
              maxTotal={maxCat}
              percentage={(cat.total / totalAll) * 100}
            />
          ))
        )}

        {/* Recent */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>RECENT ACTIVITY</Text>
        {recent.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions yet.</Text>
          </View>
        ) : (
          recent.map(e => (
            <ExpenseCard key={e.id} expense={e} onDelete={onDelete} />
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#09090E' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: '#22222F',
    marginBottom: 16,
  },
  eyebrow: { fontSize: 9, letterSpacing: 3, color: '#FFE566', marginBottom: 4 },
  wordmark: { fontSize: 22, color: '#E2E2F0', fontStyle: 'italic', fontFamily: 'serif' },
  addBtn: {
    backgroundColor: '#FFE566', paddingHorizontal: 16,
    paddingVertical: 9, borderRadius: 4,
  },
  addBtnText: { fontSize: 11, fontWeight: '700', color: '#09090E', letterSpacing: 2 },
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  card: {
    flex: 1, backgroundColor: '#111118',
    borderWidth: 1, borderColor: '#22222F',
    borderRadius: 10, padding: 16,
  },
  cardAccent: { borderColor: 'rgba(255,229,102,0.2)', backgroundColor: 'rgba(255,229,102,0.05)' },
  cardFull: {
    backgroundColor: '#111118', borderWidth: 1,
    borderColor: '#22222F', borderRadius: 10,
    padding: 16, marginBottom: 20,
  },
  cardLabel: { fontSize: 9, letterSpacing: 3, color: '#55556A', marginBottom: 8 },
  cardVal: { fontSize: 26, fontWeight: '300', fontFamily: 'serif' },
  cardSub: { fontSize: 10, color: '#55556A', marginTop: 4 },
  sectionTitle: {
    fontSize: 9, letterSpacing: 3,
    color: '#55556A', marginBottom: 12,
  },
  empty: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { fontSize: 12, color: '#55556A', fontFamily: 'monospace' },
  emptyLink: { fontSize: 12, color: '#FFE566', marginTop: 6 },
});