<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores"; // Untuk mengambil params dari URL

    let karyawanId: string; // Nama karyawan dari URL
    let karyawanData = null; // Data karyawan yang diambil dari API
    let isLoading = true; // Status loading
    let errorMessage = ""; // Pesan error

    // Form mutasi
    let mutasiForm = {
        unit_baru: "",
        sub_unit_baru: "",
        kota_baru: "",
        posisi_baru: "",
    };

    // Ambil parameter nama dari URL
    $: karyawanId = $page.params.nama;

    // Fetch data karyawan dari backend
    async function fetchKaryawanData() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                errorMessage = "Token tidak tersedia. Silakan login.";
                return;
            }

            if (!karyawanId) {
                errorMessage = "Nama karyawan tidak ditemukan di URL.";
                return;
            }

            const response = await fetch(
                `https://dome-backend-5uxq.onrender.com/mutasi/karyawan/${encodeURIComponent(karyawanId)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);

            const data = await response.json();
            karyawanData = data[0] || null; // Pastikan hanya mengambil objek pertama jika API mengembalikan array
        } catch (error) {
            errorMessage = error.message;
        } finally {
            isLoading = false;
        }
    }

    // Submit form mutasi
    async function submitMutasiForm(event: Event) {
        event.preventDefault();
        errorMessage = ""; // Reset error message
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                errorMessage = "Token tidak tersedia. Silakan login.";
                return;
            }

            if (!karyawanData) {
                errorMessage = "Data karyawan tidak ditemukan.";
                return;
            }

            // Validasi input
            if (!mutasiForm.unit_baru || !mutasiForm.sub_unit_baru || !mutasiForm.posisi_baru) {
                errorMessage = "Semua field mutasi wajib diisi.";
                return;
            }

            // Payload sesuai dengan API
            const payload = {
                id: null, // ID dibiarkan null jika dibuat otomatis oleh backend
                perner: karyawanData.perner,
                nama: karyawanData.nama,
                unit_baru: mutasiForm.unit_baru,
                sub_unit_baru: mutasiForm.sub_unit_baru,
                posisi_baru: mutasiForm.posisi_baru,
                status_mutasi: "pending", // Default status
                created_at: new Date().toISOString(), // Format waktu saat ini
            };

            const response = await fetch(`https://dome-backend-5uxq.onrender.com/mutasi`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Response Error:", errorData); // Debugging
                throw new Error(errorData.message || `Gagal menyimpan data mutasi: ${response.statusText}`);
            }

            alert("Mutasi berhasil disimpan!");
        } catch (error) {
            errorMessage = error.message;
        }
    }

    // Fetch data karyawan saat komponen dimuat
    onMount(() => {
        fetchKaryawanData();
    });
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
            <button class="text-gray-600 hover:text-gray-800" on:click={() => history.back()}>
                ←
            </button>
            <h1 class="ml-4 text-xl font-bold text-blue-900">Detail Karyawan</h1>
        </div>
    </div>

    <!-- Loading dan Error Handling -->
    {#if isLoading}
        <p class="text-gray-500">Memuat data...</p>
    {:else if errorMessage}
        <div class="p-4 bg-red-100 text-red-500 border border-red-300 rounded">
            <p>Error: {errorMessage}</p>
        </div>
    {:else if karyawanData}
        <!-- Informasi Karyawan -->
        <div class="flex items-center justify-normal">
            <h2 class="text-2xl font-bold text-gray-800">{karyawanData.nama}</h2>
            <span
                class="ml-4 px-3 py-1 text-red-500 bg-red-100 rounded-full text-sm font-semibold"
            >
                {karyawanData.unit}
            </span>
        </div>
        <div>
            <p class="mt-4 text-gray-500">
                Perner: <span class="text-red-500 font-bold">{karyawanData.perner}</span>
            </p>
        </div>

        <!-- Detail Pekerjaan dan Mutasi -->
        <div class="p-4 bg-white rounded-lg border-2 border-[#E9E9E9] mt-7">
            <!-- Header -->
            <div class="flex items-center justify-normal mb-4 pb-4 border-b-2">
                <h2 class="text-xl font-bold mr-4 text-blue-900">Detail Pekerjaan</h2>
                <span class="p-4 py-1 bg-[#1CB993] text-white rounded-lg">
                    Aktif
                </span>
            </div>

            <!-- Detail Pekerjaan -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border-[#E9E9E9] border-r-2">
                    <h3 class="text-lg font-bold text-[#CF3C3C] mb-4">Informasi Pekerjaan</h3>
                    <div class="mb-4">
                        <p class="text-[#ABABAB]">Unit</p>
                        <p class="font-semibold">{karyawanData.unit}</p>
                    </div>
                    <div class="mb-4">
                        <p class="text-[#ABABAB]">Sub Unit</p>
                        <p class="font-semibold">{karyawanData.sub_unit}</p>
                    </div>
                    <div class="mb-4">
                        <p class="text-[#ABABAB]">Kota</p>
                        <p class="font-semibold">{karyawanData.kota}</p>
                    </div>
                    <div class="mb-4">
                        <p class="text-[#ABABAB]">NIK Atasan</p>
                        <p class="font-semibold">{karyawanData.nik_atasan}</p>
                    </div>
                    <div class="mb-4">
                        <p class="text-[#ABABAB]">Nama Atasan</p>
                        <p class="font-semibold">{karyawanData.nama_atasan}</p>
                    </div>
                    <div class="mb-4">
                        <p class="text-[#ABABAB]">Posisi</p>
                        <p class="font-semibold">{karyawanData.posisi_pekerjaan}</p>
                    </div>
                </div>

                <!-- Form Mutasi -->
                <div>
                    <h3 class="text-lg font-bold text-[#CF3C3C] mb-4">Mutasi</h3>
                    <form on:submit={submitMutasiForm}>
                        <div class="mb-4">
                            <label for="unit" class="block text-sm font-medium text-gray-500">Unit Baru</label>
                            <input
                                id="unit"
                                type="text"
                                bind:value={mutasiForm.unit_baru}
                                class="w-full px-4 py-2 mt-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div class="mb-4">
                            <label for="subUnit" class="block text-sm font-medium text-gray-500">Sub Unit Baru</label>
                            <input
                                id="subUnit"
                                type="text"
                                bind:value={mutasiForm.sub_unit_baru}
                                class="w-full px-4 py-2 mt-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div class="mb-4">
                            <label for="posisi" class="block text-sm font-medium text-gray-500">Posisi Baru</label>
                            <input
                                id="posisi"
                                type="text"
                                bind:value={mutasiForm.posisi_baru}
                                class="w-full px-4 py-2 mt-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div class="flex justify-end">
                            <button
                                type="submit"
                                class="px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    {/if}
</div>
