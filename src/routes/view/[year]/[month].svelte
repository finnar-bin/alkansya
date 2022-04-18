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

<section>
    This is the month preview page!
</section>