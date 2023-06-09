import { computed, type Ref, type ComputedRef } from "vue";
const findPreviousAndNextPages = (currentPage: Ref<number>, maxPage: Ref<number>): { prevPage: ComputedRef<number | undefined>; nextPage: ComputedRef<number | undefined>; } => {
  const prevPage = computed(() => {
    const prevPage = currentPage.value - 1;
    const firstPage = 1;
    return prevPage >= firstPage ? prevPage : undefined;
  });

  const nextPage = computed(() => {
    const nextPage = currentPage.value + 1;
    return nextPage <= maxPage.value ? nextPage : undefined;
  });

  return { prevPage, nextPage };
};

export default findPreviousAndNextPages;
