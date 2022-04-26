<script context="module">
    import { db } from '../../../firebase';
	import { collection, getDoc, query, doc, where, getDocs } from 'firebase/firestore';

    /**
	 * Fetches prior to page rendering.
	 */
    export async function load({ params }) {
        const { year = '', month = '' } = params;
        // const yearRef = collection(db, year);
        const yearRef = doc(db, year, month);
        const expensesRef = collection(yearRef, 'expenses');
        const yearSnap = await getDoc(yearRef);
        const expensesSnap = await getDocs(expensesRef);
        const { totalExpenses } = yearSnap.data();
        let expenses = [];

        expensesSnap.forEach(expense => expenses.push({ ...expense.data(), id: expense.id }));

        console.log('total expenses', yearSnap.data().totalExpenses);
        expensesSnap.forEach(expense => console.log('expense', expense.id, expense.data()));
        
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

    $: pageHeader = `${MONTHS[month]} ${year}`;
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