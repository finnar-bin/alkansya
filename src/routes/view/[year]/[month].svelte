<script context="module">
    export async function load({ params, fetch }) {
        const { year = '', month = '' } = params;
        const response = await fetch(`/endpoints/month?year=${year}&month=${month}`);
        const parsedData = await response.json();

        if (response.ok) {
            return {
                status: response.status,
                props: {
                    data: parsedData.data,
                }
            }
        }

        return {
            status: response.status,
            error: parsedData.error,
            data: {}
        }
    }
</script>

<script>
    export let data = {};

    console.log(data)
</script>

<section>
    This is the month preview page!

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