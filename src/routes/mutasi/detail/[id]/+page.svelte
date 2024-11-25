<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let karyawanId: string; // ID Karyawan dari URL
    let mutasiData = null; // Data mutasi karyawan
    let isLoading = true; // Status loading
    let errorMessage = ""; // Pesan error

    // Ambil parameter ID dari URL
    $: karyawanId = $page.params.id;

    // Fetch detail data mutasi berdasarkan ID karyawan
    async function fetchMutasiDetail() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                errorMessage = "Token tidak tersedia. Silakan login.";
                return;
            }

            if (!karyawanId) {
                errorMessage = "ID karyawan tidak ditemukan di URL.";
                return;
            }

            const response = await fetch(
                `https://dome-backend-5uxq.onrender.com/mutasi/${encodeURIComponent(karyawanId)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);

            const data = await response.json();
            mutasiData = data; // Data detail mutasi
        } catch (error) {
            errorMessage = error.message;
        } finally {
            isLoading = false;
        }
    }

    // Fetch data saat komponen dimuat
    onMount(() => {
        fetchMutasiDetail();
    });
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <button class="text-gray-600 hover:text-gray-800" on:click={() => history.back()}>
            ← Kembali
        </button>
        <h1 class="text-xl font-bold text-blue-900">Detail Mutasi Karyawan</h1>
    </div>

    <!-- Loading dan Error Handling -->
    {#if isLoading}
        <p class="text-gray-500">Memuat data...</p>
    {:else if errorMessage}
        <div class="p-4 bg-red-100 text-red-500 border border-red-300 rounded">
            <p>Error: {errorMessage}</p>
        </div>
    {:else if mutasiData}
        <!-- Tampilkan Detail Mutasi -->
        <div>
            <h2 class="text-2xl font-bold text-gray-800">{mutasiData.nama}</h2>
            <p class="text-gray-500 mt-2">Perner: <span class="text-red-500">{mutasiData.perner}</span></p>
            <p class="text-gray-500 mt-2">Status: <span class="font-semibold text-yellow-500">{mutasiData.status_mutasi}</span></p>
        </div>

        <!-- Detail Lama -->
        <div class="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 class="text-lg font-bold mb-2 text-blue-800">Detail Lama</h3>
            <p>Unit: {mutasiData.unit}</p>
            <p>Sub Unit: {mutasiData.sub_unit}</p>
            <p>Kota: {mutasiData.kota}</p>
            <p>Posisi: {mutasiData.posisi_pekerjaan}</p>
        </div>

        <!-- Detail Baru -->
        <div class="mt-6 p-4 bg-white rounded-lg border-2 border-gray-300">
            <h3 class="text-lg font-bold mb-2 text-green-800">Detail Baru</h3>
            <p>Unit Baru: {mutasiData.unit_baru}</p>
            <p>Sub Unit Baru: {mutasiData.sub_unit_baru}</p>
            <p>Posisi Baru: {mutasiData.posisi_baru}</p>
        </div>

        <p class="mt-6 text-gray-500 text-sm">
            Dibuat pada: {new Date(mutasiData.created_at).toLocaleString()}
        </p>
    {/if}
</div>
