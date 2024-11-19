<script>
    import '../app.css';
    import logo from '../assets/LogoTelkom.svg';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
  
    const menus = [
      { label: 'Home', link: '/dashboard' },
      { label: 'List Karyawan', link: '/listKaryawan' },
      { label: 'Settings', link: '/dashboard/settings' }
    ];
  
    // Fungsi logout
    const logout = () => {
      localStorage.removeItem('token'); // Hapus token dari localStorage
      alert('Anda telah logout.');
      goto('/'); // Arahkan ke halaman login
    };
  </script>
  
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="bg-white w-40 h-screen fixed px-5 py-16 shadow-lg flex flex-col top-0 left-0 lg:w-64 transition-width duration-300">
      <!-- Logo -->
      <div class="flex items-center gap-4 mb-10">
        <img src={logo} alt="Logo" class="w-10 h-10">
        <a href="/dashboard" class="font-lato text-2xl font-bold">Dome</a>
      </div>
  
      <!-- Menu Items -->
      <ul class="flex-grow">
        {#each menus as menu}
          <li class="mb-5">
            <a
              href={menu.link}
              class="font-lato text-base block py-3.5 px-7 rounded font-bold
                {$page.url.pathname === menu.link ? 'bg-gray-100 text-red-800' : 'text-gray-700 hover:bg-gray-200'}"
            >
              {menu.label}
            </a>
          </li>
        {/each}
      </ul>
  
      <!-- Tombol Logout -->
      <button
        on:click={logout}
        class="w-full text-left font-lato text-base block py-3.5 px-7 rounded bg-red-800 text-white hover:bg-red-500 font-bold mt-auto"
      >
        Logout
      </button>
    </div>
  
    <!-- Main Content -->
    <div class="flex-1 ml-40 lg:ml-64 overflow-auto">
      <slot />
    </div>
  </div>
  