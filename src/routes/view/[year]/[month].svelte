<script context="module">
    export async function load({ params, fetch }) {
        const { year = '', month = '' } = params;
        const response = await fetch(`/endpoints/month?year=${year}&month=${month}`);
        const parsedData = await response.json();

        if (response.ok) {
            return {
                status: response.status,
                props: {
                    month,
                    year,
                    data: parsedData.data,
                }
            }
        }

        return {
            status: response.status,
            error: parsedData.error,
            props: {
                month,
                year
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
                    <li>Date: {new Date(expense.date)}</li>
                </ul>
            </li>
        {/each}
    </ul>
</section>