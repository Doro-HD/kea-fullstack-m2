<script>
  let username = ''
  let password = ''

  async function signIn() {
    const response = await fetch('http://127.0.0.1:8080/signIn', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const data = await response.json()

    console.log(data)
  }
</script>
<form action='' on:submit|preventDefault={signIn}>
  <input type='text' bind:value={username} placeholder='username'>
  <input type='password' bind:value={password} placeholder='password'>

  <button type='submit'>Submit</button>
</form>
