<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from '$app/navigation'; // Import fungsi untuk navigasi


    let karyawanId: string;
    let karyawanData = null;
    let isLoading = true;
    let errorMessage = "";

    let mutasiForm = {
        unit_baru: "",
        sub_unit_baru: "",
        posisi_baru: "",
    };

    let dropdownData = [];
    let subUnits = []; // Subunit sesuai unit yang dipilih

    $: karyawanId = $page.params.nama;

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
            karyawanData = data[0] || null;
        } catch (error) {
            errorMessage = error.message;
        } finally {
            isLoading = false;
        }
    }

    async function fetchDropdownData() {
        try {
            const response = await fetch("https://dome-backend-5uxq.onrender.com/dropdown");
            if (!response.ok) throw new Error("Gagal mengambil data dropdown.");

            dropdownData = await response.json();
        } catch (error) {
            errorMessage = error.message;
        }
    }

    function updateSubUnits() {
        const selectedUnit = dropdownData.find((unit) => unit.unit_baru === mutasiForm.unit_baru);
        subUnits = selectedUnit ? selectedUnit.sub_unit_baru : [];
        mutasiForm.sub_unit_baru = ""; // Reset pilihan sub unit saat unit berubah
    }

    async function submitMutasiForm(event: Event) {
        event.preventDefault();
        errorMessage = "";

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

            if (!mutasiForm.unit_baru || !mutasiForm.sub_unit_baru || !mutasiForm.posisi_baru) {
                errorMessage = "Semua field mutasi wajib diisi.";
                return;
            }

            const payload = {
                id: null,
                perner: karyawanData.perner,
                nama: karyawanData.nama,
                unit_baru: mutasiForm.unit_baru,
                sub_unit_baru: mutasiForm.sub_unit_baru,
                posisi_baru: mutasiForm.posisi_baru,
                status_mutasi: "pending",
                created_at: new Date().toISOString(),
            };

            const response = await fetch(`https://dome-backend-5uxq.onrender.com/mutasi`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Gagal menyimpan data mutasi.");
        } catch (error) {
            errorMessage = error.message;
        }
    }

    onMount(() => {
        fetchKaryawanData();
        fetchDropdownData();
    });

    function handleClick() {
        goto('/mutasi', { replaceState: true, invalidateAll: true });
    }
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
                            <select
                                id="unit"
                                bind:value={mutasiForm.unit_baru}
                                on:change={updateSubUnits}
                                class="w-full px-4 py-2 mt-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                            >
                                <option value="" disabled>Pilih Unit Baru</option>
                                {#each dropdownData as unit}
                                    <option value={unit.unit_baru}>{unit.unit_baru}</option>
                                {/each}
                            </select>
                        </div>
                        
                        <div class="mb-4">
                            <label for="subUnit" class="block text-sm font-medium text-gray-500">Sub Unit Baru</label>
                            <select
                                id="subUnit"
                                bind:value={mutasiForm.sub_unit_baru}
                                class="w-full px-4 py-2 mt-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
                            >
                                <option value="" disabled>Pilih Sub Unit Baru</option>
                                {#each subUnits as subUnit}
                                    <option value={subUnit}>{subUnit}</option>
                                {/each}
                            </select>
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
                            <button on:click={handleClick}

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
