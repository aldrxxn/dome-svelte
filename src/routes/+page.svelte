<script>
    import { goto } from '$app/navigation'; // Hanya jika menggunakan SvelteKit
  
    let email = '';
    let password = '';
  
    const handleSubmit = async (event) => {
  event.preventDefault();

  if (!email || !password) {
    alert('Email dan password harus diisi.');
    return;
  }

  try {
    const response = await fetch('https://dome-backend-5uxq.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password: password }),
    });

    console.log('Status Code:', response.status); // Debugging log status
    console.log('Response Headers:', response.headers); // Debugging log header

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Response Data:', errorData); // Debugging log error data
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log('Response Data:', data); // Debugging log data

    if (data.message === 'Login successful') {
      alert('Login berhasil!');
      localStorage.setItem('token', data.token);
      goto('/dashboard');
    } else {
      alert('Login gagal, periksa email atau password.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat login. Silakan coba lagi.');
  }
};

  </script>
  
  <style>
    .container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background-color: #fff;
    }
    .input-field {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .login-button {
      width: 100%;
      padding: 10px;
      color: #fff;
      background-color: #0070f3;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
  
  <div class="container">
    <h2>Login</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <input
        type="email"
        bind:value={email}
        placeholder="Email"
        class="input-field"
        required
      />
      <input
        type="password"
        bind:value={password}
        placeholder="Password"
        class="input-field"
        required
      />
      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
  