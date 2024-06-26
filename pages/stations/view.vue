<template>
    <div class="flex justify-center text-black font-semibold text-4xl mt-5">
        <div class="text-orange-500">
            ==========================================&nbsp;&nbsp;
        </div>
        <p>Station List</p>
        <div class="text-orange-500">
            &nbsp;&nbsp;==========================================
        </div>
    </div>

    <div class="flex justify-center text-black text-xl mt-5">
        <p class="mr-2 mt-2">Station Name :</p>
        <input
            type="text"
            v-model="searchTerm"
            placeholder="Search..."
            class="bg-white px-4 py-2 rounded-md border border-gray-300 w-3/6"
        />
        <button
            @click="search"
            class="bg-green-500 rounded-md text-white px-4 py-2 hover:bg-green-600 w-32 ml-2 flex items-center justify-center"
        >
            <span class="mr-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
            </span>
            Search
        </button>
    </div>

    <div class="container flex items-center ml-[165px] text-black">
        <div class="user-cards flex flex-wrap justify-center mt-5">
            <div
                v-for="product in products"
                :key="product.id"
                class="user-card w-[calc(40%-2rem)] p-4 m-4 border rounded-xl flex items-center shadow-xl shadow-black/20 bg-[#E7E7E7]"
            >
                <div>
                    <div
                        class="w-[200px] h-[150px] object-cover overflow-hidden"
                    >
                        <Button @click="navigateTo(`/stations/${product.id}`)">
                            <img
                                :src="product.image"
                                :alt="product.title"
                                class="w-full h-full mt-3 object-cover transform hover:border-2 border-red-500"
                            />
                        </Button>
                    </div>
                </div>
                <div class="ml-5">
                    <div class="text-lg">{{ product.id }}</div>
                    <div class="text-gray-600 mt-5 flex">
                        <span class="mr-2"
                            ><svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                />
                            </svg> </span
                        >{{ product.title }}
                    </div>
                    <div class="text-gray-600 mt-5 flex">
                        <span class="mr-2"
                            ><svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                                />
                            </svg> </span
                        >{{ product.category }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-10 mb-10 flex justify-center">
        <UPagination
            v-model:selectedPage="page"
            :page-count="Math.ceil(products.length / pageCount)"
            :total="products.length"
            :ui="{
                wrapper: 'flex items-center gap-1',
                rounded: '!rounded-full min-w-[32px] justify-center',
                default: {
                    activeButton: {
                        variant: 'outline',
                    },
                },
            }"
        />
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
const products = ref<any>([]);
const currentPage = ref(1);
const pageSize = 10;
const page = ref(1);
const pageCount = ref(2);
const pageTotal = ref(10);
const searchTerm = ref("");
const filteredProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = currentPage.value * pageSize;
    return products.value
        .filter((product: any) => {
            return product.id.toString().includes(searchTerm.value);
        })
        .slice(start, end);
});

const fetchData = async () => {
    try {
        const response = await axios.get("https://fakestoreapi.com/products");
        products.value = response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

onMounted(() => {
    fetchData();
});

const search = () => {
    currentPage.value = 1;
};

</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300&display=swap");

body {
    background-color: #f7fafc;
    font-family: "Kanit", sans-serif;
}
</style>
