import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { CATEGORIES } from './src/constants/categories';
import { Expense } from './src/types';

const Tab = createBottomTabNavigator();
const STORAGE_KEY = 'moneylog_rn_v1';

const SAMPLE_DATA: Expense[] = (() => {
  const y = new Date().getFullYear();
  const m = String(new Date().getMonth() + 1).padStart(2, '0');
  const pm = String(new Date().getMonth()).padStart(2, '0');
  return [
    { id:'1', title:'Swiggy Order',     amount:320,  category:'Food',          date:`${y}-${m}-01` },
    { id:'2', title:'Metro Card',        amount:200,  category:'Transport',     date:`${y}-${m}-02` },
    { id:'3', title:'Amazon Purchase',   amount:1499, category:'Shopping',      date:`${y}-${m}-03` },
    { id:'4', title:'Netflix',           amount:649,  category:'Entertainment', date:`${y}-${m}-05` },
    { id:'5', title:'Electricity Bill',  amount:1200, category:'Bills',         date:`${y}-${m}-07` },
    { id:'6', title:'Pharmacy',          amount:480,  category:'Health',        date:`${y}-${m}-09` },
    { id:'7', title:'Zomato',            amount:410,  category:'Food',          date:`${y}-${m}-11` },
    { id:'8', title:'Bus Pass',          amount:300,  category:'Transport',     date:`${y}-${pm}-15` },
    { id:'9', title:'Spotify',           amount:119,  category:'Entertainment', date:`${y}-${pm}-18` },
    { id:'10',title:'Grocery Run',       amount:860,  category:'Food',          date:`${y}-${pm}-20` },
  ];
})();

export default function App() {
  const [expenses, setExpenses]     = useState<Expense[]>([]);
  const [modalVisible, setModal]    = useState(false);
  const [selCat, setSelCat]         = useState('Food');
  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Load saved data on startup
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setExpenses(JSON.parse(data));
      else setExpenses(SAMPLE_DATA);
    });
  }, []);

  // Save whenever expenses change
  useEffect(() => {
    if (expenses.length > 0)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  function openModal() {
    setForm({ title:'', amount:'', date: new Date().toISOString().split('T')[0] });
    setSelCat('Food');
    setModal(true);
  }

  function addExpense() {
    if (!form.title.trim()) { Alert.alert('Missing', 'Please enter a description'); return; }
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) { Alert.alert('Missing', 'Please enter a valid amount'); return; }
    if (!form.date) { Alert.alert('Missing', 'Please pick a date'); return; }

    const newExp: Expense = {
      id: Date.now().toString(),
      title: form.title.trim(),
      amount: amt,
      category: selCat,
      date: form.date,
    };
    setExpenses(prev => [...prev, newExp]);
    setModal(false);
  }

  function deleteExpense(id: string) {
    Alert.alert('Delete', 'Remove this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () =>
        setExpenses(prev => prev.filter(e => e.id !== id))
      },
    ]);
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#09090E',
            borderTopColor: '#22222F',
            borderTopWidth: 1,
            paddingBottom: 4,
          },
          tabBarActiveTintColor: '#FFE566',
          tabBarInactiveTintColor: '#55556A',
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: 'monospace',
            letterSpacing: 1,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          options={{ tabBarLabel: 'DASHBOARD', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>◈</Text> }}
        >
          {() => <DashboardScreen expenses={expenses} onDelete={deleteExpense} onAdd={openModal} />}
        </Tab.Screen>

        <Tab.Screen
          name="Transactions"
          options={{ tabBarLabel: 'TRANSACTIONS', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>≡</Text> }}
        >
          {() => <TransactionsScreen expenses={expenses} onDelete={deleteExpense} onAdd={openModal} />}
        </Tab.Screen>

        <Tab.Screen
          name="Analytics"
          options={{ tabBarLabel: 'ANALYTICS', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>◎</Text> }}
        >
          {() => <AnalyticsScreen expenses={expenses} />}
        </Tab.Screen>
      </Tab.Navigator>

      {/* ── ADD EXPENSE MODAL ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
        >
          <TouchableOpacity style={styles.backdrop} onPress={() => setModal(false)} />
          <View style={styles.modal}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>NEW EXPENSE ENTRY</Text>
              <TouchableOpacity onPress={() => setModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={styles.input}
              placeholder="What did you spend on?"
              placeholderTextColor="#55556A"
              value={form.title}
              onChangeText={v => setForm(f => ({ ...f, title: v }))}
            />

            <View style={styles.formRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>AMOUNT (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#55556A"
                  keyboardType="numeric"
                  value={form.amount}
                  onChangeText={v => setForm(f => ({ ...f, amount: v }))}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>DATE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#55556A"
                  value={form.date}
                  onChangeText={v => setForm(f => ({ ...f, date: v }))}
                />
              </View>
            </View>

            <Text style={styles.label}>CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => setSelCat(cat.name)}
                  style={[
                    styles.catBtn,
                    selCat === cat.name && {
                      borderColor: cat.color,
                      backgroundColor: cat.color + '22',
                    }
                  ]}
                >
                  <Text style={[styles.catText, selCat === cat.name && { color: cat.color }]}>
                    {cat.icon} {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={addExpense}>
              <Text style={styles.submitText}>RECORD EXPENSE</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  overlay: { flex:1, justifyContent:'flex-end' },
  backdrop: { flex:1 },
  modal: {
    backgroundColor: '#09090E',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    borderColor: '#2D2D3F',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 10, letterSpacing: 3, color: '#FFE566', fontFamily: 'monospace' },
  closeBtn: { fontSize: 16, color: '#55556A', padding: 4 },
  label: { fontSize: 9, letterSpacing: 2, color: '#55556A', marginBottom: 7, fontFamily: 'monospace' },
  input: {
    backgroundColor: '#111118', borderWidth: 1,
    borderColor: '#22222F', borderRadius: 8,
    padding: 12, color: '#E2E2F0',
    fontFamily: 'monospace', fontSize: 13,
    marginBottom: 14,
  },
  formRow: { flexDirection: 'row', gap: 12 },
  catScroll: { marginBottom: 14 },
  catBtn: {
    borderWidth: 1, borderColor: '#22222F',
    borderRadius: 6, paddingHorizontal: 12,
    paddingVertical: 7, marginRight: 8,
    backgroundColor: '#111118',
  },
  catText: { fontSize: 11, color: '#55556A', fontFamily: 'monospace' },
  submitBtn: {
    backgroundColor: '#FFE566', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 4,
  },
  submitText: { fontSize: 12, fontWeight: '700', color: '#09090E', letterSpacing: 2 },
});