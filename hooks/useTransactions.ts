import { API_URL } from "@/constants/api";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

const useTransactions = (userId: any) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0
    })
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            console.log("response", response)
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log(`Error fetching transactions: `, error)
        }
    }, [userId])

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log(`Error fetching summary: `, error)
        }
    }, [userId])

    const loadData = useCallback(async ()=>{
        if(!userId) return
        setLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()])
        } catch (error) {
            console.log("Error loading data: ", error);
        } finally {
            setLoading(false);
        }
    },[fetchTransactions,fetchSummary,userId])
    
    const deleteTransactions = async(id:any) =>{
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {method: "DELETE"});
            if(!response.ok) throw new Error("Failed to delete transaction");

            loadData();
            Alert.alert("Success", "Transaction delete successfully!");
        } catch (error : any) {
            console.log("Error deleting transaction: ", error);
            Alert.alert("Error", error.message);
        }
    }

    return {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransactions
    }
}

export default useTransactions;