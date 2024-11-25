<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores"; // Untuk mendapatkan params dari URL

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

    // Tentukan status alert berdasarkan status mutasi
    let alertStatus = "warning"; // Default status alert

    $: {
        if (mutasiData?.status_mutasi === "Diproses") {
            alertStatus = "warning";
        } else if (mutasiData?.status_mutasi === "Disetujui") {
            alertStatus = "success";
        } else if (mutasiData?.status_mutasi === "Ditolak") {
            alertStatus = "danger";
        }
    }

    // Konfigurasi alert berdasarkan status
    let alertClasses = "bg-[#FEFCE8] text-[#854D0E]";
    let title = "";
    let description = "";

    $: {
        if (alertStatus === "warning") {
            title = "Usulan Mutasi Diperiksa!";
            description = "Harap Menunggu Proses Verifikasi";
            alertClasses = "bg-[#FEFCE8] text-[#854D0E]";
        } else if (alertStatus === "success") {
            title = "Usulan Disetujui";
            description = "Usulan Mutasi Anda Telah Disetujui oleh Atasan";
            alertClasses = "bg-[#ECFDF5] text-[#065F46]";
        } else if (alertStatus === "danger") {
            title = "Usulan Mutasi Ditolak oleh Atasan";
            description = "Periksa Kembali Data-data";
            alertClasses = "bg-[#FEE2E2] text-[#991B1B]";
        }
    }
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
    <!-- Header -->
    <div class="items-center mb-6">
        <div class="flex flex-row mb-6">
            <div class="flex items-center">
                <button class="text-gray-600 hover:text-gray-800" on:click={() => history.back()}>
                    ←
                </button>
                <h1 class="ml-4 text-xl font-bold text-blue-900">Detail Karyawan</h1>
            </div>
        </div>
        {#if isLoading}
            <p class="text-gray-500">Memuat data...</p>
        {:else if errorMessage}
            <div class="p-4 bg-red-100 text-red-500 border border-red-300 rounded">
                <p>Error: {errorMessage}</p>
            </div>
        {:else if mutasiData}
            <div>
                <!-- Informasi Karyawan -->
                <div class="flex items-center justify-normal">
                    <h2 class="text-2xl font-bold text-gray-800">{mutasiData.nama}</h2>
                    <span
                        class="ml-4 px-3 py-1 text-red-500 bg-red-100 rounded-full text-sm font-semibold"
                    >
                        {mutasiData.unit}
                    </span>
                </div>

                <div>
                    <p class="mt-4 text-gray-500">
                        Perner: <span class="text-red-500 font-bold">{mutasiData.perner}</span>
                    </p>
                </div>
            </div>
        {/if}
    </div>

    {#if mutasiData}
        <!-- Status Mutasi -->
        <div class="px-6">
            <div class="flex justify-normal items-center mb-4">
                <h2 class="text-xl font-bold mr-4">Status Mutasi</h2>
                <span class={`p-4 py-1 rounded-lg font-bold ${alertStatus === "warning" ? "bg-yellow-500" : alertStatus === "success" ? "bg-green-500" : "bg-red-500"} text-white`}>
                    {mutasiData.status_mutasi}
                </span>
            </div>
            <!-- Alert -->
            <div class={`rounded-lg p-4 flex items-start border-none ${alertClasses}`}>
                <div class="ml-3">
                    <p class="font-bold mb-3">{title}</p>
                    <p class="font-medium">{description}</p>
                </div>
            </div>
        </div>

        <!-- Detail Pekerjaan dan Mutasi -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <!-- Informasi Pekerjaan Saat Ini -->
            <div>
                <h3 class="text-lg font-bold text-red-500 mb-4">Informasi Pekerjaan Saat Ini</h3>
                <div class="grid gap-4">
                    <div>
                        <p class="text-gray-500">Unit</p>
                        <p class="font-semibold">{mutasiData.unit}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Sub Unit</p>
                        <p class="font-semibold">{mutasiData.sub_unit}</p>
                    </div>                    
                    <div>
                        <p class="text-gray-500">NIK Atasan</p>
                        <p class="font-semibold">{mutasiData.nik_atasan}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Nama Atasan</p>
                        <p class="font-semibold">{mutasiData.nama_atasan}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Posisi</p>
                        <p class="font-semibold">{mutasiData.posisi_pekerjaan}</p>
                    </div>
                </div>
            </div>

            <!-- Mutasi -->
            <div>
                <h3 class="text-lg font-bold text-red-500 mb-4">Mutasi</h3>
                <div class="grid gap-4">
                    <div>
                        <p class="text-gray-500">Unit Baru</p>
                        <p class="font-semibold bg-gray-100 px-3 py-2 rounded-md">{mutasiData.unit_baru}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Sub Unit Baru</p>
                        <p class="font-semibold bg-gray-100 px-3 py-2 rounded-md">{mutasiData.sub_unit_baru}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Posisi Baru</p>
                        <p class="font-semibold bg-gray-100 px-3 py-2 rounded-md">{mutasiData.posisi_baru}</p>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
