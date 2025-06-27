import { SignOutButton } from '@/components/SignOutButton'
import useTransactions from '@/hooks/useTransactions'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { useEffect } from 'react'
import { Text, View } from 'react-native'

export default function Page() {
  const { user } = useUser()
  const {transactions, loading, summary, loadData, deleteTransactions} = useTransactions(user.id);

  useEffect(()=>{
    loadData()
  },
  [loadData]);

  console.log("transactions: ", transactions)
  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Text>Income {summary.income}</Text>
        <Text>Balance {summary.balance}</Text>
        <Text>Expense {summary.expenses}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}