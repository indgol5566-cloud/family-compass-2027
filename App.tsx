import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

type Task = { id: number; title: string; child: string; points: number; done: boolean };
const initialTasks: Task[] = [
  { id: 1, title: 'Заправить кровать', child: 'Санат', points: 10, done: false },
  { id: 2, title: 'Убрать игрушки', child: 'Амир', points: 15, done: false },
  { id: 3, title: 'Помочь маме', child: 'Амели', points: 20, done: true }
];
const members = [
  { name: 'Санат', emoji: '🧑🏻', points: 120 },
  { name: 'Амир', emoji: '👦🏻', points: 95 },
  { name: 'Амели', emoji: '👧🏻', points: 60 }
];

export default function App() {
  const [tab, setTab] = useState<'home' | 'tasks' | 'rewards'>('home');
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState('');
  const [selectedChild, setSelectedChild] = useState('Санат');
  const completed = useMemo(() => tasks.filter(t => t.done).length, [tasks]);
  const toggleTask = (id: number) => setTasks(old => old.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const addTask = () => {
    if (!newTitle.trim()) return;
    setTasks(old => [...old, { id: Date.now(), title: newTitle.trim(), child: selectedChild, points: 10, done: false }]);
    setNewTitle('');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />
      <View style={s.header}>
        <View><Text style={s.eyebrow}>ВАША СЕМЬЯ • ВАША КОМАНДА</Text><Text style={s.brand}>Family Compass <Text>🧭</Text></Text></View>
        <View style={s.avatar}><Text style={{fontSize:22}}>👨🏻‍👩🏻‍👧🏻‍👦🏻</Text></View>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {tab === 'home' && <>
          <View style={s.hero}><Text style={s.heroSmall}>СЕМЕЙНЫЙ ПРОГРЕСС</Text><Text style={s.heroTitle}>Вместе —{ '\n' }к большим целям!</Text><Text style={s.heroSub}>Каждый маленький шаг имеет значение.</Text><View style={s.progressRow}><View style={s.progressTrack}><View style={[s.progressFill, {width: `${tasks.length ? completed / tasks.length * 100 : 0}%`}]} /></View><Text style={s.progressText}>{completed}/{tasks.length}</Text></View></View>
          <Text style={s.sectionTitle}>Наша команда</Text>
          <View style={s.memberGrid}>{members.map(m => <View key={m.name} style={s.memberCard}><Text style={s.memberEmoji}>{m.emoji}</Text><Text style={s.memberName}>{m.name}</Text><Text style={s.memberPoints}>⭐ {m.points} баллов</Text></View>)}</View>
          <Text style={s.sectionTitle}>Задания на сегодня</Text>
          {tasks.slice(0, 3).map(t => <TaskRow key={t.id} task={t} onPress={() => toggleTask(t.id)} />)}
          <TouchableOpacity style={s.primaryButton} onPress={() => setTab('tasks')}><Text style={s.primaryButtonText}>Все задания →</Text></TouchableOpacity>
        </>}
        {tab === 'tasks' && <>
          <Text style={s.pageTitle}>Семейные задания</Text><Text style={s.muted}>Выполняй задания и зарабатывай баллы.</Text>
          <View style={s.addCard}><Text style={s.cardTitle}>Новое задание</Text><TextInput value={newTitle} onChangeText={setNewTitle} placeholder="Например, убрать комнату" placeholderTextColor="#9299A8" style={s.input}/><Text style={s.fieldLabel}>Кому назначить</Text><View style={s.childChoices}>{['Санат','Амир','Амели'].map(n => <TouchableOpacity key={n} onPress={() => setSelectedChild(n)} style={[s.choice, selectedChild === n && s.choiceActive]}><Text style={[s.choiceText, selectedChild === n && s.choiceTextActive]}>{n}</Text></TouchableOpacity>)}</View><TouchableOpacity style={s.primaryButton} onPress={addTask}><Text style={s.primaryButtonText}>＋ Добавить задание · 10 баллов</Text></TouchableOpacity></View>
          {tasks.map(t => <TaskRow key={t.id} task={t} onPress={() => toggleTask(t.id)} />)}
        </>}
        {tab === 'rewards' && <>
          <Text style={s.pageTitle}>Награды 🎁</Text><Text style={s.muted}>Баллы можно обменивать на семейные награды.</Text>
          {[['Выбрать семейный фильм','50 баллов','🎬'],['Любимый десерт','100 баллов','🍰'],['Поход в игровую комнату','250 баллов','🎮'],['Особенный семейный день','500 баллов','🏆']].map(([name,cost,emoji]) => <View key={name} style={s.rewardCard}><Text style={s.rewardEmoji}>{emoji}</Text><View style={{flex:1}}><Text style={s.cardTitle}>{name}</Text><Text style={s.rewardCost}>{cost}</Text></View><Text style={s.lock}>☆</Text></View>)}
          <Text style={s.note}>Это демонстрационный экран. Реальное списание баллов и подтверждение родителем подключим к базе данных на следующем этапе.</Text>
        </>}
      </ScrollView>
      <View style={s.nav}>{([['home','⌂','Главная'],['tasks','✓','Задания'],['rewards','◇','Награды']] as const).map(([key,icon,label]) => <TouchableOpacity key={key} style={s.navItem} onPress={() => setTab(key)}><Text style={[s.navIcon, tab === key && s.navSelected]}>{icon}</Text><Text style={[s.navLabel, tab === key && s.navSelected]}>{label}</Text></TouchableOpacity>)}</View>
    </SafeAreaView>
  );
}
function TaskRow({ task, onPress }: { task: Task; onPress: () => void }) {
  return <TouchableOpacity style={s.taskRow} onPress={onPress}><View style={[s.check, task.done && s.checkDone]}><Text style={s.checkText}>{task.done ? '✓' : ''}</Text></View><View style={{flex:1}}><Text style={[s.taskTitle, task.done && s.taskDone]}>{task.title}</Text><Text style={s.taskChild}>{task.child}</Text></View><Text style={s.points}>+{task.points} ⭐</Text></TouchableOpacity>;
}
const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#F5F7FB'}, header:{paddingHorizontal:22,paddingTop:12,paddingBottom:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, eyebrow:{fontSize:9,letterSpacing:1.5,color:'#778197',fontWeight:'800'}, brand:{fontSize:23,fontWeight:'900',color:'#18243A',marginTop:3}, avatar:{width:48,height:48,borderRadius:16,backgroundColor:'#E8EDF8',alignItems:'center',justifyContent:'center'}, content:{padding:20,paddingBottom:30}, hero:{backgroundColor:'#263D70',borderRadius:25,padding:22,marginBottom:24}, heroSmall:{color:'#B9C9F0',fontSize:10,fontWeight:'800',letterSpacing:1.5}, heroTitle:{color:'#FFFFFF',fontSize:30,fontWeight:'900',lineHeight:35,marginTop:12}, heroSub:{color:'#D7E0F5',fontSize:13,marginTop:9}, progressRow:{flexDirection:'row',alignItems:'center',gap:12,marginTop:22}, progressTrack:{height:8,flex:1,backgroundColor:'#52658E',borderRadius:10,overflow:'hidden'}, progressFill:{height:8,backgroundColor:'#F4C96B',borderRadius:10}, progressText:{color:'#FFFFFF',fontWeight:'800'}, sectionTitle:{fontSize:19,fontWeight:'900',color:'#1C2940',marginBottom:13,marginTop:5}, memberGrid:{flexDirection:'row',gap:9,marginBottom:24}, memberCard:{flex:1,backgroundColor:'#FFFFFF',borderRadius:18,paddingVertical:15,alignItems:'center',borderWidth:1,borderColor:'#E9EDF4'}, memberEmoji:{fontSize:27}, memberName:{fontWeight:'800',color:'#25324A',marginTop:8}, memberPoints:{fontSize:10,color:'#778197',marginTop:4}, taskRow:{backgroundColor:'#FFFFFF',borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',gap:12,marginBottom:9,borderWidth:1,borderColor:'#E9EDF4'}, check:{width:25,height:25,borderRadius:8,borderWidth:1.5,borderColor:'#C7CFDD',alignItems:'center',justifyContent:'center'}, checkDone:{backgroundColor:'#2E8B70',borderColor:'#2E8B70'}, checkText:{color:'#FFFFFF',fontWeight:'900'}, taskTitle:{fontSize:14,fontWeight:'800',color:'#25324A'}, taskDone:{textDecorationLine:'line-through',color:'#9299A8'}, taskChild:{fontSize:11,color:'#8790A1',marginTop:3}, points:{fontSize:12,fontWeight:'800',color:'#B17C1A'}, primaryButton:{backgroundColor:'#2F477B',padding:15,borderRadius:15,alignItems:'center',marginTop:12}, primaryButtonText:{color:'#FFFFFF',fontWeight:'800',fontSize:13}, nav:{height:72,backgroundColor:'#FFFFFF',borderTopWidth:1,borderTopColor:'#E8ECF3',flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingBottom:5}, navItem:{alignItems:'center',justifyContent:'center',flex:1}, navIcon:{fontSize:22,color:'#9AA3B3',fontWeight:'800'}, navLabel:{fontSize:10,color:'#9AA3B3',marginTop:3,fontWeight:'700'}, navSelected:{color:'#2F477B'}, pageTitle:{fontSize:25,fontWeight:'900',color:'#1C2940'}, muted:{color:'#7E8798',fontSize:13,marginTop:6,marginBottom:18}, addCard:{backgroundColor:'#FFFFFF',borderRadius:18,padding:16,marginBottom:17,borderWidth:1,borderColor:'#E9EDF4'}, cardTitle:{fontSize:14,fontWeight:'800',color:'#25324A'}, input:{borderWidth:1,borderColor:'#E1E6EF',borderRadius:12,padding:13,marginTop:12,color:'#25324A'}, fieldLabel:{fontSize:11,color:'#7E8798',fontWeight:'700',marginTop:14,marginBottom:8}, childChoices:{flexDirection:'row',gap:8}, choice:{paddingHorizontal:14,paddingVertical:9,borderRadius:20,backgroundColor:'#F1F3F8'}, choiceActive:{backgroundColor:'#E4EAF8'}, choiceText:{fontSize:12,color:'#667085',fontWeight:'700'}, choiceTextActive:{color:'#2F477B'}, rewardCard:{backgroundColor:'#FFFFFF',padding:17,borderRadius:17,flexDirection:'row',alignItems:'center',gap:14,marginBottom:10,borderWidth:1,borderColor:'#E9EDF4'}, rewardEmoji:{fontSize:27}, rewardCost:{fontSize:11,color:'#B17C1A',fontWeight:'800',marginTop:4}, lock:{fontSize:24,color:'#AAB2C0'}, note:{fontSize:11,lineHeight:17,color:'#7E8798',marginTop:12}
});
