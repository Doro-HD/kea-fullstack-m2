<script>
  import { onMount } from "svelte";

  onMount(async () => {
    const response = await fetch('http://127.0.0.1:8080/protected/users/id')
    console.log(response)
  })
</script>
<h1>Home page</h1>
