<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; // Navigasi halaman
  import BgHeader from '../../assets/BgHeader.png';
  import notificationIcon from '../../assets/notif.svg';
  import userIcon from '../../assets/profil.png';

  let employees = []; // Data utama karyawan
  let filteredEmployees = []; // Data setelah pencarian
  let isLoading = true; // Status loading
  let error = null; // Untuk menyimpan pesan error
  let searchQuery = ''; // Input pencarian
  let currentPage = 1; // Halaman saat ini
  let totalPages = 1; // Total halaman

  const pageSize = 20; // Jumlah data per halaman

  // Fetch data berdasarkan halaman
  const fetchEmployees = async (page = 1) => {
    isLoading = true; // Tampilkan loading
    try {
      const token = localStorage.getItem('token'); // Ambil token dari localStorage

      if (!token) {
        throw new Error('Token tidak tersedia. Silakan login ulang.');
      }

      const response = await fetch(`https://dome-backend-5uxq.onrender.com/karyawan?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token dalam header
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data karyawan: ${response.status}`);
      }

      const result = await response.json();
      console.log('Data dari API:', result); // Debug API response

      employees = Array.isArray(result.data) ? result.data : [];
      currentPage = result.currentPage || 1;
      totalPages = result.totalPages || 1;

      filteredEmployees = employees; // Awalnya data terfilter sama dengan data asli
    } catch (err) {
      console.error('Error:', err);
      error = err.message; // Simpan pesan error
      employees = []; // Fallback untuk menghindari error lainnya
    } finally {
      isLoading = false; // Sembunyikan loading
    }
  };

  // Fetch data saat komponen dimuat
  onMount(() => {
    fetchEmployees(currentPage);
  });

  // Navigasi ke halaman detail berdasarkan PERNER
  const navigateToDetail = (perner) => {
    goto(`/listKaryawan/detail/${perner}`); // Navigasi ke halaman detail
  };

  // Navigasi ke halaman sebelumnya
  const previousPage = () => {
    if (currentPage > 1) {
      fetchEmployees(currentPage - 1);
    }
  };

  // Navigasi ke halaman berikutnya
  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchEmployees(currentPage + 1);
    }
  };

  // Filter data karyawan berdasarkan pencarian
  $: filteredEmployees = Array.isArray(employees)
    ? employees.filter(employee =>
        employee.nama?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
</script>

<div class="flex">
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
</div>

<div class="bg-white p-5 pb-10 shadow-sm rounded-lg mb-8 border-1">
  {#if isLoading}
    <p>Memuat data...</p>
  {:else if error}
    <p class="text-red-500">Error: {error}</p>
  {:else}
    <!-- Pencarian -->
    <div class="mb-4">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-2xl font-semibold">List Karyawan</p>
        </div>
        <input
          type="text"
          placeholder="Cari Karyawan"
          class="px-4 py-2 border rounded-md focus:outline-none xl:w-96"
          bind:value={searchQuery}
        />
      </div>
    </div>

    <!-- Tabel -->
    <table class="min-w-full divide-y divide-gray-200 rounded overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">PERNER</th>
          <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nama</th>
          <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Take Home Pay</th>
          <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unit</th>
          <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sub Unit</th>
          <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Posisi</th>
          <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sumber Anggaran</th>
          <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Detail</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each filteredEmployees as employee}
          <tr class="hover:bg-gray-100">
            <td class="px-8 py-4 whitespace-nowrap">{employee.perner}</td>
            <td class="px-8 py-4 whitespace-nowrap">{employee.nama}</td>
            <td class="px-8 py-4 whitespace-nowrap">Rp {parseFloat(employee.take_home_pay).toLocaleString('id-ID')}</td>
            <td class="px-8 py-4 whitespace-nowrap">{employee.unit}</td>
            <td class="px-8 py-4 whitespace-nowrap">{employee.sub_unit}</td>
            <td class="px-8 py-4 whitespace-nowrap">{employee.posisi_pekerjaan}</td>
            <td class="px-8 py-4 whitespace-nowrap">{employee.sumber_anggaran}</td>
            <td class="px-8 py-4 whitespace-nowrap">
              <button
                on:click={() => navigateToDetail(employee.perner)}
                class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Detail
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <button
        on:click={previousPage}
        class="px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400"
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <p>Halaman {currentPage} dari {totalPages}</p>
      <button
        on:click={nextPage}
        class="px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  {/if}
</div>
