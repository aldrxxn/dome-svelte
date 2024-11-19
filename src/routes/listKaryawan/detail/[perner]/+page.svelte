<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
  
    let isLoading = true;
    let error = null;
    let employee = null;
  
    // Ambil perner dari URL
    $: perner = $page.params.perner;
  
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
        console.error(err);
      } finally {
        isLoading = false;
      }
    });
  
    function copyToClipboard(id: string) {
      const element = document.getElementById(id);
      if (element) {
        const text = element.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
          alert('Perner berhasil disalin ke clipboard!');
        }).catch(() => {
          alert('Gagal menyalin teks ke clipboard.');
        });
      }
    }
  </script>
  
  {#if isLoading}
    <p>Memuat data...</p>
  {:else if error}
    <p class="text-red-500">Error: {error}</p>
  {:else}
    <!-- Konten Detail Karyawan -->
    <div class="flex flex-col p-5 bg-white shadow-md rounded-lg">
      <!-- Tombol Kembali -->
      <div class="flex items-center mb-4">
        <button on:click={() => history.back()} class="text-black hover:text-gray-600">
          ←
        </button>
        <h1 class="ml-4 text-xl font-bold text-blue-900">Detail Karyawan</h1>
      </div>
  
      <!-- Informasi Karyawan -->
      <div class="flex items-center justify-normal">
        <h2 class="text-2xl font-bold">{employee.nama}</h2>
        <span
          class="ml-4 px-3 py-1 text-red-500 bg-red-100 rounded-full text-sm font-semibold"
        >
          {employee.unit}
        </span>
      </div>
      <div class="flex items-center mt-4">
        <p class="text-gray-500">Perner: </p>
        <p class="ml-2 text-red-500 font-semibold" id="pernerId">{employee.perner}</p>
        <button
          class="ml-2 text-gray-500 hover:text-gray-700"
          on:click={() => copyToClipboard('pernerId')}
          title="Copy Perner"
        >
          📋
        </button>
      </div>
  
      <!-- Detail Pekerjaan -->
      <div class="bg-white border-[#E9E9E9] border-2 rounded-lg p-4 mt-7">
        <!-- Header Detail Pekerjaan -->
        <div class="flex justify-normal items-center mb-4">
          <h2 class="text-xl font-bold mr-4">Detail Pekerjaan</h2>
          <span class="p-4 py-1 bg-[#1CB993] text-white rounded-lg">
            Aktif
          </span>
        </div>
  
        <!-- Konten Informasi Personal dan Pekerjaan -->
        <div class="grid grid-cols-3 md:grid-cols-3 gap-8">
          <!-- Informasi Personal -->
          <div class="border-r-[#E9E9E9] border-r-2 pr-6">
            <h3 class="text-[#CF3C3C] font-bold mb-2">Informasi Personal</h3>
            <p class="text-[#ABABAB]">Jenis Kelamin</p>
            <p class="font-semibold mb-3">{employee.jenis_kelamin}</p>
            <p class="text-[#ABABAB]">Status Pernikahan</p>
            <p class="font-semibold mb-3">{employee.status_pernikahan}</p>
            <p class="text-[#ABABAB]">Jumlah Anak</p>
            <p class="font-semibold">{employee.jumlah_anak}</p>
          </div>
  
          <!-- Informasi Pekerjaan -->
          <div>
            <h3 class="text-[#CF3C3C] font-bold mb-2">Informasi Pekerjaan</h3>
            <div>
              <p class="text-[#ABABAB]">Posisi Pekerjaan</p>
              <p class="font-semibold mb-3">{employee.posisi_pekerjaan}</p>
  
              <p class="text-[#ABABAB]">Kategori Posisi</p>
              <p class="font-semibold mb-3">{employee.kategori_posisi}</p>
  
              <p class="text-[#ABABAB]">Unit</p>
              <p class="font-semibold mb-3">{employee.unit}</p>
            </div>
            <p class="text-[#ABABAB] mt-4">Sub Unit</p>
            <p class="font-semibold mb-3">{employee.sub_unit}</p>
          </div>
  
          <!-- Informasi Tambahan -->
          <div>
            <div class="text-[#CF3C3C] font-bold mb-4">&nbsp;</div> <!-- Placeholder -->
            <div>
              <p class="text-[#ABABAB]">Nama Atasan</p>
              <p class="font-semibold mb-3">{employee.nama_atasan}</p>
              <p class="text-[#ABABAB]">Kota</p>
              <p class="font-semibold mb-3">{employee.kota}</p>
              <p class="text-[#ABABAB]">NIK Atasan</p>
              <p class="font-semibold mb-3">{employee.nik_atasan}</p>
              <!-- Jika ada informasi tambahan, tambahkan di sini -->
            </div>
          </div>
        </div>
      </div>
  
      <!-- Bagian Kompensasi dan Tunjangan -->
      <div class="bg-white border-[#E9E9E9] border-2 rounded-lg p-4 mt-7">
        <!-- Header -->
        <h2 class="text-xl font-bold mb-6">Kompensasi dan Tunjangan</h2>
  
        <!-- Konten -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Kolom Kompensasi dan Gaji -->
          <div>
            <h3 class="text-[#CF3C3C] font-bold mb-4">Kompensasi dan Gaji</h3>
            <div>
              <p class="text-[#ABABAB]">Sumber Anggaran</p>
              <p class="font-semibold mb-3">{employee.sumber_anggaran}</p>
              <p class="text-[#ABABAB]">Skema UMK</p>
              <p class="font-semibold mb-3">{employee.skema_umk}</p>
              <p class="text-[#ABABAB]">Gaji Pokok</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.gaji_pokok).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">Tunjangan Operasional</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.tunjangan_operasional).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">PPH 21</p>
              <p class="font-semibold">Rp {parseFloat(employee.pph_21).toLocaleString('id-ID')}</p>
            </div>
          </div>
  
          <!-- Kolom THP dan Penghasilan -->
          <div>
            <div class="text-[#CF3C3C] font-bold mb-4">&nbsp;</div> <!-- Placeholder -->
            <div>
              <p class="text-[#ABABAB]">THP (Take Home Pay)</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.take_home_pay).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">THR (Tunjangan Hari Raya)</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.tunjangan_hari_raya).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">Penghasilan Bruto</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.gaji_kotor).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">% PPH (Pajak Penghasilan)</p>
              <p class="font-semibold mb-3">{parseFloat(employee.pajak_penghasilan) * 100}%</p>
              <p class="text-[#ABABAB]">THP Gross + PPH 21</p>
              <p class="font-semibold">Rp {parseFloat(employee.thp_gross_pph_21).toLocaleString('id-ID')}</p>
            </div>
          </div>
  
          <!-- Kolom Tunjangan dan Perlindungan -->
          <div>
            <h3 class="text-[#CF3C3C] font-bold mb-4">Tunjangan dan Perlindungan</h3>
            <div>
              <p class="text-[#ABABAB]">Uang Kehadiran</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.uang_kehadiran).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">BPJS Ketenagakerjaan</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.bpjs_ketenagakerjaan).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">BPJS Kesehatan</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.bpjs_kesehatan).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">Perlindungan Asuransi</p>
              <p class="font-semibold mb-3">{employee.perlindungan_asuransi}</p>
              <p class="text-[#ABABAB]">Tunjangan Ekstra</p>
              <p class="font-semibold mb-3">{employee.tunjangan_ekstra}</p>
            </div>
          </div>
  
          <!-- Kolom Lainnya -->
          <div>
            <div class="text-[#CF3C3C] font-bold mb-4">&nbsp;</div> <!-- Placeholder -->
            <div>
              <p class="text-[#ABABAB]">Invoice Bulanan</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.invoice_bulanan).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">Invoice Kontrak</p>
              <p class="font-semibold mb-3">Rp {parseFloat(employee.invoice_kontrak).toLocaleString('id-ID')}</p>
              <p class="text-[#ABABAB]">Tunjangan Lainnya</p>
              <p class="font-semibold">Rp {parseFloat(employee.tunjangan_lainnya).toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Histori Pekerjaan -->
      <!-- Jika tersedia dalam data, Anda bisa menambahkan bagian histori pekerjaan -->
    </div>
  {/if}
  