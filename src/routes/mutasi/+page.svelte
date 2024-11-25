<script lang="ts">
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import BgHeader from '../../assets/BgHeader.png';
    import notificationIcon from '../../assets/notif.svg';
    import userIcon from '../../assets/profil.png';
    import EyeIcon from "../../assets/EyeIcon.svg";
    import TrashIcon from "../../assets/TrashIcon.svg";
    import PlusIcon from "../../assets/Plus.svg";
    import { goto } from '$app/navigation'; // Import fungsi untuk navigasi


    // State untuk data mutasi
    const dataMutasi = writable([]);
    const searchQuery = writable(""); // Pencarian utama
    const filteredData = writable([]);
    const isModalOpen = writable(false); // Modal untuk mencari karyawan
    const searchModalQuery = writable(""); // Pencarian di modal
    const searchResults = writable([]); // Hasil pencarian modal
    const isLoading = writable(false);
    const errorMessage = writable("");
    // Function untuk handle klik pada karyawan
    function handleKaryawanClick(nama: string) {
    goto(`/mutasi/add-mutasi/${encodeURIComponent(nama)}`);
}
    // Fetch data mutasi dari endpoint
    async function fetchMutasiData() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token tidak tersedia. Silakan login.");
            const response = await fetch("https://dome-backend-5uxq.onrender.com/mutasi", {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
            const data = await response.json();
            dataMutasi.set(data);
            filteredData.set(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    // Fetch karyawan dari endpoint
    async function searchKaryawan(query: string) {
    if (!query) {
        searchResults.set([]); // Reset hasil jika query kosong
        return;
    }
    isLoading.set(true);
    errorMessage.set("");
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak tersedia. Silakan login.");
        const response = await fetch(`https://dome-backend-5uxq.onrender.com/karyawan?nama=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
        const data = await response.json();
        searchResults.set(data.filter((karyawan) =>
            karyawan.nama.toLowerCase().includes(query.toLowerCase()) // Filter berdasarkan nama
        ));
    } catch (error) {
        errorMessage.set("Gagal mengambil data karyawan.");
        console.error(error.message);
    } finally {
        isLoading.set(false);
    }
}


    // Filter data mutasi berdasarkan pencarian utama
    searchQuery.subscribe((query) => {
        const lowerCaseQuery = query.toLowerCase();
        dataMutasi.subscribe((data) => {
            filteredData.set(
                data.filter(
                    (mutasi) =>
                        mutasi.nama.toLowerCase().includes(lowerCaseQuery) ||
                        mutasi.perner.toLowerCase().includes(lowerCaseQuery)
                )
            );
        });
    });

    // Fetch data mutasi saat komponen dimuat
    onMount(() => {
        fetchMutasiData();
    });

    // Menentukan warna berdasarkan status mutasi
    const textColor = (status: string) => {
        switch (status) {
            case "Diproses":
                return "text-yellow-500";
            case "Disetujui":
                return "text-green-500";
            case "Ditolak":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };
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
    <div class="flex justify-between items-center mb-4">
        <p class="text-2xl font-semibold">Daftar Mutasi Karyawan</p>
    
        <!-- Tombol untuk membuka modal pencarian -->
        <button
            on:click={() => isModalOpen.set(true)}
            class="flex gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
        >
            Mutasi
            <img src={PlusIcon} alt="">
        </button>
    </div>
        <!-- Modal untuk pencarian karyawan -->
    {#if $isModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 class="text-xl font-bold mb-4">Cari Karyawan</h2>
            <input
                type="text"
                placeholder="Cari berdasarkan nama"
                class="w-full px-3 py-2 border rounded mb-4"
                bind:value={$searchModalQuery}
                on:input={() => searchKaryawan($searchModalQuery)}
            />

            {#if $isLoading}
                <p class="text-gray-500">Memuat data...</p>
            {:else if $errorMessage}
                <p class="text-red-500">{$errorMessage}</p>
            {:else if $searchResults.length === 0}
                <p class="text-gray-500">Tidak ada hasil ditemukan.</p>
            {:else}
                <ul class="space-y-2">
                    {#each $searchResults as karyawan (karyawan.perner)}
                    <li class="border rounded px-3 py-2 hover:bg-gray-100">
                        <button
                        class="w-full text-left cursor-pointer"
                        on:click={() => handleKaryawanClick(karyawan.nama)}
                    >
                        <p class="font-semibold text-blue-600">Perner: {karyawan.perner}</p>
                        <p>Nama: {karyawan.nama}</p>
                    </button>
                    </li>
                {/each}
                
                </ul>
            {/if}

            <div class="mt-4 flex justify-end">
                <button
                    on:click={() => isModalOpen.set(false)}
                    class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
    {/if}

    


        <div>
            <input
            type="text"
            placeholder="Cari Mutasi Karyawan"
            class="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            bind:value={$searchQuery}
        />
    
        <div class="overflow-x-auto">
            <table class="w-full border-collapse rounded-lg overflow-hidden bg-white shadow">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Perner</th>
                        <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nama</th>
                        <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unit Baru</th>
                        <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sub Unit Baru</th>
                        <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Posisi Baru</th>
                        <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                        <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $filteredData as mutasi}
                    <tr class="border-t text-gray-600 hover:bg-gray-50">
                        <td class="px-8 py-4 whitespace-nowrap">{mutasi.perner}</td>
                        <td class="px-8 py-4 whitespace-nowrap">{mutasi.nama}</td>
                        <td class="px-8 py-4 whitespace-nowrap">{mutasi.unit_baru}</td>
                        <td class="px-8 py-4 whitespace-nowrap">{mutasi.sub_unit_baru}</td>
                        <td class="px-8 py-4 whitespace-nowrap">{mutasi.posisi_baru}</td>
                        <td class={`px-8 py-4 font-semibold ${textColor(mutasi.status_mutasi)}`}>
                            {mutasi.status_mutasi}
                        </td>
                        <td class="px-8 py-4 flex gap-2">
                            <button
                                class="text-blue-600 hover:text-blue-800"
                                on:click={() => goto(`/mutasi/detail/${mutasi.perner}`)}
                            >
                                Detail
                            </button>
                        </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    
</div>
</div>

