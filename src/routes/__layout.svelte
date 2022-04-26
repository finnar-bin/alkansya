<script context="module">
    import { initFirebase } from '../firebase';

    export async function load() {
        await initFirebase();

        return {
            props: {}
        }
    }
</script>

<slot></slot>