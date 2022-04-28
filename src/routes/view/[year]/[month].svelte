<script context="module">
    import { db } from '../../../firebase';
	import { collection, getDoc, doc, getDocs } from 'firebase/firestore';

    /**
	 * Fetches prior to page rendering.
	 */
    export async function load({ params }) {
        const { year = '', month = '' } = params;
        const monthRef = doc(db, year, month);
        const expensesRef = collection(monthRef, 'expenses');
        const monthSnap = await getDoc(monthRef);
        const expensesSnap = await getDocs(expensesRef);
        const totalExpenses = await monthSnap.data().totalExpenses;
        let expenses = [];

        expensesSnap.forEach(expense => expenses.push({ ...expense.data(), id: expense.id }));
        
        return {
            props: {
                month,
                year,
                data: {
                    totalExpenses,
                    expenses
                }
            }
        }
    }
</script>

<script>
    import { MONTHS } from '$lib/config/constants';
    export let month, year;
    export let data = {};

    $: pageHeader = `${MONTHS[month - 1]} ${year}`;
</script>

<svelte:head>
    <title>Budget Tracker | {pageHeader}</title>
</svelte:head>

<section>
    <a href="/">Back</a>
    <h1>{pageHeader}</h1>

    <p>Total Expenses: {data.totalExpenses}</p>
    <p>Expenses:</p>
    <ul>
        {#each data.expenses as expense}
            <li>
                <ul>
                    <li>Type: {expense.type}</li>
                    <li>Amount: {expense.amount}</li>
                    <li>Description: {expense.description}</li>
                    <li>Date: {new Date(expense.timestamp)}</li>
                </ul>
            </li>
        {/each}
    </ul>
</section>