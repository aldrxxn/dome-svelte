<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
  
    let employee = null;
    let isLoading = true;
    let error = null;
  
    const perner = $page.params.perner; // Ambil perner dari URL
  
    onMount(async () => {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
  
        if (!token) {
          throw new Error('Token tidak tersedia. Silakan login ulang.');
        }
  
        const response = await fetch(`https://dome-backend-5uxq.onrender.com/karyawan/${perner}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token dalam header
          },
        });
  
        if (!response.ok) {
          throw new Error(`Gagal mengambil data karyawan: ${response.status}`);
        }
  
        const data = await response.json();
        employee = data; // Assign data detail ke variabel
      } catch (err) {
        error = err.message;
      } finally {
        isLoading = false;
      }
    });
  </script>
  
  <div class="bg-white p-5 pb-10 shadow-sm rounded-lg mb-8 border-1">
    {#if isLoading}
      <p>Memuat data...</p>
    {:else if error}
      <p class="text-red-500">Error: {error}</p>
    {:else}
      <h2 class="text-2xl font-semibold mb-4">Detail Karyawan</h2>
      <div>
        <p><strong>PERNER:</strong> {employee.perner}</p>
        <p><strong>Nama:</strong> {employee.nama}</p>
        <p><strong>Jenis Kelamin:</strong> {employee.jenis_kelamin}</p>
        <p><strong>Status Pernikahan:</strong> {employee.status_pernikahan}</p>
        <p><strong>Jumlah Anak:</strong> {employee.jumlah_anak}</p>
        <p><strong>Posisi Pekerjaan:</strong> {employee.posisi_pekerjaan}</p>
        <p><strong>Unit:</strong> {employee.unit}</p>
        <p><strong>Sub Unit:</strong> {employee.sub_unit}</p>
        <p><strong>Kota:</strong> {employee.kota}</p>
        <p><strong>Gaji Pokok:</strong> Rp {parseFloat(employee.gaji_pokok).toLocaleString('id-ID')}</p>
        <!-- Tambahkan informasi lain sesuai kebutuhan -->
      </div>
    {/if}
  </div>
  