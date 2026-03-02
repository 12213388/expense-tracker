import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Expense } from '../types';
import { CATEGORIES } from '../constants/categories';
import { formatINR } from '../utils/formatCurrency';
 
interface Props {
  expense: Expense;
  onDelete: (id: string) => void;
}
 
export function ExpenseCard({ expense, onDelete }: Props) {
  const cat = CATEGORIES.find(c => c.name === expense.category) ?? CATEGORIES[6];
  const dateObj = new Date(expense.date);
  const dateStr = dateObj.toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
 
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: cat.color + '25' }]}>
        <Text style={styles.icon}>{cat.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{expense.title}</Text>
        <Text style={styles.meta}>{expense.category.toUpperCase()} · {dateStr}</Text>
      </View>
      <Text style={[styles.amount, { color: cat.color }]}>
        −{formatINR(expense.amount)}
      </Text>
      <TouchableOpacity onPress={() => onDelete(expense.id)} style={styles.del}>
        <Text style={styles.delText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  row:    { flexDirection:'row', alignItems:'center', padding:12,
            borderBottomWidth:1, borderBottomColor:'#1A1A2E' },
  iconBox:{ width:40, height:40, borderRadius:10, alignItems:'center',
            justifyContent:'center', marginRight:12 },
  icon:   { fontSize:20 },
  info:   { flex:1 },
  title:  { fontSize:14, color:'#DDD', fontFamily:'monospace' },
  meta:   { fontSize:10, color:'#555', marginTop:2, fontFamily:'monospace' },
  amount: { fontSize:14, fontFamily:'monospace', marginRight:10 },
  del:    { padding:6 },
  delText:{ color:'#444', fontSize:14 },
});

