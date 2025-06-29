import { styles } from '@/assets/styles/home.styles'
import BalancedCard from '@/components/BalancedCard'
import NoTransactionsFound from '@/components/NoTransactionsFound'
import PageLoader from '@/components/PageLoader'
import { SignOutButton } from '@/components/SignOutButton'
import TransactionItem from '@/components/TransactionItem'
import useTransactions from '@/hooks/useTransactions'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { transactions, loading, summary, loadData, deleteTransactions } = useTransactions(user.id || "");

  useEffect(() => {
    loadData()
  },
    [loadData]);

  const onReferesh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if (loading && !refreshing) return <PageLoader />

  const handleDelete = (id: any) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      {
        text: "Cancel", style: "cancel",
      },
      {
        text: "Delete", style: "destructive", onPress: () => deleteTransactions(id)
      }
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name='add-circle' size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalancedCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transaction</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        // data={[
        //   {user_id : "123", title : "Rent", amount: "-1500", category: "Transportation", create_at: "2025-05-20"},
        //   {user_id : "123", title : "Salary", amount: "5000", category: "Income", create_at: "2025-05-20"},
        //   {user_id : "123", title : "Foods & Drinks", amount: "-100", category: "Food & Drinks", create_at: "2025-05-20"},
        //   {user_id : "123", title : "Shopping", amount: "-400", category: "Shopping", create_at: "2025-05-20"},
        //   {user_id : "123", title : "Film", amount: "-300", category: "Entertainment", create_at: "2025-05-20"},
        //   {user_id : "123", title : "Electricity", amount: "-1000", category: "Bills", create_at: "2025-05-20"},
        // ]}
        // data={[]}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onReferesh} />}
      />
      {

      }
    </View>
  )
}