<script>
  import { Router, Link, Route } from 'svelte-navigator'
  import Home from './pages/Home.svelte'
  import SignIn from './pages/SignIn.svelte';
  import SignOut from './pages/SignOut.svelte'
  
</script>

<Router>
  <nav>
    <Link to='/'>Home</Link>
    |
    <Link to='signIn'>Sign in</Link>
    |
    <Link to='signOut'>Sign out</Link>
  </nav>
  <div>
    <Route path='/'>
      <Home />
    </Route>
    <Route path='signIn'>
      <SignIn/>
    </Route>
    <Route path='signOut'>
      <SignOut />
    </Route>
  </div>
</Router>
