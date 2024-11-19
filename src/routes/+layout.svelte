<script>
	import { page } from '$app/stores';
	import Sidebar from '../components/Sidebar.svelte';
	import '../app.css';

  </script>
  
  <div class="flex">
	<!-- Sidebar hanya muncul jika bukan di halaman login -->
	{#if $page.url.pathname !== '/'}
	  <Sidebar />
	{/if}
  
	<!-- Konten utama -->
	<div class="{ $page.url.pathname === '/' ? 'flex-1' : 'flex-1 bg-gray-50 p-6 min-h-screen' }">
	  <slot />
	</div>
  </div>
  