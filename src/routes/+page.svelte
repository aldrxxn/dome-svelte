<script>
  import { goto } from '$app/navigation'; // Hanya jika menggunakan SvelteKit
  import logo from '../assets/LogoTelkom.svg';
  import LoginButton from '../assets/LoginButton.svg';
  import bg from '../assets/bg.png';
  
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
  <div class="min-h-screen flex items-center justify-center bg-cover" style="background-image: url({bg})">
    <div class="flex flex-col gap-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <div class="flex justify-between px-8 pt-8">
            <h2 class="text-3xl font-bold text-[#092540] font-lato">TELKOM Outsourcing</h2>
            <img src={logo} alt="Logo Telkom">
        </div>
        <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-5">
            <div class="px-8">
                <label for="email" class="text-lg font-semibold text-[#092540] font-lato">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Masukkan Email"
                    bind:value={email}
                    class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                    required
                />
            </div>
            <div class="px-8">
                <label for="password" class="text-lg font-semibold text-[#092540] font-lato">Kata Sandi</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Masukkan Kata Sandi"
                    bind:value={password}
                    class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                    required
                />
            </div>
            <div class="relative justify-items-end grid">
                <img src={LoginButton} alt="Login Button">
                <button
                    type="submit"
                    class="absolute m-auto flex items-center font-bold bg-transparent text-white px-12 pt-12 font-lato"
                >
                    Login
                </button>
            </div>
        </form>
    </div>
  </div>
  