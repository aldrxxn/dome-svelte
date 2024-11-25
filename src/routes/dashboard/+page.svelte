<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import BgHeader from '../../assets/BgHeader.png';
    import notificationIcon from '../../assets/notif.svg';
    import userIcon from '../../assets/profil.png';
  
    // Proteksi halaman
    onMount(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda harus login terlebih dahulu.');
        goto('/'); // Redirect ke halaman login jika tidak ada token
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
        goto('/');
      }
    });
  </script>
  
    <div class="flex-1 pt-15">
      <div class="flex justify-between items-center pl-8 pr-4 rounded-lg mb-4 bg-cover bg-center"
        style="background-image: url({BgHeader}); height: 180px; width: 100%;">
        <div class="flex items-center gap-4">
          <div class="text-white text-3xl">
            <p class="text-xl text-white">
              <span class="text-[#FF0000]">#</span> Elevating Your Future
            </p>
            <p class="text-4xl lg:text-7xl lg:font-semibold ">Summary Data</p>
          </div>
        </div>
        <div class="flex items-center gap-4 pb-16 pr-6">
          <img src={notificationIcon} alt="Notification Icon" class="w-14 h-14 rounded-full cursor-pointer" />
          <img src={userIcon} alt="User Icon" class="w-14 h-14 rounded-full cursor-pointer" />
        </div>
      </div>
    </div>
    <div class="bg-white p-5 pb-10 shadow-sm rounded-lg mb-8 border-1">
      <div class="flex justify-between">
        <div>
          <p class="text-2xl font-semibold">Rekap Kehadiran</p>
          <!-- <p>Jumat, 20 September 2024</p> -->
        </div>
      </div>
      <div class="mt-6 flex gap-6">
        <div class="bg-[#FFE2E5] p-6 rounded-lg flex flex-col w-full items-start gap-3">
          <div class="gap-2">
            <span class="text-2xl font-bold">1.500</span>
            <p class="text-gray-600">Karyawan Aktif</p>
          </div>
        </div>
        <div class="bg-[#F3E8FF] p-6 rounded-lg flex flex-col w-full items-start gap-3">
          <div class="gap-2">
            <span class="text-2xl font-bold">300</span>
            <p class="text-gray-600">Belum Melakukan Absensi</p>
          </div>
        </div>
        <div class="bg-[#FFF4DE] p-6 rounded-lg flex flex-col w-full items-start gap-3">
          <div class="gap-2">
            <span class="text-2xl font-bold">300</span>
            <p class="text-gray-600">Melakukan Absensi</p>
          </div>
        </div>
          <div class="bg-[#DCFCE7] p-6 rounded-lg flex flex-col w-full items-start gap-3">
          <div class="gap-2">
            <span class="text-2xl font-bold">150</span>
            <p class="text-gray-600">Karyawan Cuti</p>
          </div>
        </div>
      </div>
    </div>
    