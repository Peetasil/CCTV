<template>
    <div class="flex justify-left text-black text-xl ml-52 mt-5">
          <UButton color="sky" size="xl" variant="solid" @click="navigateTo('/users/create')">Add User</UButton>
        </div>

        <span class="flex items-center  gap-3  px-4 py-3 ml-[230px] text-black">Username
            <span class="flex items-center  gap-96  px-2 py-3 ml-[105px] text-black">Fullname
                <span class="flex items-center   px-4 py-3 ml-[-265px] text-black">Email</span></span></span> 
        
        <div class="flex items-center  px-3 ml-[230px] ">      
        <UInput v-model="search"  />
        <div class="flex items-center   px-3  ">      
        <UInput v-model="searchFullname" />
        </div>
        <div class="flex items-center  px-3 ml-[-10px]">      
        <UInput v-model="searchEmail"  />
        </div>
        <div class="flex justify-left ">
            <UButton color="green" block @click="searchUsers">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
  Search
</UButton>
            </div>
        </div>

        <div class="flex items-center gap-1.5 ml-52 mt-10">
          <span class="text-xl leading-5">Show</span>
  
          <USelect
            v-model="pageCount"
            :options="[3, 5, 10, 20, 30, 40]"
            class="me-2 w-20"
            size="xl"
          /><span class="text-xl leading-5">entries</span>
        </div>
    <UCard
      class="w-10/12 ml-52 rounded-none"
      :ui="{
        base: '',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-5 ' },
        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
        footer: { padding: 'p-4'  }
      }"
  >
  
      <UTable
        
        v-model:sort="sort"
        :rows="todos"
        :columns="columnsTable"
        :loading="pending"
        sort-asc-icon="i-heroicons-arrow-up "
        
        sort-desc-icon="i-heroicons-arrow-down"
        :sort-button="{  color: 'white', variant: '', size: '2xl', square: false, ui: { rounded: 'rounded-full', font: 'font-bold' } }"
        sort-mode="manual"
        class="w-full mt-5 bg-white "
        :ui="{ td: { base: 'max-w-[0] truncate  ' }, th: { class: selectedRows.length > 0 ? 'bg-orange-500 text-xl font-semibold text-white' : 'bg-orange-500 text-xl font-semibold text-white' } }"
        @select="select">
      
        <template #row="{ row }">
            <span class="bg-orange-400">{{ row }}</span>
        </template>

        <template  #id-data="{ row }  ">
        <span class="">{{ row.id }}</span>
      </template>
  
        <template #completed-data="{ row }" >
          <UBadge size="xs" :label="row.completed ? 'Completed' : 'In Progress'" :color="row.completed ? 'emerald' : 'orange'" variant="subtle" />
        </template>
  
        <template #title-data="{ row }">
        <span class="">{{ row.title }}</span>
      </template>
      
      <template #selectedRows-data="{ row }" >
        <input type="checkbox" id="horns" name="horns" class="ml-3" />
    <label for="horns"></label>
        </template>

        <template #actions-data="{ row }" >
          <UButton  color="purple" size="xl" variant="solid" @click="navigateTo('CreateUser')"><span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </span>
                Edit</UButton>
  
        </template>
      </UTable>
  
      
      
     
    </UCard>
    
    <div class="flex flex-wrap justify-between items-center ml-52  mt-5 mb-10">
          <div>
            <span class="text-sm leading-5">
              Showing
              <span class="font-medium">{{ pageFrom }}</span>
              to
              <span class="font-medium">{{ pageTo }}</span>
              of
              <span class="font-medium">{{ pageTotal }}</span>
              entries
            </span>
          </div>
  
          <UPagination class="mr-24 "
          :prev-button="{  label: 'Prev', color: 'gray' }"
      :next-button="{  trailing: true, label: 'Next', color: 'gray' }"
            v-model="page"
            :page-count="pageCount"
            :total="pageTotal"
            :ui="{
              wrapper: 'flex items-center gap-1',
              
              default: {
                activeButton: {
                  variant: 'outline'
                }
              }
            }"
          />
        </div>
  </template>
  
  
  
  
  
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  
  const searchFullname = ref('');
  const searchEmail = ref('');

  const searchUsers = () => {
    
  };
  const columns = [
  {
    key: 'selectedRows',
    label: 'Select',
    class:'bg-orange-500 text-xl font-semibold text-white',
  },{
    key: 'title',
    label: 'User',
    class:'bg-orange-500 text-xl font-semibold text-white',
    sortable: true
  }, {
    key: 'title',
    label: 'Fullname',
    class:'bg-orange-500 text-xl text-white',
    sortable: true
  }, {
    key: 'title',
    label: 'Email',
    class:'bg-orange-500 text-xl text-white',
    
  }, {
    key: 'title',
    label: 'Role',
    class:'bg-orange-500 text-xl text-white',
    
  }, {
    key: 'actions',
    label: 'Manage',
    class:'bg-orange-500 text-xl text-white',
    sortable: false
  }]
  
  const selectedColumns = ref(columns)
  const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))
  const selectedRows = ref([])
  function select (row) {
  const index = selectedRows.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1)
  }
}
  
  const search = ref('')
  const selectedStatus = ref([])
  const searchStatus = computed(() => {
  let searchQuery = '';
  if (searchFullname.value) {
    searchQuery += `&fullname=${searchFullname.value}`;
  }
  if (searchEmail.value) {
    searchQuery += `&email=${searchEmail.value}`;
  }
  return searchQuery;
});
  const resetFilters = () => {
    search.value = ''
    selectedStatus.value = []
  }
  
  const sort = ref({ column: 'id', direction: 'asc' as const })
  const page = ref(1)
  const pageCount = ref(10)
  const pageTotal = ref(200) 
  const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
  const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))
  
  const { data: todos, pending } = await useLazyAsyncData<{
    id: number
    title: string
    completed: string 
  }[]>('todos', () => ($fetch as any)(`https://jsonplaceholder.typicode.com/todos${searchStatus.value}`, {
    query: {
      q: search.value,
      '_page': page.value,
      '_limit': pageCount.value,
      '_sort': sort.value.column,
      '_order': sort.value.direction
    }
  }), {
    default: () => [],
    watch: [page, search, searchStatus, pageCount, sort]
  })
  </script>
  
  