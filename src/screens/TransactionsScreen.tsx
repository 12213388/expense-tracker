import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Expense } from '../types';
import { CATEGORIES } from '../constants/categories';
import { formatINR } from '../utils/formatCurrency';
import { ExpenseCard } from '../components/ExpenseCard';

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function TransactionsScreen({ expenses, onDelete, onAdd }: Props) {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() =>
    filter === 'All' ? expenses : expenses.filter(e => e.category === filter),
  [expenses, filter]);

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [filtered]);

  const total = sorted.reduce((s, e) => s + e.amount, 0);

  return (
    <SafeAreaView style={styles.safe}>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {['All', ...CATEGORIES.map(c => c.name)].map(cat => {
          const catObj = CATEGORIES.find(c => c.name === cat);
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setFilter(cat)}
              style={[styles.pill, filter === cat && styles.pillActive]}
            >
              <Text style={[styles.pillText, filter === cat && styles.pillTextActive]}>
                {cat === 'All' ? 'ALL' : `${catObj?.icon} ${cat}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
        <Text style={styles.addBtnText}>+ NEW ENTRY</Text>
      </TouchableOpacity>

      {/* List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {sorted.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions found.</Text>
            <TouchableOpacity onPress={onAdd}>
              <Text style={styles.emptyLink}>Add one →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sorted.map(e => (
            <ExpenseCard key={e.id} expense={e} onDelete={onDelete} />
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Total */}
      {sorted.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>{sorted.length} TRANSACTIONS</Text>
          <Text style={styles.footerVal}>{formatINR(total)}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#09090E' },
  filterScroll: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: '#22222F' },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 6, borderWidth: 1,
    borderColor: '#22222F', backgroundColor: '#111118',
  },
  pillActive: { borderColor: 'rgba(255,229,102,0.4)', backgroundColor: 'rgba(255,229,102,0.08)' },
  pillText: { fontSize: 10, color: '#55556A', fontFamily: 'monospace', letterSpacing: 1 },
  pillTextActive: { color: '#FFE566' },
  addBtn: {
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    backgroundColor: '#FFE566', padding: 12,
    borderRadius: 6, alignItems: 'center',
  },
  addBtnText: { fontSize: 11, fontWeight: '700', color: '#09090E', letterSpacing: 2 },
  list: { flex: 1, paddingHorizontal: 16, marginTop: 8 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 12, color: '#55556A', fontFamily: 'monospace' },
  emptyLink: { fontSize: 12, color: '#FFE566', marginTop: 8 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderTopWidth: 1, borderTopColor: '#22222F',
    backgroundColor: '#111118',
  },
  footerLabel: { fontSize: 10, letterSpacing: 2, color: '#55556A', fontFamily: 'monospace' },
  footerVal: { fontSize: 20, color: '#FFE566', fontFamily: 'serif', fontWeight: '300' },
});