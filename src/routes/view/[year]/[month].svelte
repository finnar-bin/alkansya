<script context="module">
    import { db } from '../../../firebase';
	import { collection, getDoc, doc, getDocs, collectionGroup } from 'firebase/firestore';

    /**
	 * Fetches prior to page rendering.
	 */
    export async function load({ params }) {
        let expenses = [];
        let incomes = [];
        const { year = '', month = '' } = params;
        const monthRef = doc(db, year, month);
        const monthSnap = await getDoc(monthRef);

        if (monthSnap.exists()) {
            let totals = {
                income: 0,
                expenses: 0,
            };
            const { lastUpdated, updatedBy } = monthSnap.data();
            const expenseRef = collection(monthRef, 'expense');
            const incomeRef = collection(monthRef, 'income');
            const expenseSnap = await getDocs(expenseRef);
            const incomeSnap = await getDocs(incomeRef);

            if (!expenseSnap.empty) {
                expenseSnap.forEach(expense => {
                    expenses.push({ ...expense.data(), id: expense.id });
    
                    totals.expenses += expense.data().amount;
                });
            }

            if (!incomeSnap.empty) {
                incomeSnap.forEach(income => {
                    incomes.push({ ...income.data(), id: income.id })
    
                    totals.income += income.data().amount;
                });
            }

            return {
                props: {
                    month,
                    year,
                    expenses,
                    incomes,
                    totals,
                    updateStatus: {
                        updatedBy,
                        lastUpdated
                    }
                }
            };
        }

        return {
            status: 404,
            error: 'Records not found',
        };
    }
</script>

<script>
    import { MONTHS } from '$lib/config/constants';

    export let month, year;
    export let incomes, expenses = [];
    export let totals = {
        income: 0,
        expenses: 0,
    };
    export let updateStatus = {
        updatedBy: '',
        lastUpdated: ''
    };

    $: pageHeader = `${MONTHS[month - 1]} ${year}`;
</script>

<svelte:head>
    <title>Budget Tracker | {pageHeader}</title>
</svelte:head>

<section>
    <a href="/">Back</a>
    <h1>{pageHeader}</h1>

    <div>
        <h3>Monthly overview</h3>
        <p>Total Expenses: {totals.expenses}</p>
        <p>Total Income: {totals.income}</p>
    </div>
    
    <div>
        <p>Expenses:</p>
        {#if expenses.length}
            <ul>
                {#each expenses as expense}
                    <li>
                        <ul>
                            <li>Type: {expense.type}</li>
                            <li>Amount: {expense.amount}</li>
                            <li>Description: {expense.description}</li>
                            <li>Date: {new Date(expense.timestamp)}</li>
                            <li>Added by: {expense.creator}</li>
                        </ul>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>No data...</p>
        {/if}
    </div>

    <div>
        <p>Incomes:</p>
        {#if incomes.length}
            <ul>
                {#each incomes as income}
                    <li>
                        <ul>
                            <li>Type: {income.type}</li>
                            <li>Amount: {income.amount}</li>
                            <li>Description: {income.description}</li>
                            <li>Date: {new Date(income.timestamp)}</li>
                            <li>Added by: {income.creator}</li>
                        </ul>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>No data...</p>
        {/if}
    </div>

    <div>
        <span>Last updated: {new Date(updateStatus.lastUpdated)}</span>
        <span>Updated by: {updateStatus.updatedBy}</span>
    </div>
</section>