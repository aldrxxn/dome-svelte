<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    // Fungsi untuk logout
    function logout() {
      localStorage.removeItem('token');
      alert('Anda telah logout.');
      goto('/login'); // Redirect ke halaman login setelah logout
    }
  
    // Proteksi halaman
    onMount(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda harus login terlebih dahulu.');
        goto('/login'); // Redirect ke halaman login jika tidak ada token
        return;
      }
  
      // Validasi token (opsional)
      try {
        const response = await fetch('https://dome-backend-5uxq.onrender.com/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Token tidak valid');
        }
      } catch (error) {
        alert('Sesi Anda telah berakhir. Silakan login ulang.');
        localStorage.removeItem('token');
        goto('/login');
      }
    });
  </script>
  
  <style>
    .dashboard-container {
      padding: 20px;
      font-family: Arial, sans-serif;
      text-align: center;
    }
  </style>
  
  <div class="dashboard-container">
    <h1>Selamat Datang di Dashboard</h1>
    <p>Anda sekarang berhasil login.</p>
  
    <button on:click={logout}>Logout</button>
  </div>
  